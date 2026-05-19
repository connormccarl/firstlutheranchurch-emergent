'use client';

/**
 * @module Contact
 * Public `/contact` page. Submits the contact form to `/api/contact`
 * which logs the submission to Postgres AND emails the pastor via Zoho Mail.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe,
  MessageCircle,
  Send,
  Calendar,
  Music,
  BookOpen,
  Users
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useToast } from '../hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
      
      // Send contact form data to backend
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us! Pastor James will respond to your message personally within 24-48 hours.",
        });

        console.log('Contact form successful:', result);
        
      } else {
        throw new Error('Contact form submission failed');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Message Failed",
        description: "There was an error sending your message. Please try contacting Pastor James directly at pastorjamesdunham@gmail.com or (313) 670-3830.",
        variant: "destructive"
      });
    }
  };

  // Gallery images for Contact page
  const contactImages = [
    {
      id: 1,
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/gi0tco68_Screenshot_20250819_155537_Add%20Text.jpg',
      title: 'Pastor James with Music Family',
      description: 'Sunday worship and language classes invitation'
    },
    {
      id: 2,
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0ujczttk_Screenshot_20250819_155919_Add%20Text.jpg',
      title: 'Pastor James & Family Group',
      description: 'Welcome invitation in multiple languages'
    },
    {
      id: 3,
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/m4fyvt06_Screenshot_20250819_154418_Add%20Text.jpg',
      title: 'Church Family Piano Gathering',
      description: 'Language learning and worship invitation'
    },
    {
      id: 4,
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/afhu1dwf_Screenshot_20250819_154823_Add%20Text.jpg',
      title: 'Pastor Santiago & Church Family',
      description: 'Multilingual worship and classes invitation'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src="/flc-logo.png" 
                alt="First Lutheran Church of Miami Logo" 
                className="h-28 w-28 md:h-32 md:w-32 object-contain filter drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We'd love to hear from you! Get in touch with Pastor James and our church family.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white shadow-xl">
                <CardHeader className="text-center p-6">
                  <CardTitle className="text-2xl flex items-center justify-center gap-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    Visit Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-600">
                        1770 Brickell Avenue<br />
                        Miami, FL 33129
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Worship Schedule</h4>
                        <p className="text-gray-600">Sunday Worship: 1:00 PM</p>
                        <p className="text-gray-600">Bible & Language Classes: 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl">
                <CardHeader className="text-center p-6">
                  <CardTitle className="text-2xl flex items-center justify-center gap-3">
                    <Phone className="h-8 w-8 text-green-600" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <a href="tel:+13136703830" className="text-green-600 hover:text-green-800 transition-colors">
                          (313) 670-3830
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <a href="mailto:pastorjamesdunham@gmail.com" className="text-purple-600 hover:text-purple-800 transition-colors">
                          pastorjamesdunham@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Languages</h4>
                        <p className="text-gray-600">14 languages available</p>
                        <Badge className="mt-1 bg-amber-100 text-amber-800">Multilingual Ministry</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl">
                <CardHeader className="text-center p-6">
                  <CardTitle className="text-2xl flex items-center justify-center gap-3">
                    <Users className="h-8 w-8 text-indigo-600" />
                    Special Programs
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Piano Lessons</h4>
                        <p className="text-gray-600">Dr. Tingting Wu</p>
                        <a href="mailto:pianowtt@gmail.com" className="text-purple-600 hover:text-purple-800 text-sm">
                          pianowtt@gmail.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Tech Tutoring & Esports</h4>
                        <p className="text-gray-600">John Riley</p>
                        <a href="mailto:johnrileytechsolutions7@gmail.com" className="text-blue-600 hover:text-blue-800 text-sm">
                          johnrileytechsolutions7@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Language Classes</h4>
                        <p className="text-gray-600">Pastor James Dunham</p>
                        <p className="text-gray-600 text-sm">14 languages available</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-white shadow-xl">
                <CardHeader className="text-center p-6">
                  <CardTitle className="text-2xl flex items-center justify-center gap-3">
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                    Send a Message
                  </CardTitle>
                  <CardDescription>
                    We'd love to hear from you! Fill out the form below and we'll get back to you soon.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="What would you like to discuss?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 gap-4">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white py-3">
                  <a href="/schedule">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule 1-on-1 with Pastor James
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3"
                  onClick={() => {
                    // Show chat widget hint
                    const tooltip = document.createElement('div');
                    tooltip.innerHTML = '💬 Look for the chat button in the bottom right!';
                    tooltip.style.cssText = 'position: fixed; bottom: 90px; right: 20px; background: #1e40af; color: white; padding: 8px 12px; border-radius: 8px; font-size: 14px; z-index: 1000; animation: fadeIn 0.3s ease-in;';
                    document.body.appendChild(tooltip);
                    setTimeout(() => tooltip.remove(), 3000);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  AI Spiritual Assistant
                </Button>
                <Button asChild variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-3">
                  <a href="/media">
                    <Music className="h-4 w-4 mr-2" />
                    View Media Library
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Welcome to Our Church Family
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactImages.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                    <p className="text-gray-600 text-xs">{image.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Join Us This Sunday!</h2>
                <p className="text-lg mb-6">
                  Experience worship in a welcoming, multilingual community at 1:00 PM
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <a href="/events">View Events</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <a href="/about">Learn More</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;