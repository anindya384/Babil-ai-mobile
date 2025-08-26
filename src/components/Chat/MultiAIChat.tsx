import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, AlertCircle, Crown, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface AIResponse {
  provider: string;
  response: string;
  error?: string;
  loading?: boolean;
}

interface ChatHistoryItem {
  id: string;
  question: string;
  responses: AIResponse[];
  timestamp: Date;
}

const AI_PROVIDERS = [
  { name: 'ChatGPT', id: 'chatgpt', color: 'bg-green-500' },
  { name: 'Claude', id: 'claude', color: 'bg-orange-500' },
  { name: 'Gemini', id: 'gemini', color: 'bg-blue-500' },
  { name: 'Grok', id: 'grok', color: 'bg-purple-500' },
  { name: 'Perplexity', id: 'perplexity', color: 'bg-cyan-500' },
  { name: 'Mistral', id: 'mistral', color: 'bg-red-500' }
];

const POPUP_INTERVAL = 5;

export function MultiAIChat() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [showDailyLimitReached, setShowDailyLimitReached] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(0); // Start with 0, will be loaded from DB
  const { toast } = useToast();
  const { user, getDailyQuestionsRemaining, incrementDailyQuestions } = useAuth();

  // Load chat history from localStorage and remaining questions from database
  useEffect(() => {
    const loadInitialData = async () => {
      // Load chat history from localStorage
      const savedHistory = localStorage.getItem('babil-chat-history');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // Filter history to only show today's questions
        const today = new Date().toDateString();
        const todayHistory = history.filter((item: ChatHistoryItem) => 
          new Date(item.timestamp).toDateString() === today
        );
        setChatHistory(todayHistory);
      }
      
      // Load remaining questions from database
      if (user?.id) {
        try {
          const remaining = await getDailyQuestionsRemaining();
          setRemainingQuestions(remaining);
        } catch (error) {
          console.error('Error loading daily questions:', error);
          setRemainingQuestions(0); // Don't fallback to hardcoded value
        }
      }
    };

    loadInitialData();
  }, [user?.id, getDailyQuestionsRemaining]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('babil-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    // Check if user has reached daily limit
    if (remainingQuestions <= 0) {
      setShowDailyLimitReached(true);
      return;
    }

    setLoading(true);
    
    // Initialize responses with loading state
    const initialResponses = AI_PROVIDERS.map(provider => ({
      provider: provider.id,
      response: '',
      loading: true
    }));

    // Create new chat history item
    const newChatItem: ChatHistoryItem = {
      id: Date.now().toString(),
      question: prompt,
      responses: initialResponses,
      timestamp: new Date(),
    };

    // Add to chat history (at the beginning to show latest first)
    setChatHistory(prev => [newChatItem, ...prev]);

    try {
      // Prepare user context for personalized responses
      // Construct user context for AI personalization (simplified)
      const userContext = {
        fullName: user?.user_metadata?.full_name || 'User',
        email: user?.email || '',
        userId: user?.id || '',
      };

      const { data, error } = await supabase.functions.invoke('multi-ai-chat', {
        body: { 
          message: prompt,
          userContext: userContext
        }
      });

      if (error) throw error;

      // Update the chat history with actual responses
      setChatHistory(prev => prev.map(item => 
        item.id === newChatItem.id 
          ? { ...item, responses: data.responses || [] }
          : item
      ));

      // Update remaining questions count in database
      try {
        const newRemaining = await incrementDailyQuestions();
        setRemainingQuestions(newRemaining);
        
        // Show popup every 5 questions
        const questionsUsed = 20 - newRemaining; // Use 20 as the base limit
        if (questionsUsed % POPUP_INTERVAL === 0) {
          setShowLimitPopup(true);
        }
      } catch (error) {
        console.error('Error updating daily questions:', error);
        // Fallback: decrement locally
        setRemainingQuestions(prev => prev - 1);
      }

      setPrompt('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI responses. Please try again.",
      });
      console.error('Error:', error);
      
      // Update with error responses
      setChatHistory(prev => prev.map(item => 
        item.id === newChatItem.id 
          ? {
              ...item,
              responses: initialResponses.map(resp => ({
                ...resp,
                loading: false,
                error: 'Service temporarily unavailable',
              }))
            }
          : item
      ));
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
    // Don't reset remaining questions - only clear display
    localStorage.removeItem('babil-chat-history');
    toast({
      title: "History Cleared",
      description: "Chat history has been cleared. Question count remains unchanged.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const handleUpgradeToPro = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 x2-bg min-h-screen">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Bot className="h-8 w-8 x2-accent mr-2" />
          <h1 className="text-2xl font-bold x2-text">Babil Multi-AI Chat</h1>
        </div>
        <p className="x2-text-secondary">
          Ask one question and get responses from multiple AI models simultaneously
        </p>
        <div className="mt-2 flex items-center justify-center space-x-4">
          <Badge variant="outline" className="x2-card x2-text x2-accent-border">
            {remainingQuestions} questions remaining today
          </Badge>
          {chatHistory.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory} className="x2-btn-secondary">
              Clear History
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask any question to multiple AI models..."
            className="min-h-[100px] resize-none x2-card x2-text border-0 focus:ring-2 focus:ring-x2-accent"
            disabled={loading || remainingQuestions <= 0}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading || !prompt.trim() || remainingQuestions <= 0}
          className="w-full x2-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting responses...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send to All AIs ({remainingQuestions} remaining)
            </>
          )}
        </Button>
      </form>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="space-y-6">
          {chatHistory.map((chatItem) => (
            <div key={chatItem.id} className="space-y-4">
              {/* Question */}
              <div className="x2-card px-4 py-3">
                <p className="text-sm font-medium x2-accent mb-1">Question:</p>
                <p className="text-sm x2-text">{chatItem.question}</p>
                <p className="text-xs x2-text-secondary mt-2">
                  {new Date(chatItem.timestamp).toLocaleString()}
                </p>
              </div>
              
              {/* AI Responses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chatItem.responses.map((response, index) => {
                  const provider = AI_PROVIDERS.find(p => p.id === response.provider);
                  return (
                    <Card key={`${chatItem.id}-${response.provider}`} className="h-fit x2-card border-0">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm x2-text">
                          <span className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${provider?.color} mr-2`} />
                            {provider?.name}
                          </span>
                          {response.loading && (
                            <Loader2 className="h-4 w-4 animate-spin x2-accent" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {response.loading ? (
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
                          </div>
                        ) : response.error ? (
                          <div className="text-red-400 text-sm">
                            <Badge variant="destructive" className="mb-2">Error</Badge>
                            <p>{response.error}</p>
                          </div>
                        ) : (
                          <div className="text-sm whitespace-pre-wrap x2-text">
                            {response.response}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Limit Popup */}
      <Dialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <DialogContent className="x2-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 x2-text">
              <AlertCircle className="h-5 w-5 x2-accent" />
              Questions Remaining
            </DialogTitle>
            <DialogDescription className="x2-text-secondary">
              You have {remainingQuestions} questions remaining today out of 20 total.
              {remainingQuestions <= 5 && (
                <span className="block mt-2 x2-accent font-medium">
                  ⚠️ You're running low on questions for today!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowLimitPopup(false)} className="x2-btn-primary">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Limit Reached Dialog */}
      <Dialog open={showDailyLimitReached} onOpenChange={setShowDailyLimitReached}>
        <DialogContent className="max-w-md x2-card border-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center x2-text">
              <Crown className="h-6 w-6 x2-accent" />
              Daily Limit Reached
            </DialogTitle>
            <DialogDescription className="text-center x2-text-secondary">
              You've used all 20 free questions for today.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm x2-text-secondary mb-4">
                Choose an option to continue:
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleUpgradeToPro} 
                className="w-full x2-btn-primary"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro (Unlimited Questions)
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full x2-btn-secondary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out & Come Back Tomorrow
              </Button>
            </div>
            
            <div className="text-xs text-center x2-text-secondary">
              <p>Free users get 20 questions per day</p>
              <p>Pro users get unlimited questions + premium features</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}