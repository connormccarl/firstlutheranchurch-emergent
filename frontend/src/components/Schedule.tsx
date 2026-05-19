'use client';

/**
 * @module Schedule
 * Public `/schedule` page. Embeds Calendly so visitors can book
 * 1:1 time with Pastor James.
 */

import React, { useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, Mail, Phone, User, MessageSquare } from 'lucide-react';

const Schedule = () => {
  const [showCalendly, setShowCalendly] = useState(false);

  const handleScheduleClick = () => {
    setShowCalendly(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Schedule Time with Pastor James
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book your personal consultation, spiritual guidance, or counseling session with Pastor James Dunham
          </p>
        </div>

        {/* Pastor Info Card */}
        <div className="mb-12">
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src="https://voyagemia.com/wp-content/uploads/2025/02/c-1739001069779-personal_1739001564590_1739001564590_pastorjames_dunham_pastor-james-santiago-dunham-first-lutheran-church-of-miami-1-1.jpg"
                  alt="Pastor James Dunham"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="text-center md:text-left">
                  <CardTitle className="text-3xl font-bold mb-2">Pastor James (Santiago) Dunham</CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    MDIV • 25+ Years Experience • Multilingual Ministry
                  </CardDescription>
                  <p className="text-blue-100 mt-2">
                    Teaching in 14 languages • Counseling • Spiritual Guidance
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Available Sessions
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">30-Minute Consultation</h4>
                      <p className="text-blue-700 text-sm">Prayer requests, spiritual encouragement, brief guidance</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-900">60-Minute Counseling</h4>
                      <p className="text-indigo-700 text-sm">In-depth spiritual counseling and life guidance</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900">Marriage Preparation</h4>
                      <p className="text-purple-700 text-sm">Pre-marital counseling and relationship guidance</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-gray-500" />
                      <a href="mailto:pastorjamesdunham@gmail.com" className="text-gray-700 hover:text-blue-600 transition-colors">
                        pastorjamesdunham@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-500" />
                      <a href="tel:+13136703830" className="text-gray-700 hover:text-blue-600 transition-colors">
                        (313) 670-3830
                      </a>
                    </div>
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-3 text-gray-500 mt-1" />
                      <div>
                        <p className="text-gray-700 text-sm">
                          Languages Available: Spanish, French, Hebrew, Greek, Portuguese, 
                          Mandarin Chinese, Japanese, Italian, German, Hindi, Indonesian, 
                          Vietnamese, Russian, Urdu, English, and ASL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendly Integration */}
        <div className="mb-12">
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="text-center p-8">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Schedule Your Appointment Online
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose your preferred time slot and book instantly with Pastor James
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {showCalendly ? (
                <div className="px-8 pb-8">
                  <InlineWidget
                    url="https://calendly.com/pastorjamesdunham/30min"
                    styles={{
                      height: '700px',
                      width: '100%'
                    }}
                    pageSettings={{
                      backgroundColor: 'ffffff',
                      hideEventTypeDetails: false,
                      hideLandingPageDetails: false,
                      primaryColor: '2563eb',
                      textColor: '1f2937'
                    }}
                  />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src="https://voyagemia.com/wp-content/uploads/2025/02/c-1738772057132-1738772551939_pastorjames_dunham_captain-david-whitten-and-pastor-james-1.jpg"
                      alt="Pastor James with church member"
                      className="mx-auto w-64 h-48 object-cover rounded-lg shadow-lg mb-4"
                    />
                    <p className="text-gray-600 max-w-md mx-auto">
                      Ready to connect? Click below to access our online scheduling system and 
                      book your appointment with Pastor James at your convenience.
                    </p>
                  </div>
                  <Button 
                    onClick={handleScheduleClick}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Open Scheduling Calendar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alternative Contact */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Prefer to Contact Us Directly?
              </h3>
              <p className="text-gray-600 mb-6">
                If you need immediate assistance or prefer to schedule by phone, please don't hesitate to reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href="mailto:pastorjamesdunham@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <a href="tel:+13136703830">
                    <Phone className="h-4 w-4 mr-2" />
                    Call (313) 670-3830
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;