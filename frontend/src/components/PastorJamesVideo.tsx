'use client';

/**
 * @module PastorJamesVideo
 * Standalone video page for Pastor James' Localposh testimonial.
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PastorJamesVideo = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/flc-logo.png" 
                alt="First Lutheran Church of Miami Logo" 
                className="h-20 w-20 md:h-24 md:w-24 object-contain filter drop-shadow-lg"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Pastor James Dunham Testimonial
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pastor James shares his experience with LocalPosh's AI-Powered Concierge
            </p>
          </div>

          {/* Video Content */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-8">
            <div className="aspect-video mb-6">
              <video 
                className="w-full h-full rounded-lg shadow-lg"
                controls
                poster="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/g8aln5dg_image.png"
              >
                <source 
                  src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/29tco80p_Pastor%20James%20Dunham%20of%20Miami%20%F0%9F%8C%9F%20Pastor%20James%20Dunham%20loves%20how%20Localposh%E2%80%99s%20AI-Powered%20Concierge%20makes%20life%20eas.mp4" 
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🌟 Pastor James Dunham loves how LocalPosh's AI-Powered Concierge makes life easier
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                In this testimonial video, Pastor James Dunham of First Lutheran Church of Miami shares his 
                positive experience with LocalPosh's innovative AI-Powered Concierge service. As a busy pastor 
                serving a diverse, multilingual community, Pastor James appreciates how technology can simplify 
                daily tasks and enhance ministry effectiveness.
              </p>
            </div>
          </div>

          {/* About the Partnership */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Partnership</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  First Lutheran Church of Miami is proud to partner with innovative local businesses 
                  like LocalPosh. This collaboration represents our commitment to embracing technology 
                  that serves our community better.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Pastor James's endorsement reflects his genuine experience with services that help 
                  streamline operations, allowing more time for what matters most - serving our congregation 
                  and community.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/g8aln5dg_image.png" 
                  alt="Eric Williams & Family with Pastor James" 
                  className="w-full h-64 object-contain rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600">
                  Eric Williams (LocalPosh CEO) & Family with Pastor James
                </p>
              </div>
            </div>
          </div>

          {/* Church Information */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Visit First Lutheran Church of Miami</h3>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">📍 Location</h4>
                  <p>1770 Brickell Avenue<br />Miami, FL 33129</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⏰ Service Times</h4>
                  <p>Sunday Worship: 1:00 PM<br />Bible & Language Classes: 2:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📞 Contact</h4>
                  <p>
                    <a href="tel:+13136703830" className="hover:underline">(313) 670-3830</a><br />
                    <a href="mailto:pastorjamesdunham@gmail.com" className="hover:underline">pastorjamesdunham@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/about" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Learn More About Us
                </a>
                <a 
                  href="/events" 
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View Upcoming Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PastorJamesVideo;