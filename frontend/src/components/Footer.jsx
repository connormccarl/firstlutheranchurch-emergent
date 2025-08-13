import React from 'react';
import { Link } from 'react-router-dom';
import { Church, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Church className="h-8 w-8 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">First Lutheran Church</span>
                <span className="text-amber-400 -mt-1">of Miami</span>
              </div>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Building a community of faith, hope, and love in the heart of Miami. 
              Join us as we grow together in Christ's grace.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Faith Street, Miami, FL 33101</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(305) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@firstlutheranmiami.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Media
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-gray-400 hover:text-white transition-colors duration-200">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Schedule Meeting
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Service Times</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <p className="font-medium text-white">Sunday Worship</p>
                <p>10:00 AM</p>
              </div>
              <div>
                <p className="font-medium text-white">Bible Study</p>
                <p>Wednesday 7:00 PM</p>
              </div>
              <div>
                <p className="font-medium text-white">Youth Ministry</p>
                <p>Friday 6:00 PM</p>
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