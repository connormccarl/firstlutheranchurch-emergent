import React from 'react';
import { Link } from 'react-router-dom';
import { Church, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Music, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hskzjb5m_image.png" 
                alt="First Lutheran Church of Miami Logo" 
                className="h-20 w-20 md:h-24 md:w-24 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold">First Lutheran Church</span>
                <span className="text-amber-400 -mt-1">of Miami</span>
              </div>
            </div>
            <p className="text-white font-medium mb-4 leading-relaxed">
              A "no judgment" zone - We love you the way you are! Open to all people, 
              truly welcoming all ethnicities. Come grow with us in God's grace.
            </p>
            <div className="space-y-2 text-sm text-white font-bold">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-amber-400" />
                <span>1770 Brickell Avenue, Miami, FL 33129</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-amber-400" />
                <a href="tel:+13136703830" className="hover:text-amber-400 transition-colors">
                  (313) 670-3830
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-amber-400" />
                <a href="mailto:pastorjamesdunham@gmail.com" className="hover:text-amber-400 transition-colors">
                  pastorjamesdunham@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  Media
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-white font-bold hover:text-amber-400 transition-colors duration-200">
                  Schedule Meeting
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Times & Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Sunday Schedule</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="font-medium text-white flex items-center">
                  <Church className="h-3 w-3 mr-2" />
                  Worship Service
                </p>
                <p>Sunday 1:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-white flex items-center">
                  <Globe className="h-3 w-3 mr-2" />
                  Bible & Language Classes
                </p>
                <p>Sunday 2:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-white flex items-center">
                  <Music className="h-3 w-3 mr-2" />
                  Piano Lessons - Dr. Tingting
                </p>
                <p>World class pianist and instructor!</p>
                <div className="text-xs mt-1">
                  <span>pianowtt@gmail.com | 857.264.6097</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-white mb-2">Leadership</h4>
              <div className="space-y-1 text-xs text-gray-400">
                <div>
                  <span className="text-amber-400">Pastor James Dunham</span>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    <a href="tel:+13136703830" className="hover:text-amber-400 transition-colors">
                      (313) 670-3830
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    <a href="mailto:pastorjamesdunham@gmail.com" className="hover:text-amber-400 transition-colors">
                      pastorjamesdunham@gmail.com
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-purple-400">Dr. Tingting</span>
                  <p>Music Director & Piano Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Programs */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-amber-400 mb-2">Special Programs</h4>
              <p className="text-xs text-gray-400">
                • Learn 14 different languages with Pastor James
                • First Communion & Catechism classes for children
                • Preschool & elementary instruction
                • Monthly fellowship meals at local restaurants
              </p>
            </div>
            <div>
              <h4 className="font-medium text-purple-400 mb-2">Piano Lessons - Dr. Tingting</h4>
              <p className="text-xs text-gray-400 mb-2">
                World class pianist and instructor!
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  <a href="mailto:pianowtt@gmail.com" className="hover:text-purple-400 transition-colors">
                    pianowtt@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <a href="tel:+18572646097" className="hover:text-purple-400 transition-colors">
                    857.264.6097
                  </a>
                </div>
                <a href="https://www.tingtingw.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                  www.tingtingw.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-2">Tech Tutoring & Esports</h4>
              <p className="text-xs text-gray-400 mb-2">
                Beginner and intermediate coding, mobile/web development, emerging tech (AI/automation), gaming tournaments and more!
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  <a href="mailto:johnrileytechsolutions7@gmail.com" className="hover:text-blue-400 transition-colors">
                    johnrileytechsolutions7@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <a href="tel:+15616743150" className="hover:text-blue-400 transition-colors">
                    561.674.3150
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors duration-200">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 First Lutheran Church of Miami. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;