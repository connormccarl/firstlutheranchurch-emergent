'use client';

/**
 * @module DrTingtingArticle
 * Static editorial page featuring Dr. Tingting Wu's Bold Journey
 * magazine profile (linked from /about).
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const DrTingtingArticle = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
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
              Meet Tingting Wu
            </h1>
            <p className="text-lg text-gray-600">
              Featured in Bold Journey Magazine
            </p>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/btvo34vs_Tingting%2BCoverPhoto%2Bfor%2BVoyageMIA%2B06282025.webp" 
                  alt="Dr. Tingting Wu" 
                  className="w-full h-64 md:h-80 object-contain rounded-lg mb-6"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Tingting Wu</h2>
              
              <p className="text-gray-700 mb-6">
                We caught up with the founder and owner of <strong>Tingting Wu Piano Studio</strong> in our latest edition of Bold Journey Magazine.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Her Journey</h3>
              
              <p className="text-gray-700 mb-4">
                Dr. Tingting Wu is an internationally acclaimed pianist whose musical journey began at the tender age of four in China. Her passion for music led her through rigorous training at some of the world's most prestigious institutions, culminating in advanced degrees in piano performance.
              </p>

              <p className="text-gray-700 mb-4">
                After establishing herself as a concert pianist with performances across multiple continents, Dr. Wu made the pivotal decision to dedicate her talents to education and ministry. This calling brought her to Miami, where she now serves as Music Director at First Lutheran Church of Miami.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Her Mission</h3>
              
              <p className="text-gray-700 mb-4">
                "Music is a universal language that speaks to the soul," Dr. Wu explains. "Through my teaching and performances, I hope to share the joy and spiritual depth that music can bring to people's lives."
              </p>

              <p className="text-gray-700 mb-4">
                At her piano studio, Dr. Wu offers comprehensive piano instruction for students of all ages and skill levels. Her teaching methodology combines classical techniques with modern approaches, ensuring each student develops both technical proficiency and artistic expression.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
              
              <p className="text-gray-700 mb-4">
                Beyond private instruction, Dr. Wu regularly performs at church services, community events, and charity fundraisers throughout Miami. Her commitment to using music as a force for good has made her a beloved figure in the local arts community.
              </p>

              <p className="text-gray-700 mb-4">
                "Tingting brings a level of artistry and dedication that elevates every performance," says Pastor James Dunham of First Lutheran Church of Miami. "Her contributions to our worship services and community outreach have been invaluable."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking Forward</h3>
              
              <p className="text-gray-700 mb-6">
                Dr. Wu continues to expand her impact through the Tingting Wu Piano Studio, where she nurtures the next generation of musicians. Her vision extends beyond technical training to developing well-rounded individuals who appreciate the transformative power of music.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Connect with Dr. Tingting Wu</h4>
                <div className="space-y-2">
                  <p className="text-blue-800">
                    <strong>Email:</strong> <a href="mailto:pianowtt@gmail.com" className="hover:underline">pianowtt@gmail.com</a>
                  </p>
                  <p className="text-blue-800">
                    <strong>Phone:</strong> <a href="tel:+18572646097" className="hover:underline">857.264.6097</a>
                  </p>
                  <p className="text-blue-800">
                    <strong>Website:</strong> <a href="https://www.tingtingw.com" target="_blank" rel="noopener noreferrer" className="hover:underline">www.tingtingw.com</a>
                  </p>
                  <p className="text-blue-800">
                    <strong>Church:</strong> First Lutheran Church of Miami
                  </p>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm">
                  Originally featured in <strong>Bold Journey Magazine</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DrTingtingArticle;