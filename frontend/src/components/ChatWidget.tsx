'use client';

/**
 * @module ChatWidget
 * Floating chat-bubble widget rendered globally for all public pages.
 * Opens the AI Spiritual Assistant in a popover.
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { saveChatMessage } from '../data/mockData';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello! I'm your AI spiritual assistant from First Lutheran Church of Miami. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history from localStorage
    const storedMessages = localStorage.getItem('aiChatHistory');
    if (storedMessages) {
      const parsed = JSON.parse(storedMessages);
      if (parsed.length > 1) {
        setMessages(parsed);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      setHasUnread(false);
    }
  }, [messages, isOpen]);

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

      // Set unread notification if chat is closed
      if (!isOpen) {
        setHasUnread(true);
      }

      // Save AI response
      saveChatMessage(aiResponse);
    }, 1500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
      setIsMinimized(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleChat}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <MessageCircle className="h-8 w-8 text-white" />
            {hasUnread && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]">
          <Card className="h-full shadow-2xl border-2 border-amber-200">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-blue-600 to-amber-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-lg">AI Assistant</CardTitle>
                    <p className="text-blue-100 text-sm">First Lutheran Church</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area - Hidden when minimized */}
            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4 h-80">
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
                              <Bot className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                            )}
                            {msg.sender === 'user' && (
                              <User className="h-4 w-4 text-blue-200 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
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
                            <Bot className="h-4 w-4 text-amber-600" />
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
                <div className="border-t p-3">
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Ask about faith, church services, or get spiritual guidance..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[40px] resize-none text-sm"
                      rows={2}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0 flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Press Enter to send • Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatWidget;