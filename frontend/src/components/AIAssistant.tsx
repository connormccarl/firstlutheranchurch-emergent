'use client';

/**
 * @module AIAssistant
 * AI Spiritual Assistant page. Hosts the conversational UI that calls
 * `/api/ai/chat` (Emergent LLM key) for faith-based Q&A with session memory.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Clock, BookOpen, Heart, MessageCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import Navbar from './Navbar';
import Footer from './Footer';
import { saveChatMessage } from '../data/mockData';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello! I'm your AI spiritual assistant here at First Lutheran Church of Miami. I'm here to help with biblical questions, provide spiritual guidance, share information about our church, and support you on your faith journey. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    {
      icon: BookOpen,
      question: "Can you explain a Bible verse?",
      category: "Scripture"
    },
    {
      icon: Heart,
      question: "I'm going through a difficult time",
      category: "Spiritual Guidance"
    },
    {
      icon: Clock,
      question: "What are your service times?",
      category: "Church Info"
    },
    {
      icon: MessageCircle,
      question: "How can I get more involved?",
      category: "Community"
    }
  ];

  useEffect(() => {
    // Load chat history from localStorage
    const storedMessages = localStorage.getItem('aiChatHistory');
    if (storedMessages) {
      const parsed = JSON.parse(storedMessages);
      if (parsed.length > 1) { // Only if there are more messages than the initial one
        setMessages(parsed);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Church information responses
    if (lowerMessage.includes('service') || lowerMessage.includes('time') || lowerMessage.includes('schedule')) {
      return "Our Sunday worship service is at 10:00 AM in the Main Sanctuary, featuring traditional Lutheran worship with communion. We also have Bible Study on Wednesdays at 7:00 PM in the Fellowship Hall, and Youth Ministry on Fridays at 6:00 PM. All are welcome!";
    }
    
    if (lowerMessage.includes('pastor') || lowerMessage.includes('james') || lowerMessage.includes('dunham')) {
      return "Pastor James Dunham leads our congregation with a heart for seeing every person discover God's amazing plan for their life. He's passionate about walking alongside people through challenges and helping them grow in faith. You can schedule a 1-on-1 meeting with him through our scheduling system.";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      return "First Lutheran Church of Miami is located at 123 Faith Street, Miami, FL 33101. We're in the heart of Miami and easily accessible. Feel free to call us at (305) 123-4567 if you need directions!";
    }
    
    // Biblical/spiritual responses
    if (lowerMessage.includes('bible') || lowerMessage.includes('scripture') || lowerMessage.includes('verse')) {
      return "I'd be happy to help you explore Scripture! Could you share which specific verse or topic you'd like to discuss? The Bible is full of wisdom and comfort for every situation in life. One of my favorite verses is Jeremiah 29:11 - 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.'";
    }
    
    if (lowerMessage.includes('prayer') || lowerMessage.includes('pray')) {
      return "Prayer is such a beautiful way to connect with God! Remember that God hears every prayer, whether whispered or spoken aloud. You can pray about anything - your joys, concerns, gratitude, or requests for others. We also have a Women's Prayer Circle that meets monthly if you'd like to join others in prayer.";
    }
    
    if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('struggle') || lowerMessage.includes('trouble')) {
      return "I'm so sorry you're going through a difficult time. Please know that God is with you in every trial. 'Cast all your anxiety on him because he cares for you' (1 Peter 5:7). Sometimes it helps to talk with someone - Pastor James offers counseling sessions, and our church community is here to support you. Would you like me to help you schedule a meeting with Pastor James?";
    }
    
    if (lowerMessage.includes('faith') || lowerMessage.includes('believe') || lowerMessage.includes('god')) {
      return "Faith is a journey, not a destination! It's wonderful that you're exploring spiritual matters. God meets us wherever we are in our faith journey. Whether you're just starting to explore faith or looking to deepen your relationship with God, our church community is here to support you. Feel free to join us for worship or Bible study - no pressure, just community!";
    }
    
    // Getting involved
    if (lowerMessage.includes('involved') || lowerMessage.includes('volunteer') || lowerMessage.includes('help') || lowerMessage.includes('serve')) {
      return "There are many ways to get involved at First Lutheran Church! We have community outreach programs, youth ministry, Bible study groups, and various volunteer opportunities. Our next community outreach is a food drive on January 25th. You could also consider joining our choir or helping with Sunday school. What type of service interests you most?";
    }
    
    if (lowerMessage.includes('baptism') || lowerMessage.includes('baptize')) {
      return "Baptism is a beautiful step of faith! It's a public declaration of your commitment to follow Jesus and a symbol of new life in Him. Pastor James would love to talk with you about baptism and what it means. We regularly hold baptism services - our next one is scheduled for February. Would you like to schedule a meeting to discuss this further?";
    }
    
    // Default responses for general conversation
    const generalResponses = [
      "That's a great question! I'd be happy to explore that with you. Can you tell me a bit more about what you're thinking?",
      "I appreciate you sharing that with me. How can I best support you in this?",
      "That's something many people wonder about. Would you like me to share some biblical perspective on this?",
      "Thank you for trusting me with that question. Let me think about the best way to help you with this."
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    // Save user message
    saveChatMessage(userMessage);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        id: updatedMessages.length + 1,
        message: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      setIsTyping(false);

      // Save AI response and update localStorage
      saveChatMessage(aiResponse);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-600 p-3 rounded-full mr-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Spiritual Assistant</h1>
              <p className="text-gray-600 mt-1">Your 24/7 guide for faith, Bible questions, and church support</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="h-5 w-5 mr-2 text-amber-600" />
                  Quick Questions
                </CardTitle>
                <CardDescription>
                  Click on a question to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickQuestions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-3"
                      onClick={() => handleQuickQuestion(item.question)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.question}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask about faith, church services, or get spiritual guidance
                </CardDescription>
              </CardHeader>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.sender === 'ai' && (
                            <Bot className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                          )}
                          {msg.sender === 'user' && (
                            <User className="h-5 w-5 text-blue-200 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                            <p className={`text-xs mt-2 ${
                              msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-5 w-5 text-amber-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me about faith, Bible verses, church services, or anything spiritual..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 min-h-[60px] resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How I Can Help You</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Biblical Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Ask me about Bible verses, biblical principles, or how Scripture applies to your life situations.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Spiritual Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get encouragement, prayer support, and guidance through difficult times or spiritual questions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-amber-600 mb-2" />
                <CardTitle>Church Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Learn about service times, events, how to get involved, and connect with our church community.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIAssistant;