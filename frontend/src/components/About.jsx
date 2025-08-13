import React from 'react';
import { Heart, Users, BookOpen, Compass, Church, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Love & Compassion',
      description: 'We believe in showing Christ\'s love through acts of kindness, compassion, and genuine care for one another.'
    },
    {
      icon: Users,
      title: 'Community & Fellowship',
      description: 'Building meaningful relationships and supporting each other through life\'s joys and challenges.'
    },
    {
      icon: BookOpen,
      title: 'Scripture-Centered',
      description: 'Grounded in Biblical truth, we seek to apply God\'s Word to our daily lives and decisions.'
    },
    {
      icon: Compass,
      title: 'Faithful Guidance',
      description: 'Providing spiritual direction and pastoral care to help people grow in their relationship with God.'
    }
  ];

  const ministries = [
    {
      title: 'Sunday Worship',
      description: 'Traditional Lutheran worship service with communion, inspiring messages, and beautiful hymns.',
      time: 'Sundays at 10:00 AM'
    },
    {
      title: 'Bible Study',
      description: 'Weekly Bible study sessions exploring Scripture and its application to modern life.',
      time: 'Wednesdays at 7:00 PM'
    },
    {
      title: 'Youth Ministry',
      description: 'Engaging programs for teenagers and young adults, including fellowship and service projects.',
      time: 'Fridays at 6:00 PM'
    },
    {
      title: 'Community Outreach',
      description: 'Regular service projects helping our Miami community through food drives, volunteering, and support.',
      time: 'Monthly events'
    },
    {
      title: 'Women\'s Ministry',
      description: 'Prayer circles, Bible studies, and fellowship opportunities for women of all ages.',
      time: 'Various times'
    },
    {
      title: 'Pastoral Care',
      description: 'One-on-one counseling, hospital visits, and personal spiritual guidance from Pastor James.',
      time: 'By appointment'
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
          <p className="text-xl md:text-2xl leading-relaxed">
            First Lutheran Church of Miami has been a beacon of faith, hope, and love in our community 
            for over 60 years, welcoming all who seek to grow in their relationship with God.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To create a welcoming community where people can encounter God's love, grow in their faith, 
                and serve others with joy. We are committed to sharing the Gospel of Jesus Christ through 
                worship, fellowship, education, and service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We believe that every person is created in God's image and has inherent worth and dignity. 
                Our church family strives to be a place where all people can find acceptance, healing, and 
                purpose in their spiritual journey.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To be a thriving, Christ-centered church that transforms lives and strengthens our Miami 
                community through God's grace and love. We envision a church where:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  People experience authentic worship and meaningful community
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Families grow together in faith across generations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Our community is served through acts of compassion and justice
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Lives are transformed by the power of God's love
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
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

      {/* Pastor Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Meet Pastor James Dunham</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Pastor James has served First Lutheran Church of Miami with dedication and passion for over 15 years. 
                His heart is to see every person discover God's amazing plan for their life and to walk alongside 
                people through every season of their journey.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                With a Master of Divinity from Lutheran Seminary and extensive experience in pastoral counseling, 
                Pastor James brings both theological depth and practical wisdom to his ministry. He is married to 
                Sarah, and they have two children who are active in the church community.
              </p>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-amber-600" />
                  <span>pastorjamesdunham@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-amber-600" />
                  <span>(313) 670-3830</span>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild className="bg-blue-900 hover:bg-blue-800">
                  <Link to="/schedule">Schedule a Meeting</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Church className="h-32 w-32 text-white" />
              </div>
              <blockquote className="text-lg text-gray-700 italic">
                "My heart is to see every person discover God's amazing plan for their life. Whether you're seeking 
                answers, going through challenges, or wanting to grow in your faith, I'm here to walk alongside you."
              </blockquote>
              <p className="text-amber-700 font-medium mt-4">- Pastor James Dunham</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Ministries</h2>
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

      {/* History */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our History</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-amber-600 mb-4">1962 - Foundation</h3>
              <p className="text-gray-700 leading-relaxed">
                First Lutheran Church of Miami was founded by a small group of Lutheran families who felt called 
                to establish a Lutheran presence in the growing Miami community. Starting with just 25 members 
                meeting in a rented space, the church was built on a foundation of faith, fellowship, and service.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-amber-600 mb-4">1975 - First Building</h3>
              <p className="text-gray-700 leading-relaxed">
                Through the generous donations and volunteer work of the congregation, the church built its first 
                permanent building on Brickell Avenue. The sanctuary could seat 150 people and included classrooms 
                for Sunday school and community gatherings.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-amber-600 mb-4">1990s - Growth & Expansion</h3>
              <p className="text-gray-700 leading-relaxed">
                As the congregation grew to over 300 members, the church expanded its facilities to include a 
                fellowship hall, youth center, and additional classrooms. Community outreach programs were 
                established, including a food pantry and after-school tutoring program.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-amber-600 mb-4">2009 - Pastor James Arrives</h3>
              <p className="text-gray-700 leading-relaxed">
                Pastor James Dunham was called to serve as senior pastor, bringing fresh energy and vision to the 
                congregation. Under his leadership, the church has embraced technology, expanded its ministries, 
                and deepened its commitment to serving the Miami community.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-amber-600 mb-4">Today - Moving Forward</h3>
              <p className="text-gray-700 leading-relaxed">
                Today, First Lutheran Church of Miami continues to be a vibrant community of faith with over 400 
                members. We're embracing new technologies like our AI assistant while maintaining our core values 
                of worship, fellowship, and service. Our vision is to be a church that meets people where they are 
                and helps them grow in their relationship with God.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
          <p className="text-xl mb-8 text-blue-100">
            We'd love to meet you! Join us for worship this Sunday or reach out to learn more about our church family.
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