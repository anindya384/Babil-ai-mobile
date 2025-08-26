import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { MultiAIChat } from '@/components/Chat/MultiAIChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, Zap, Users, Shield, Play, Star, Users2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-8 mb-16">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold">
                <span className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">
                  One Prompt
                </span>
                <span className="text-foreground">, </span>
                <br />
                <span className="text-foreground">Multiple AI Minds</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Send your question to ChatGPT, Claude, Perplexity, Gemini, Grok, and more 
                simultaneously. Compare responses, get diverse perspectives, and make 
                better decisions faster.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] hover:opacity-90 text-white border-0"
              >
                Let's Get Started →
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 bg-transparent border-foreground/20 text-foreground hover:bg-foreground/10"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* AI Models Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-24">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-[hsl(158,64%,52%)] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">ChatGPT</h3>
                <p className="text-sm text-muted-foreground">GPT-4 & GPT-3.5</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-[hsl(14,100%,57%)] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Claude</h3>
                <p className="text-sm text-muted-foreground">Claude-3 Sonnet</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-[hsl(264,83%,58%)] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Perplexity</h3>
                <p className="text-sm text-muted-foreground">Llama 3.1</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-[hsl(220,70%,60%)] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Gemini</h3>
                <p className="text-sm text-muted-foreground">Gemini 1.5</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-[hsl(338,78%,60%)] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Grok</h3>
                <p className="text-sm text-muted-foreground">Grok Beta</p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Why Choose Babil.ai Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Why Choose <span className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">Babil.ai</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the power of multiple AI models working together to provide you with 
                comprehensive insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Multi-AI Power</h3>
                  <p className="text-muted-foreground">
                    Send one prompt to ChatGPT, Claude, Perplexity, Gemini, Grok, and more simultaneously.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Get responses from multiple AI models in parallel, saving you time and effort.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Secure & Private</h3>
                  <p className="text-muted-foreground">
                    Your conversations are encrypted and never shared with third parties.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-6">
                    <Users2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Team Collaboration</h3>
                  <p className="text-muted-foreground">
                    Share insights and collaborate with your team using the same AI responses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                How It <span className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">Works</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-8 text-2xl font-bold text-white">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Write Your Prompt</h3>
                <p className="text-muted-foreground text-lg">
                  Type your question or request in our intuitive chat interface.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-8 text-2xl font-bold text-white">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Select AI Models</h3>
                <p className="text-muted-foreground text-lg">
                  Choose which AI models you want to respond to your prompt.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] flex items-center justify-center mx-auto mb-8 text-2xl font-bold text-white">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Get Multiple Responses</h3>
                <p className="text-muted-foreground text-lg">
                  Receive comprehensive answers from all selected AI models simultaneously.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                What Our Users <span className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)] bg-clip-text text-transparent">Say</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 text-lg leading-relaxed">
                    "Babil AI has revolutionized how we gather insights. Getting multiple AI perspectives on 
                    the same question is game-changing."
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">Sarah Chen</p>
                    <p className="text-muted-foreground">Product Manager at TechCorp</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 text-lg leading-relaxed">
                    "The speed and accuracy of responses from multiple AI models help me validate 
                    hypotheses much faster."
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">Marcus Rodriguez</p>
                    <p className="text-muted-foreground">Data Scientist at DataFlow</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 text-lg leading-relaxed">
                    "I love how I can compare different AI writing styles and choose the best approach for my 
                    content."
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">Emily Watson</p>
                    <p className="text-muted-foreground">Content Creator at Creative Studio</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(195,100%,50%)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of AI?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands of users who are already leveraging multiple AI models to make better 
              decisions.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              >
                Let's Get Started →
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-background border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bot className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-foreground">Babil.ai</span>
                </div>
                <p className="text-muted-foreground">
                  The future of AI collaboration. One prompt, multiple AI minds.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">API</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground">Status</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <p className="text-muted-foreground">© 2024 Babil.ai. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <MultiAIChat />
      </main>
    </div>
  );
};

export default Index;