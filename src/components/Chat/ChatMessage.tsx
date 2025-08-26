import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, User } from 'lucide-react';

interface AIResponse {
  provider: string;
  response: string;
  error?: string;
  loading?: boolean;
}

interface ChatMessageProps {
  message: string;
  aiResponses?: AIResponse[];
  isUser: boolean;
}

const providerColors: Record<string, string> = {
  chatgpt: 'bg-orange-500',
  claude: 'bg-orange-600',
  gemini: 'bg-blue-500',
  grok: 'bg-cyan-500',
  perplexity: 'bg-purple-500',
  mistral: 'bg-pink-500',
};

const providerNames: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  grok: 'Grok',
  perplexity: 'Perplexity',
  mistral: 'Mistral',
};

export function ChatMessage({ message, aiResponses, isUser }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-start space-x-2 max-w-3xl">
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2">
            <p className="text-sm">{message}</p>
          </div>
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-2 max-w-6xl w-full">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 space-y-3">
          {/* Display the user question above AI responses */}
          {message && (
            <div className="bg-muted rounded-lg px-4 py-3 mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">Question:</p>
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiResponses?.map((aiResponse, index) => (
              <Card key={index} className="relative">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span>{providerNames[aiResponse.provider] || aiResponse.provider}</span>
                    <Badge 
                      className={`${providerColors[aiResponse.provider] || 'bg-gray-500'} text-white`}
                    >
                      {providerNames[aiResponse.provider] || aiResponse.provider}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {aiResponse.loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  ) : aiResponse.error ? (
                    <p className="text-sm text-destructive">{aiResponse.error}</p>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{aiResponse.response}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}