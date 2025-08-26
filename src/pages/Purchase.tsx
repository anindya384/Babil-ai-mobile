import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

const Purchase = () => {
  const navigate = useNavigate();

  const handleBackToPricing = () => {
    navigate('/pricing');
  };

  const handleContactSales = () => {
    window.open('mailto:sales@babilai.in?subject=Enterprise%20Inquiry', '_blank');
  };

  const handlePurchasePro = () => {
    // TODO: Implement actual payment processing
    alert('Payment processing will be implemented here. This is a demo.');
  };

  return (
    <div className="min-h-screen x2-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToPricing}
            className="x2-text hover:bg-x2-card"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-2 text-sm x2-accent-bg">
            Pro Plan
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="x2-text">Upgrade to</span>{' '}
            <span className="x2-accent">Pro</span>
          </h1>
          <p className="text-xl x2-text-secondary max-w-2xl mx-auto">
            Get unlimited access to all premium AI models and advanced features
          </p>
        </div>

        {/* Pro Plan Details */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="x2-card border-2 border-x2-accent">
            <CardHeader className="text-center pb-6">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="x2-accent-bg px-3 py-1 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold x2-text">Pro Plan</CardTitle>
              <div className="mt-4">
                <span className="text-5xl font-bold x2-accent">$3.5</span>
                <span className="x2-text-secondary ml-2 text-xl">/per month</span>
              </div>
              <p className="text-sm x2-text-secondary mt-2">
                Billed monthly • Cancel anytime
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold x2-text mb-4">What's Included:</h3>
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
                </div>
                <div>
                  <h3 className="text-lg font-semibold x2-text mb-4">Payment Options:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 x2-card border border-x2-border">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full border-2 border-x2-accent mr-3"></div>
                        <span className="x2-text">Credit/Debit Card</span>
                      </div>
                      <span className="x2-accent">✓</span>
                    </div>
                    <div className="flex items-center justify-between p-3 x2-card border border-x2-border">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full border-2 border-x2-border mr-3"></div>
                        <span className="x2-text-secondary">PayPal</span>
                      </div>
                      <span className="x2-text-secondary">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between p-3 x2-card border border-x2-border">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full border-2 border-x2-border mr-3"></div>
                        <span className="x2-text-secondary">Bank Transfer</span>
                      </div>
                      <span className="x2-text-secondary">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center pt-6">
                <Button 
                  onClick={handlePurchasePro}
                  size="lg"
                  className="x2-btn-primary text-lg px-12 py-6"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Purchase Pro Plan - $3.5/month
                </Button>
                <p className="text-xs x2-text-secondary mt-3">
                  By purchasing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Section */}
        <section className="text-center mb-16">
          <Card className="x2-card border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Crown className="h-16 w-16 x2-accent mx-auto mb-6" />
              <h2 className="text-2xl font-bold x2-text mb-4">
                Need Enterprise Features?
              </h2>
              <p className="x2-text-secondary mb-6">
                For teams and organizations requiring custom AI model integration, 
                advanced security, and dedicated support.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={handleContactSales}
                  className="x2-btn-secondary w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Sales Team
                </Button>
                <p className="text-sm x2-text-secondary">
                  Get a custom quote tailored to your organization's needs
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold x2-text mb-4">
              Frequently Asked Questions
            </h2>
            <p className="x2-text-secondary">
              Everything you need to know about upgrading to Pro
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  Can I cancel my Pro subscription anytime?
                </h3>
                <p className="x2-text-secondary">
                  Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="x2-text-secondary">
                  We currently accept all major credit and debit cards. PayPal and bank transfer options will be available soon.
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

            <Card className="x2-card border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold x2-text mb-3">
                  How do I get support for enterprise features?
                </h3>
                <p className="x2-text-secondary">
                  For enterprise inquiries, custom integrations, and team features, please contact our sales team using the button above.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info */}
        <section className="mt-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold x2-text mb-6">
              Need Help? Contact Our Team
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Mail className="h-8 w-8 x2-accent mb-3" />
                <p className="x2-text font-medium">Email Support</p>
                <p className="x2-text-secondary text-sm">support@babilai.in</p>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="h-8 w-8 x2-accent mb-3" />
                <p className="x2-text font-medium">Live Chat</p>
                <p className="x2-text-secondary text-sm">Available 24/7</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-8 w-8 x2-accent mb-3" />
                <p className="x2-text font-medium">Phone Support</p>
                <p className="x2-text-secondary text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Purchase;
