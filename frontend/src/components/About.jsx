import React from 'react';
import { Heart, Users, BookOpen, Compass, Church, Mail, Phone, MapPin, Music, Globe, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Love & Acceptance',
      description: 'We are a "no judgment" zone. We love you the way you are! Open to all people, truly welcoming all ethnicities.'
    },
    {
      icon: BookOpen,
      title: 'Scripture-Centered',
      description: 'We hold strongly to the Holy Scriptures as being "inerrant", without any errors. Biblical truth guides our faith and practice.'
    },
    {
      icon: Globe,
      title: 'Multilingual Ministry',
      description: 'Language classes in 14 different languages taught by Pastor James, plus Spanish and evangelism classes.'
    },
    {
      icon: Music,
      title: 'World-Class Music',
      description: 'Amazing musical events with our beloved Music Director, Dr. Tingting, a top 10 pianist worldwide.'
    }
  ];

  const ministries = [
    {
      title: 'Traditional Worship',
      description: 'Join us for beautiful traditional Lutheran worship service every Sunday.',
      time: 'Sundays at 1:00 PM'
    },
    {
      title: 'Bible Classes',
      description: 'Deep study of God\'s Word and Biblical teachings.',
      time: '1st Sunday of every month, 2:00-2:45 PM'
    },
    {
      title: 'Language Classes',
      description: 'Learn any of 14 different languages taught by Pastor James, plus Spanish and evangelism classes.',
      time: 'Sundays at 2:00 PM'
    },
    {
      title: 'First Communion Classes',
      description: 'Special preparation classes for children ages 7-11.',
      time: '2nd Sunday of every month, 2:00-2:45 PM'
    },
    {
      title: 'Catechism Classes',
      description: 'Faith instruction for children ages 8-11.',
      time: '3rd Sunday of every month, 2:00-2:45 PM'
    },
    {
      title: 'Piano Lessons',
      description: 'Piano instruction for children and adults with Dr. Tingting, our world-class Music Director.',
      time: 'By appointment'
    },
    {
      title: 'Preschool & Elementary',
      description: 'Quality Christian education for young children.',
      time: 'Contact for schedule'
    },
    {
      title: 'Literature Classes',
      description: 'Monday night literature classes for intellectual and spiritual growth.',
      time: 'Beginning January 2026'
    },
    {
      title: 'Fellowship Meals',
      description: 'Monthly fellowship meals at local restaurants - all are welcome!',
      time: 'Monthly gatherings'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-amber-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Church className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Church</h1>
          <p className="text-xl md:text-2xl leading-relaxed mb-4">
            First Lutheran Church of Miami - A Lutheran Church open to all people, truly welcoming all ethnicities.
          </p>
          <p className="text-lg italic text-amber-200">
            "We are a 'no judgment' zone. We love you the way you are!"
          </p>
        </div>
      </section>

      {/* Church Photos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Church Family</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_church-connect-16/artifacts/evoiorv3_Cristina%20and%20Pastor%20%28Santiago%29%20James.JPG" 
                alt="Cristina and Pastor James" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
              />
              <p className="text-gray-700 font-medium">Pastor James with Cristina</p>
            </div>
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_church-connect-16/artifacts/v75ihsk4_David%2C%20Pastor%20James%2C%20Tingting.jpg" 
                alt="David, Pastor James, and Dr. Tingting" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
              />
              <p className="text-gray-700 font-medium">David, Pastor James & Dr. Tingting (Music Director)</p>
            </div>
            <div className="text-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_church-connect-16/artifacts/9x45ghe4_Ketler%2C%20Santiago%2C%20Gigi%202.0%21.jpg" 
                alt="Ketler, Santiago, and Gigi" 
                className="w-full h-64 object-cover rounded-lg shadow-lg mb-4"
              />
              <p className="text-gray-700 font-medium">Ketler, Santiago & Gigi - Church Family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & What We Offer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                First Lutheran Church of Miami is committed to sharing the Gospel of Jesus Christ through 
                worship, fellowship, education, and service. We hold strongly to the Holy Scriptures as 
                being "inerrant", without any errors.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We believe in the birth, substitutionary death and resurrection of Jesus Christ our Savior. 
                Contact Pastor James for our detailed "This we believe, teach and confess" - a 23 article 
                explanation of our Biblical beliefs.
              </p>
              <blockquote className="text-lg italic text-amber-700 border-l-4 border-amber-600 pl-4">
                "Behold, the Lamb of God, who takes away the sin of the world" - John 1:29
              </blockquote>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Traditional worship every Sunday at 1:00 PM
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Language classes in 14 different languages taught by Pastor James
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  World-class musical events and piano lessons with Dr. Tingting
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  First Communion and Catechism classes for children
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Preschool and elementary instruction
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Monthly fellowship meals at local restaurants
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Literature classes beginning January 2026
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <Icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pastor & Dr. Tingting Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Leadership</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Pastor James */}
            <div className="text-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Church className="h-32 w-32 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pastor James Dunham</h3>
              <p className="text-amber-700 font-medium mb-4">Senior Pastor • Master of Divinity (MDIV) • 25+ Years Teaching</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "My heart is to see every person discover God's amazing plan for their life. Whether you're seeking 
                answers, going through challenges, or wanting to grow in your faith, I'm here to walk alongside you."
              </p>
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex items-center justify-center">
                  <Mail className="h-5 w-5 mr-3 text-amber-600" />
                  <span>pastorjamesdunham@gmail.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-3 text-amber-600" />
                  <span>(313) 670-3830</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild className="bg-blue-900 hover:bg-blue-800 w-full">
                  <Link to="/schedule">Schedule a Meeting</Link>
                </Button>
                <div className="text-xs text-gray-500">
                  <a href="https://www.linkedin.com/in/pastor-james-%E2%99%A5%EF%B8%8F-dunham-399ab581" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-amber-600 hover:text-amber-700">
                    View LinkedIn Profile
                  </a> | 
                  <a href="https://voyagemia.com/interview/daily-inspiration-meet-pastor-james-dunham" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-amber-600 hover:text-amber-700 ml-1">
                    Read Interview
                  </a>
                </div>
              </div>
            </div>

            {/* Dr. Tingting */}
            <div className="text-center">
              <div className="w-80 h-80 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-32 w-32 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dr. Tingting</h3>
              <p className="text-purple-700 font-medium mb-4">Music Director • Top 10 Pianist Worldwide</p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Dr. Tingting brings world-class musical excellence to our worship services and hosts amazing 
                musical events. She also offers piano lessons for children and adults of all skill levels.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-purple-900 mb-2">Piano Lessons Available</h4>
                <p className="text-sm text-purple-700">
                  Learn from a world-renowned pianist! Dr. Tingting offers personalized piano instruction 
                  for beginners to advanced students, both children and adults.
                </p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 w-full">
                Contact for Piano Lessons
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Ministries & Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{ministry.title}</CardTitle>
                  <CardDescription className="text-amber-700 font-medium">
                    {ministry.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{ministry.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Us This Sunday!</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join us for worship at 1:00 PM and experience our welcoming, loving church family.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 text-amber-400 mb-2" />
              <h3 className="font-semibold mb-1">Address</h3>
              <p className="text-blue-100">1770 Brickell Avenue<br />Miami, FL 33129</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-amber-400 mb-2" />
              <h3 className="font-semibold mb-1">Phone</h3>
              <p className="text-blue-100">(313) 670-3830</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-amber-400 mb-2" />
              <h3 className="font-semibold mb-1">Pastor Email</h3>
              <p className="text-blue-100">pastorjamesdunham@gmail.com</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link to="/schedule">Schedule with Pastor</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
              <Link to="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;