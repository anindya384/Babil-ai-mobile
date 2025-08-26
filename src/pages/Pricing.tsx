import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';

const Pricing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/purchase');
  };

  const handleContactSales = () => {
    // TODO: Implement contact sales functionality
    window.open('mailto:sales@babilai.in', '_blank');
  };

  return (
    <div className="min-h-screen x2-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 text-sm x2-accent-bg">
            Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="x2-text">Simple, Transparent</span>{' '}
            <span className="x2-accent">Pricing</span>
          </h1>
          <p className="text-xl x2-text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core AI aggregation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="x2-card border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold x2-text">Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold x2-accent">$0</span>
                <span className="x2-text-secondary ml-2">/forever</span>
              </div>
              <p className="text-sm x2-text-secondary mt-2">
                Get started with basic AI access
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Access to all AI models</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">20 messages per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Basic chat interface</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Community support</span>
                </li>
              </ul>
              <Button 
                onClick={handleGetStarted}
                className="w-full x2-btn-secondary mt-6"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Most Popular */}
          <Card className="x2-card border-2 border-x2-accent relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="x2-accent-bg px-3 py-1 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold x2-text">Pro</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold x2-accent">$3.5</span>
                <span className="x2-text-secondary ml-2">/per month</span>
              </div>
              <p className="text-sm x2-text-secondary mt-2">
                Access all premium AI models
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Access to all 6+ premium AI models</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Unlimited messages</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Side-by-side AI comparison</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Prompt enhancement</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Image generation</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Audio transcription</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Advanced analytics</span>
                </li>
              </ul>
                             <Button 
                 onClick={handleGetStarted}
                 className="w-full x2-btn-primary mt-6"
               >
                 Let's Go Premium
               </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="x2-card border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold x2-text">Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold x2-accent">Custom</span>
              </div>
              <p className="text-sm x2-text-secondary mt-2">
                For teams and organizations
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Custom AI model integration</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Team collaboration tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Advanced security & compliance</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 x2-accent mr-3 flex-shrink-0" />
                  <span className="x2-text">SLA guarantee</span>
                </li>
              </ul>
              <Button 
                onClick={handleContactSales}
                className="w-full x2-btn-secondary mt-6"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold x2-text mb-4">
              Frequently Asked Questions
            </h2>
            <p className="x2-text-secondary">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  Can I switch between plans?
                </h3>
                <p className="x2-text-secondary">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  What happens when I reach my daily limit?
                </h3>
                <p className="x2-text-secondary">
                  Free users get 20 questions per day. When you reach the limit, you can upgrade to Pro for unlimited access or wait until tomorrow.
                </p>
              </CardContent>
            </Card>
            
            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  Do you offer refunds?
                </h3>
                <p className="x2-text-secondary">
                  We offer a 30-day money-back guarantee for all Pro subscriptions. If you're not satisfied, we'll refund your payment.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 text-center">
          <Card className="x2-card border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold x2-text mb-4">
                Ready to Get Started?
              </h2>
              <p className="x2-text-secondary mb-6">
                Join thousands of users who are already leveraging multiple AI models to make better decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                 <Button 
                   onClick={handleGetStarted}
                   className="x2-btn-primary"
                 >
                   Get Pro Plan
                 </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="x2-btn-secondary"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
