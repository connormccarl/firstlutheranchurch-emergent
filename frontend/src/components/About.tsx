'use client';

/**
 * @module About
 * Public `/about` page. Renders church history, special programs
 * (piano, tech tutoring), board/leadership, FLC Constitution download, and
 * deep links to magazine features.
 */

import Link from 'next/link';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Navbar from './Navbar';
import Footer from './Footer';
import { Church, Heart, Users, Calendar, Music, Award, Mail, Phone, Laptop } from 'lucide-react';
const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/flc-logo.png" 
              alt="First Lutheran Church of Miami Logo" 
              className="h-20 w-20 md:h-24 md:w-24 object-contain filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            About Our Church
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            First Lutheran Church of Miami is a vibrant, multilingual community 
            founded on faith, fellowship, and service to our diverse neighborhood.
          </p>
        </div>
      </div>

      {/* Church History & Overview */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Church Info Cards */}
            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Church className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Founded in Faith</h3>
              <p className="text-gray-600">
                Established as a beacon of hope and spiritual growth in the heart of Miami, 
                serving our community with love and dedication.
              </p>
            </Card>

            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Diverse Community</h3>
              <p className="text-gray-600">
                Our congregation includes families from many cultural backgrounds, 
                including Spanish, French, Hebrew, Greek, Portuguese, Mandarin Chinese, Japanese, 
                Italian, German, Hindi, Indonesian, Vietnamese, Russian, Urdu, and ASL.
              </p>
            </Card>

            <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-12 w-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Serving Together</h3>
              <p className="text-gray-600">
                We believe in active ministry through education, music, technology mentorship, 
                creative arts, and multilingual education programs.
              </p>
            </Card>
          </div>

          {/* Pastor Section */}
          <div className="text-center mb-16">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="max-w-3xl mx-auto">
                  <img 
                    src="https://voyagemia.com/wp-content/uploads/2025/02/c-1739001069779-personal_1739001564590_1739001564590_pastorjames_dunham_pastor-james-santiago-dunham-first-lutheran-church-of-miami-1-1.jpg" 
                    alt="Pastor James Santiago Dunham" 
                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mx-auto shadow-lg mb-6"
                  />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Pastor James Santiago Dunham</h2>
                  <Badge className="bg-blue-600 text-white mb-6">Lead Pastor & Founder</Badge>
                  <div className="space-y-4 text-lg text-gray-700">
                    <p>
                      Pastor James brings a unique blend of theological training and real-world experience to our ministry. 
                      With a heart for diverse communities and a passion for innovative outreach, he founded First Lutheran Church of Miami 
                      to create a welcoming space for all families.
                    </p>
                    <p>
                      His vision encompasses traditional Lutheran values with contemporary approaches to worship, education, and community engagement. 
                      Pastor James is committed to multilingual ministry, ensuring that language is never a barrier to experiencing God's love.
                    </p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      <a href="mailto:pastorjamesdunham@gmail.com" className="hover:text-blue-800 transition-colors">
                        pastorjamesdunham@gmail.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <a href="tel:+13136703830" className="hover:text-blue-800 transition-colors">
                        (313) 670-3830
                      </a>
                    </div>
                    <Link 
                      href="/pastor-james-article" 
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors block"
                    >
                      📰 Featured in Voyage MIA Magazine
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Special Programs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Special Programs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Piano Lessons */}
              <Card className="shadow-xl hover:shadow-2xl transition-shadow border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/btvo34vs_Tingting%2BCoverPhoto%2Bfor%2BVoyageMIA%2B06282025.webp" 
                      alt="Dr. Tingting Wu - Concert Pianist and Piano Instructor" 
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mx-auto shadow-lg mb-4"
                    />
                    <Music className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  </div>
                  <CardTitle className="text-xl">Piano Lessons with Dr. Tingting</CardTitle>
                  <CardDescription className="text-purple-600 font-medium">World Class Pianist and Instructor!</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-center space-y-3">
                    <p className="text-gray-600">
                      Professional piano instruction with internationally acclaimed pianist Dr. Tingting.
                    </p>
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-3 text-sm italic text-gray-700 mx-2">
                      <p>
                        *Though Lumimusic and Dr Tingting's recitals are not 'church events', we give highest marks to her. Dr. Tingting is the sole propietor of "Lumimusic", and has 100% creative control in her recitals. Any donations go directly to Dr. Tingting for the long term success of "Lumimusic".*
                      </p>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-purple-600" />
                        <a href="mailto:pianowtt@gmail.com" className="hover:text-purple-800 transition-colors">
                          pianowtt@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-purple-600" />
                        <a href="tel:+18572646097" className="hover:text-purple-800 transition-colors">
                          857.264.6097
                        </a>
                      </div>
                      <a 
                        href="https://www.tingtingw.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 hover:text-purple-800 font-medium transition-colors block"
                      >
                        www.tingtingw.com
                      </a>
                      <a 
                        href="https://www.eventbrite.com/e/lumimusic-grand-opening-miamis-no1-piano-light-concert-experience-tickets-1645181765949" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-purple-600 hover:text-purple-800 font-medium transition-colors block"
                      >
                        🎹 Miami Piano Light Concert Experience!
                      </a>
                      <Link 
                        href="/dr-tingting-article" 
                        className="text-purple-600 hover:text-purple-800 font-medium transition-colors block"
                      >
                        📰 Featured in Bold Journey Magazine
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tech Tutoring */}
              <Card className="shadow-xl hover:shadow-2xl transition-shadow border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    <img 
                      src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0hgv19y9_City%20of%20Miami%20Gardens%20NextGen%20Coders%20Class%20Graduates%20Photo%20%2310.jpg" 
                      alt="John Riley with NextGen Coders graduates" 
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full mx-auto shadow-lg mb-4"
                    />
                    <Laptop className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  </div>
                  <CardTitle className="text-xl">Tech Tutoring & Esports</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">Coding, Development & Gaming</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="text-center space-y-3">
                    <p className="text-gray-600">
                      Beginner and intermediate level coding, mobile/web development, 
                      emerging tech (AI/automation), gaming tournaments and more!
                    </p>
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center justify-center text-sm text-gray-700">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <a href="mailto:johnrileytech­solutions7@gmail.com" className="hover:text-blue-800 transition-colors">
                          johnrileytech­solutions7@gmail.com
                        </a>
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <a href="tel:+15616743150" className="hover:text-blue-800 transition-colors">
                          561.674.3150
                        </a>
                      </div>
                      <a 
                        href="https://kccplus.org/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors block"
                      >
                        🏫 KCC STEAM in South Florida
                      </a>
                      <Link 
                        href="/john-riley-article" 
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors block"
                      >
                        📰 Featured in Miami Herald
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-6 text-blue-200">
                  <Heart className="h-12 w-12" />
                </div>
                <h2 className="text-3xl font-bold mb-6">Our Mission & Beliefs</h2>
                <div className="max-w-4xl mx-auto space-y-4 text-lg">
                  <p>
                    At First Lutheran Church of Miami, we believe in the transformative power of God's love 
                    to unite people from all backgrounds in faith, fellowship, and service.
                  </p>
                  <p>
                    Our mission is to create an inclusive community where cultural diversity is celebrated, 
                    spiritual growth is nurtured, and everyone can experience the joy of belonging to God's family.
                  </p>
                  <p>
                    We are committed to Lutheran principles while embracing innovative approaches to worship, 
                    education, and outreach that meet the needs of our modern, multicultural congregation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FLC Constitution & Bylaws */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="h-12 w-12 mx-auto mb-6 text-purple-200">
                  📜
                </div>
                <h2 className="text-3xl font-bold mb-6">FLC Constitution & Bylaws</h2>
                <div className="max-w-4xl mx-auto space-y-4 text-lg">
                  <p className="text-purple-100">
                    Our church operates under our official Constitution and Bylaws, adopted September 5, 2025. 
                    These governing documents establish our structure, leadership, and operational procedures as a Lutheran congregation.
                  </p>
                  <p className="text-purple-100">
                    The Constitution outlines our doctrinal basis, membership requirements, pastoral duties, and congregational governance. 
                    Our Bylaws provide detailed procedures for meetings, elections, committees, and day-to-day operations.
                  </p>
                  <div className="pt-4">
                    <a 
                      href="https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/zbmj9wjs_FLC%20Constituion%20and%20bylaws.%20Sept%205%2C%202025.%20FINAL.docx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
                    >
                      📄 Download FLC Constitution & Bylaws (PDF)
                    </a>
                  </div>
                  <p className="text-purple-200 text-sm mt-4">
                    Adopted: September 5, 2025 | For questions about our governance, contact Pastor James Dunham
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Community & Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Community & Leadership</h2>
          
          {/* Board of Directors */}
          <div className="text-center mb-12">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="max-w-3xl mx-auto">
                  <Award className="h-12 w-12 mx-auto text-gold-600 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Board of Directors</h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Our dedicated board provides strategic leadership and oversight to ensure our church 
                    remains faithful to its mission while adapting to serve our growing community effectively.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Board Meeting Schedule</h4>
                    <p className="text-blue-700">
                      Regular board meetings are held monthly on the second Sunday of each month at 3:00 PM. 
                      All congregation members are welcome to attend and participate in discussions about our church's future.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Talented Musicians */}
          <div className="text-center mb-12">
            <Card className="bg-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="max-w-3xl mx-auto">
                  <Music className="h-12 w-12 mx-auto text-purple-600 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Talented Musicians</h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Music is central to our worship experience. We are blessed with incredibly talented musicians who lead 
                    our gifted Music Director and accomplished vocalists.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="font-semibold text-purple-800 mb-3">Music Ministry Opportunities</h4>
                    <p className="text-purple-700">
                      Whether you're interested in instrumental music, vocal performance, or music education, 
                      we have opportunities for musicians of all skill levels to contribute to our worship and community programs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gallery Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <img 
              src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/r8r2porw_Our%20partner%2C%20Localposh%20CEO%2C%20Eric%20Williams%20and%20family%21.JPG"
              alt="Eric Williams and family - LocalPosh CEO and church partner"
              className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hmet117m_Pastor%20James%20with%20Serena%20and%20Boris.jpg"
              alt="Pastor James with Serena and Boris"
              className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
            <img 
              src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/x121373s_Yay%21%201st%20Easter%20at%20FLC.JPG"
              alt="First Easter celebration at FLC"
              className="w-full h-64 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Visit Us</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">📍 Address</h4>
                  <p>1770 Brickell Avenue<br />Miami, FL 33129</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⏰ Service Times</h4>
                  <p>Sunday Worship: 1:00 PM<br />Bible & Language Classes: 2:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📞 Contact</h4>
                  <p>
                    <a href="mailto:pastorjamesdunham@gmail.com" className="hover:underline">
                      pastorjamesdunham@gmail.com
                    </a>
                    <br />
                    <a href="tel:+13136703830" className="hover:underline">(313) 670-3830</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;