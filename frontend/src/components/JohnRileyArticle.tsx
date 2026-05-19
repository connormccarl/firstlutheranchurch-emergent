'use client';

/**
 * @module JohnRileyArticle
 * Static editorial page featuring John Riley's Miami Herald profile
 * (linked from /about).
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const JohnRileyArticle = () => {
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
              John Riley's Tech Mission
            </h1>
            <p className="text-lg text-gray-600">
              Featured in Miami Herald - Bridging Digital Divides in Miami Gardens
            </p>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0hgv19y9_City%20of%20Miami%20Gardens%20NextGen%20Coders%20Class%20Graduates%20Photo%20%2310.jpg" 
                  alt="John Riley with NextGen Coders graduates" 
                  className="w-full h-64 md:h-80 object-contain rounded-lg mb-6"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Empowering the Next Generation Through Technology</h2>
              
              <p className="text-gray-700 mb-6 italic">
                <strong>Miami Herald</strong> - In the heart of Miami Gardens, a quiet revolution is taking place. John Riley, a passionate educator and technology specialist, is transforming young lives through innovative coding and technology programs.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Breaking Barriers</h3>
              
              <p className="text-gray-700 mb-4">
                Riley's journey into tech education wasn't traditional. After years in the technology sector, he recognized a critical gap in tech access and education in underserved communities. This realization sparked his mission to create opportunities where none existed before.
              </p>

              <p className="text-gray-700 mb-4">
                "Every child deserves the chance to explore their potential in technology," Riley explains. "We're not just teaching coding – we're opening doors to futures these kids might never have imagined."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">NextGen Coders Program</h3>
              
              <p className="text-gray-700 mb-4">
                Through his partnership with the City of Miami Gardens and First Lutheran Church of Miami, Riley launched the NextGen Coders program. The initiative provides comprehensive technology education covering:
              </p>

              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Beginner and intermediate coding fundamentals</li>
                <li>Mobile and web development</li>
                <li>Emerging technologies including AI and automation</li>
                <li>Digital literacy and computer skills</li>
                <li>Gaming tournaments and esports training</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real Impact, Real Results</h3>
              
              <p className="text-gray-700 mb-4">
                The program's success is evident in its graduates. Students who once had limited exposure to technology are now creating their own apps, websites, and digital content. Several graduates have gone on to pursue computer science degrees and tech careers.
              </p>

              <p className="text-gray-700 mb-4">
                "Mr. Riley changed my life," says Maria Rodriguez, a program graduate now studying computer science at Florida International University. "He showed me that someone who looks like me could succeed in tech."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Partnership</h3>
              
              <p className="text-gray-700 mb-4">
                The program's success stems from strong community partnerships. First Lutheran Church of Miami provides meeting space and support, while the City of Miami Gardens offers resources and promotion. Local businesses have also stepped up, providing internship opportunities and mentorship.
              </p>

              <p className="text-gray-700 mb-4">
                Pastor James Dunham of First Lutheran Church of Miami notes, "John's work aligns perfectly with our mission of serving the community. These programs are changing lives and building futures."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking to the Future</h3>
              
              <p className="text-gray-700 mb-4">
                Riley's vision extends beyond current programs. He's working to expand offerings to include advanced cybersecurity training, entrepreneurship workshops, and partnerships with tech companies for direct job placement.
              </p>

              <p className="text-gray-700 mb-6">
                "This is just the beginning," Riley emphasizes. "Every student we reach has the potential to transform not just their own life, but their entire family and community. Technology is the great equalizer – we just need to make sure everyone has access to it."
              </p>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600 mb-6">
                <h4 className="text-lg font-semibold text-green-900 mb-2">Get Involved with John Riley's Programs</h4>
                <div className="space-y-2">
                  <p className="text-green-800">
                    <strong>Email:</strong> <a href="mailto:johnrileytechsolutions7@gmail.com" className="hover:underline">johnrileytechsolutions7@gmail.com</a>
                  </p>
                  <p className="text-green-800">
                    <strong>Phone:</strong> <a href="tel:+15616743150" className="hover:underline">561.674.3150</a>
                  </p>
                  <p className="text-green-800">
                    <strong>Programs:</strong> Coding, Web Development, AI/Automation, Esports
                  </p>
                  <p className="text-green-800">
                    <strong>Location:</strong> First Lutheran Church of Miami
                  </p>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm">
                  Originally published in the <strong>Miami Herald</strong> - Community Impact Series
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

export default JohnRileyArticle;