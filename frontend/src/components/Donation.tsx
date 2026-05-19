'use client';

/**
 * @module Donation
 * Donation modal (PayPal Hosted Buttons + Zeffy fallback). Multi-step
 * flow: amount → donor info → method → payment → success. Reads PayPal
 * client/button IDs from `NEXT_PUBLIC_PAYPAL_*` env vars and logs every
 * completed donation to `/api/donations`.
 */

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
  const [step, setStep] = useState(1); // 1: amount, 2: info, 3: payment method, 4: payment, 5: success
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [zeffyModalOpen, setZeffyModalOpen] = useState(false);
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

      // Create script element. Client ID is sourced from env so it can be
      // rotated/replaced per environment without changing source.
      const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&components=hosted-buttons&enable-funding=venmo&currency=USD`;
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

  // Initialize PayPal button when step 4 is reached and PayPal is selected
  useEffect(() => {
    if (step === 4 && selectedPaymentMethod === 'paypal' && paypalLoaded && window.paypal) {
      // Clear any existing PayPal container
      const container = document.getElementById('paypal-container');
      if (container) {
        container.innerHTML = '';
        
        // Render PayPal hosted button (ID from env so it can be swapped per env).
        const hostedButtonId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID;
        window.paypal.HostedButtons({
          hostedButtonId,
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
  }, [step, selectedPaymentMethod, paypalLoaded, toast]);

  // Handle Zeffy donation
  const openZeffyDonation = () => {
    const zeffyUrl = `https://www.zeffy.com/embed/donation-form/donate-to-change-lives-2752?modal=true&amount=${getCurrentAmount()}&donor_first_name=${encodeURIComponent(donorInfo.name.split(' ')[0] || '')}&donor_last_name=${encodeURIComponent(donorInfo.name.split(' ').slice(1).join(' ') || '')}&donor_email=${encodeURIComponent(donorInfo.email)}`;
    
    // Open Zeffy in a new window
    const zeffyWindow = window.open(
      zeffyUrl,
      'zeffy-donation',
      'width=800,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no'
    );

    // Monitor for window close to handle success
    const checkClosed = setInterval(() => {
      if (zeffyWindow.closed) {
        clearInterval(checkClosed);
        // Assume success if window was closed (user completed or cancelled)
        setTimeout(() => {
          const userCompleted = confirm('Did you complete your donation through Zeffy? Click OK if yes, Cancel if no.');
          if (userCompleted) {
            handleDonationComplete('zeffy');
          }
        }, 500);
      }
    }, 1000);
  };

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
    setStep(3); // Go to payment method selection
  };

  // Listen for PayPal success (you can customize this based on PayPal's callback)
  useEffect(() => {
    // PayPal success handler
    const handlePayPalSuccess = (event) => {
      if (event.data && event.data.type === 'paypal_success') {
        handleDonationComplete();
      }
    };

    window.addEventListener('message', handlePayPalSuccess);
    return () => {
      window.removeEventListener('message', handlePayPalSuccess);
    };
  }, []);

  const handleDonationComplete = async (paymentMethod = selectedPaymentMethod) => {
    setIsProcessing(true);
    
    try {
      // Log donation to backend
      const donationData = {
        amount: getCurrentAmount(),
        donor_name: donorInfo.name,
        donor_email: donorInfo.email,
        message: donorInfo.message,
        payment_method: paymentMethod
      };

      // Call backend API to record donation
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      
      const response = await fetch(`${backendUrl}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Donation recorded:', result);
      } else {
        console.error('Failed to record donation');
      }
      
      setStep(5); // Go to success step
      
      toast({
        title: "Thank You!",
        description: `Your generous donation of $${getCurrentAmount()} has been processed successfully through ${paymentMethod === 'zeffy' ? 'Zeffy' : 'PayPal'}.`,
      });
      
    } catch (error) {
      console.error('Donation processing error:', error);
      toast({
        title: "Processing Complete",
        description: `Thank you for your $${getCurrentAmount()} donation to First Lutheran Church of Miami.`,
      });
      setStep(5); // Still go to success even if logging fails
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDonation = () => {
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPaymentMethod('');
    setDonorInfo({ name: '', email: '', message: '' });
    setIsProcessing(false);
    setZeffyModalOpen(false);
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

          {/* Step 3: Payment Method Selection */}
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

              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Choose Your Payment Method</h3>
                
                <div className="space-y-4">
                  {/* PayPal Option */}
                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      selectedPaymentMethod === 'paypal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('paypal')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === 'paypal' && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">PayPal</h4>
                            <div className="flex space-x-1">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PayPal</span>
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Venmo</span>
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Cards</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Pay with PayPal account, Venmo, or any credit/debit card
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Zeffy Option */}
                  <Card 
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      selectedPaymentMethod === 'zeffy' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('zeffy')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPaymentMethod === 'zeffy' ? 'border-green-500' : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === 'zeffy' && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">Zeffy</h4>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">0% Fees</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            100% of your donation goes to the church - no processing fees!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (selectedPaymentMethod === 'zeffy') {
                      openZeffyDonation();
                    } else if (selectedPaymentMethod === 'paypal') {
                      setStep(4);
                    } else {
                      toast({
                        title: "Payment Method Required",
                        description: "Please select a payment method to continue.",
                        variant: "destructive"
                      });
                    }
                  }}
                  disabled={!selectedPaymentMethod}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue with {selectedPaymentMethod === 'paypal' ? 'PayPal' : selectedPaymentMethod === 'zeffy' ? 'Zeffy' : 'Selected Method'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: PayPal Payment */}
          {step === 4 && selectedPaymentMethod === 'paypal' && (
            <div className="space-y-6">
              <div className="text-center">
                <Badge className="bg-blue-600 text-white mb-2">
                  Donation Amount: ${getCurrentAmount()}
                </Badge>
                <p className="text-sm text-gray-600">
                  Donor: {donorInfo.name} ({donorInfo.email})
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Secure Payment with PayPal
                  </h3>
                  <p className="text-sm text-blue-700">
                    Your donation will be processed securely through PayPal. You can pay with your PayPal account, debit card, or credit card.
                  </p>
                </div>

                {/* PayPal Button Container */}
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                  {paypalLoaded ? (
                    <div>
                      <div className="text-center mb-3">
                        <p className="text-sm font-medium text-gray-700">
                          Click the PayPal button below to complete your ${getCurrentAmount()} donation
                        </p>
                      </div>
                      <div id="paypal-container" className="text-center"></div>
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">
                          Secure payment processed by PayPal
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading PayPal...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Information Display */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Donation Amount:</span>
                      <span className="font-semibold">${getCurrentAmount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Donor Name:</span>
                      <span>{donorInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{donorInfo.email}</span>
                    </div>
                    {donorInfo.message && (
                      <div className="pt-2 border-t">
                        <span className="text-gray-600 text-xs">Message:</span>
                        <p className="text-xs mt-1">{donorInfo.message}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Thank You for Your Generosity!
                </h3>
                <p className="text-gray-600 mb-2">
                  Your donation of <span className="font-semibold">${getCurrentAmount()}</span> has been processed successfully through {selectedPaymentMethod === 'zeffy' ? 'Zeffy' : 'PayPal'}.
                </p>
                <p className="text-sm text-gray-500">
                  {selectedPaymentMethod === 'zeffy' 
                    ? 'You should receive a Zeffy receipt shortly. Thank you for choosing the zero-fee option!'
                    : 'Your payment has been completed and you should receive a PayPal receipt shortly.'
                  }
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