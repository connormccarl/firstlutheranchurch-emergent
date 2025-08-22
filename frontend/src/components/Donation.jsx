import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, DollarSign, X, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Donation = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [step, setStep] = useState(1); // 1: amount, 2: info, 3: payment, 4: success
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = [10, 25, 50, 100, 250, 500];

  // Load PayPal SDK when component mounts
  useEffect(() => {
    const loadPayPalScript = () => {
      // Check if PayPal is already loaded
      if (window.paypal) {
        setPaypalLoaded(true);
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=BAAvQSKEbfIoZAHW1ywBJZVJfgfhu1kV0H74ILTrzdYUfeDMHE0ZgMge_1My6f3AOOAl-sib6HnHAxg5Do&components=hosted-buttons&enable-funding=venmo&currency=USD';
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
      };
      script.onerror = () => {
        console.error('PayPal SDK failed to load');
        toast({
          title: "Payment System Error",
          description: "Failed to load PayPal. Please try again later.",
          variant: "destructive"
        });
      };

      document.head.appendChild(script);
    };

    if (isOpen) {
      loadPayPalScript();
    }
  }, [isOpen, toast]);

  // Initialize PayPal button when step 3 is reached
  useEffect(() => {
    if (step === 3 && paypalLoaded && window.paypal) {
      // Clear any existing PayPal container
      const container = document.getElementById('paypal-container');
      if (container) {
        container.innerHTML = '';
        
        // Render PayPal hosted button
        window.paypal.HostedButtons({
          hostedButtonId: "4Q83P6E6UGSV6",
        }).render("#paypal-container").catch(err => {
          console.error('PayPal render error:', err);
          toast({
            title: "Payment Error",
            description: "Failed to load payment options. Please try again.",
            variant: "destructive"
          });
        });
      }
    }
  }, [step, paypalLoaded, toast]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getCurrentAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!donorInfo.name.trim() || !donorInfo.email.trim()) {
      toast({
        title: "Information Required",
        description: "Please provide your name and email address.",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
  };

  const handleDonationComplete = async () => {
    setIsProcessing(true);
    
    try {
      // This is where PayPal integration would happen
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log donation attempt (replace with actual API call)
      console.log('Donation submitted:', {
        amount: getCurrentAmount(),
        donor: donorInfo,
        timestamp: new Date().toISOString()
      });
      
      setStep(4);
      
      toast({
        title: "Thank You!",
        description: `Your generous donation of $${getCurrentAmount()} will help our church community grow.`,
      });
      
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: "Payment Processing Error",
        description: "There was an issue processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDonation = () => {
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setDonorInfo({ name: '', email: '', message: '' });
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Support Our Ministry</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Step 1: Amount Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Your generous donation helps us serve our diverse, multilingual community with worship services, language classes, and community outreach programs.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Select Donation Amount</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 ${
                        selectedAmount === amount 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Or enter custom amount:
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={getCurrentAmount() <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Continue - ${getCurrentAmount()}
              </Button>
            </div>
          )}

          {/* Step 2: Donor Information */}
          {step === 2 && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <Badge className="bg-blue-600 text-white">
                  Donation Amount: ${getCurrentAmount()}
                </Badge>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={donorInfo.name}
                  onChange={(e) => setDonorInfo({...donorInfo, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={donorInfo.email}
                  onChange={(e) => setDonorInfo({...donorInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={donorInfo.message}
                  onChange={(e) => setDonorInfo({...donorInfo, message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share a prayer request or message..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Payment (PayPal Integration Placeholder) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Badge className="bg-blue-600 text-white mb-2">
                  Donation Amount: ${getCurrentAmount()}
                </Badge>
                <p className="text-sm text-gray-600">
                  Donor: {donorInfo.name} ({donorInfo.email})
                </p>
              </div>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-yellow-800">
                      PayPal Integration Setup Required
                    </h3>
                    <p className="text-sm text-yellow-700">
                      This donation system is ready to accept your PayPal credentials. 
                      Once connected, donors will see PayPal payment options here.
                    </p>
                    <div className="space-y-2 text-xs text-yellow-600">
                      <p>• Secure PayPal payment processing</p>
                      <p>• Credit card and PayPal account support</p>
                      <p>• Automatic donation receipts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Simulate payment for demo purposes */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  For demo purposes, click below to simulate a completed donation:
                </p>
                <Button
                  onClick={handleDonationComplete}
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Processing...' : 'Simulate Donation Complete'}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thank You for Your Generosity!
                </h3>
                <p className="text-gray-600">
                  Your donation of <span className="font-semibold">${getCurrentAmount()}</span> will help us continue our ministry and serve our community better.
                </p>
              </div>

              {donorInfo.message && (
                <Card className="bg-blue-50">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-800 font-medium mb-1">Your Message:</p>
                    <p className="text-sm text-blue-700">{donorInfo.message}</p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  A donation receipt will be sent to {donorInfo.email}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      resetDonation();
                      onClose();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={resetDonation}
                    variant="outline"
                    className="flex-1"
                  >
                    Donate Again
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donation;