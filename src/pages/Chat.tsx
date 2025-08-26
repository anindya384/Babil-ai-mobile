import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { ChatInput } from '@/components/Chat/ChatInput';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Trash2, Crown, LogOut } from 'lucide-react';

interface AIResponse {
  provider: string;
  response: string;
  error?: string;
  loading?: boolean;
}

interface ChatMessage {
  id: string;
  message: string;
  aiResponses?: AIResponse[];
  isUser: boolean;
  timestamp: Date;
}

const POPUP_INTERVAL = 5;

export default function Chat() {
  const { user, getDailyQuestionsRemaining, incrementDailyQuestions } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [showDailyLimitReached, setShowDailyLimitReached] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState(0); // Start with 0, will be loaded from DB

  useEffect(() => {
    const loadInitialData = async () => {
      // Load chat history from localStorage
      const savedHistory = localStorage.getItem('babil-chat-history-chat');
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        // Filter history to only show today's messages
        const today = new Date().toDateString();
        const todayHistory = history.filter((msg: ChatMessage) => 
          new Date(msg.timestamp).toDateString() === today
        );
        
        if (todayHistory.length > 0) {
          setMessages(todayHistory);
        } else {
          // Add welcome message if no history
          setMessages([
            {
              id: '1',
              message: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
              aiResponses: [{
                provider: 'babil',
                response: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
              }],
              isUser: false,
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // Add welcome message if no history
        setMessages([
          {
            id: '1',
            message: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
            aiResponses: [{
              provider: 'babil',
              response: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
            }],
            isUser: false,
            timestamp: new Date(),
          },
        ]);
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
    if (messages.length > 0) {
      localStorage.setItem('babil-chat-history-chat', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Check if user has reached daily limit
    if (remainingQuestions <= 0) {
      setShowDailyLimitReached(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create loading message
    const loadingAIResponses: AIResponse[] = [
      { provider: 'chatgpt', response: '', loading: true },
      { provider: 'claude', response: '', loading: true },
      { provider: 'gemini', response: '', loading: true },
      { provider: 'grok', response: '', loading: true },
      { provider: 'perplexity', response: '', loading: true },
      { provider: 'mistral', response: '', loading: true },
    ];

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: message, // Store the user's question
      aiResponses: loadingAIResponses,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Prepare user context for personalized responses
      // Construct user context for AI personalization (simplified)
      const userContext = {
        fullName: user?.user_metadata?.full_name || 'User',
        email: user?.email || '',
        userId: user?.id || '',
      };

      // Call the multi-AI edge function
      const { data, error } = await supabase.functions.invoke('multi-ai-chat', {
        body: { 
          message,
          userContext: userContext
        },
      });

      if (error) {
        console.error('Error calling multi-AI function:', error);
        toast({
          title: "Error",
          description: "Failed to get responses from AI providers. Please try again.",
          variant: "destructive",
        });
        
        // Update with error responses
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? {
                ...msg,
                aiResponses: loadingAIResponses.map(resp => ({
                  ...resp,
                  loading: false,
                  error: 'Service temporarily unavailable',
                }))
              }
            : msg
        ));
      } else {
        // Update with actual responses
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, aiResponses: data.responses }
            : msg
        ));
      }

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

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([
      {
        id: '1',
        message: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
        aiResponses: [{
          provider: 'babil',
          response: 'Welcome to Babil.ai! I\'m your multi-AI assistant. I can simultaneously query ChatGPT, Claude, Gemini, Grok, Perplexity, and Mistral to give you comprehensive responses. What would you like to know?',
        }],
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    // Don't reset remaining questions - only clear display
    localStorage.removeItem('babil-chat-history-chat');
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
    // TODO: Implement premium upgrade flow
    toast({
      title: "Premium Upgrade",
      description: "Premium features coming soon! Please check back later.",
    });
    setShowDailyLimitReached(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header with remaining questions count */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {remainingQuestions} questions remaining today
            </Badge>
            {messages.length > 1 && (
              <Button variant="outline" size="sm" onClick={clearHistory} className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-200px)]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  aiResponses={msg.aiResponses}
                  isUser={msg.isUser}
                />
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 pt-4 border-t">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading || remainingQuestions <= 0}
              placeholder={remainingQuestions <= 0 ? "Daily limit reached" : "Type your message..."}
            />
            {remainingQuestions <= 0 && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                You've reached your daily limit. Please try again tomorrow.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Limit Popup */}
      <Dialog open={showLimitPopup} onOpenChange={setShowLimitPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Questions Remaining
            </DialogTitle>
            <DialogDescription>
              You have {remainingQuestions} questions remaining today out of 20 total.
              {remainingQuestions <= 5 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ You're running low on questions for today!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowLimitPopup(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Daily Limit Reached Dialog */}
      <Dialog open={showDailyLimitReached} onOpenChange={setShowDailyLimitReached}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center">
              <Crown className="h-6 w-6 text-yellow-500" />
              Daily Limit Reached
            </DialogTitle>
            <DialogDescription className="text-center">
              You've used all 20 free questions for today.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Choose an option to continue:
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={handleUpgradeToPro} 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro (Unlimited Questions)
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out & Come Back Tomorrow
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              <p>Free users get 20 questions per day</p>
              <p>Pro users get unlimited questions + premium features</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}