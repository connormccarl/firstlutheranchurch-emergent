import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Phone, Mail, MessageCircle, Users, Heart, BookOpen, Music, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Navbar from './Navbar';
import Footer from './Footer';

const Home = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: 'Sunday Worship Service',
      date: '2025-01-19',
      time: '1:00 PM',
      location: 'Main Sanctuary'
    },
    {
      id: 2,
      title: 'Bible Study & Language Classes',
      date: '2025-01-19',
      time: '2:00 PM',
      location: 'Fellowship Hall'
    },
    {
      id: 3,
      title: 'First Communion Classes',
      date: '2025-01-26',
      time: '2:00 PM',
      location: 'Sunday School Room'
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Spiritual Assistant',
      description: 'Get answers to faith questions and spiritual guidance 24/7 through our chat widget',
      action: 'Click the chat button below to start'
    },
    {
      icon: Calendar,
      title: 'Schedule with Pastor James',
      description: 'Book personal sessions with Pastor James Dunham (MDIV, 25+ years experience)',
      link: '/schedule'
    },
    {
      icon: Globe,
      title: 'Language Learning',
      description: 'Learn any of 14 languages taught by Pastor James, plus Spanish and evangelism classes',
      link: '/about'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-amber-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to First Lutheran Church
            <span className="block text-2xl md:text-3xl text-amber-200 mt-2">of Miami</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto leading-relaxed">
            "Behold, the Lamb of God, who takes away the sin of the world"
          </p>
          <p className="text-lg mb-4 text-blue-100">- John 1:29</p>
          <p className="text-lg mb-8 text-amber-200 font-medium">
            A "no judgment" zone - We love you the way you are!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
              <Link to="/schedule">Schedule with Pastor</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg"
              onClick={() => {
                // Scroll down to show the chat widget location
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                // Add a small delay then show a tooltip or highlight
                setTimeout(() => {
                  const chatButton = document.querySelector('[data-chat-button]');
                  if (chatButton) {
                    chatButton.style.animation = 'pulse 2s infinite';
                  }
                }, 1000);
              }}
            >
              Chat with AI Assistant
            </Button>
          </div>
          <div className="mt-6 text-sm text-blue-200">
            💬 Look for the floating chat button in the bottom right corner!
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Join Us for Worship</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Clock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Sunday Worship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">1:00 PM</p>
                <p className="text-gray-600 mt-2">Traditional Lutheran Worship</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>Bible & Language Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">Sunday 2:00 PM</p>
                <p className="text-gray-600 mt-2">Bible study & 14 language options</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Music className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <CardTitle>World-Class Music</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-900">Dr. Tingting</p>
                <p className="text-gray-600 mt-2">Top 10 pianist worldwide</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Church Photos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Our Church Family</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/r8r2porw_Our%20partner%2C%20Localposh%20CEO%2C%20Eric%20Williams%20and%20family%21.JPG" 
                alt="Eric Williams and family - LocalPosh CEO and church partner" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-lg font-semibold text-gray-900">Eric Williams & Family</h3>
              <p className="text-gray-600">LocalPosh CEO & Church Partner</p>
            </div>
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hmet117m_Pastor%20James%20with%20Serena%20and%20Boris.jpg" 
                alt="Pastor James with Serena and Boris" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-lg font-semibold text-gray-900">Pastor James with Serena & Boris</h3>
              <p className="text-gray-600">Building relationships in our community</p>
            </div>
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/x121373s_Yay%21%201st%20Easter%20at%20FLC.JPG" 
                alt="First Easter celebration at First Lutheran Church" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h3 className="text-lg font-semibold text-gray-900">First Easter Celebration</h3>
              <p className="text-gray-600">Celebrating milestones together</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How We Can Help You Grow</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <Icon className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
                    {feature.link ? (
                      <Button asChild className="w-full bg-blue-900 hover:bg-blue-800">
                        <Link to={feature.link}>Learn More</Link>
                      </Button>
                    ) : (
                      <div className="text-sm text-amber-700 font-medium bg-amber-50 p-2 rounded">
                        {feature.action}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">This Sunday's Schedule</h2>
            <Button asChild variant="outline">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Programs Highlight */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Special Programs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Globe className="h-12 w-12 text-amber-600 mb-4" />
                <CardTitle className="text-xl">Learn 14 Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Pick any of 14 languages you'd like to learn, and Pastor James will teach them to you! 
                  We also offer Spanish classes and evangelism training.
                </p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link to="/about">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Music className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Piano Lessons with Dr. Tingting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Learn piano from a world-class musician! Dr. Tingting, our beloved Music Director and 
                  top 10 pianist worldwide, offers lessons for children and adults.
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link to="/about">Contact Dr. Tingting</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Us This Sunday</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-amber-400" />
                  <span>1770 Brickell Avenue, Miami, FL 33129</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-amber-400" />
                  <span>(313) 670-3830</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-amber-400" />
                  <span>pastorjamesdunham@gmail.com</span>
                </div>
                <div className="bg-blue-800 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold mb-2 text-amber-400">Sunday Schedule:</h3>
                  <p>1:00 PM - Traditional Worship</p>
                  <p>2:00 PM - Bible Classes & Language Learning</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Pastor James Dunham</h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                "My heart is to see every person discover God's amazing plan for their life. 
                Whether you're seeking answers, going through challenges, or wanting to grow in your faith, 
                I'm here to walk alongside you on this journey."
              </p>
              <div className="space-y-2 text-sm text-blue-100 mb-6">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-amber-400" />
                  <span>(313) 670-3830</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-amber-400" />
                  <span>pastorjamesdunham@gmail.com</span>
                </div>
                <div className="text-xs">
                  <span className="text-amber-400">Credentials:</span> Master of Divinity (MDIV), 25+ Years Teaching Experience
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <Link to="/schedule">Schedule a Meeting</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-blue-900"
                  onClick={() => {
                    // Show chat widget hint
                    const tooltip = document.createElement('div');
                    tooltip.innerHTML = '💬 Click the chat button to start!';
                    tooltip.style.cssText = 'position: fixed; bottom: 90px; right: 20px; background: #1e40af; color: white; padding: 8px 12px; border-radius: 8px; font-size: 14px; z-index: 1000; animation: fadeIn 0.3s ease-in;';
                    document.body.appendChild(tooltip);
                    setTimeout(() => tooltip.remove(), 3000);
                  }}
                >
                  Quick Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;