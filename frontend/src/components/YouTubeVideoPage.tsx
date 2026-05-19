'use client';

/**
 * @module YouTubeVideoPage
 * Generic in-app YouTube player. Loaded from `/video/[videoId]` so
 * users stay on the church domain instead of being redirected to youtube.com.
 */

import { useParams } from 'next/navigation';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const YouTubeVideoPage = () => {
  const { videoId } = useParams();
  
  // Video data mapping
  const videoData = {
    // Music Videos
    'PEuGplaeTVU': {
      title: 'Church Music Performance',
      description: 'Beautiful musical performance showcasing our church\'s musical ministry and worship.',
      category: 'Music',
      categoryColor: 'bg-purple-600'
    },
    'knJnJJbT0-Y': {
      title: 'Music Ministry Video',
      description: 'Our music ministry in action, bringing worship and praise to our community.',
      category: 'Music',
      categoryColor: 'bg-purple-600'
    },
    
    // Educational Videos
    'JSTx0oiiisY': {
      title: 'Educational Content - Tech Learning',
      description: 'Educational content from our tech tutoring and coding programs, helping our community learn valuable digital skills.',
      category: 'Education',
      categoryColor: 'bg-green-600'
    },
    'XToCylT-XqI': {
      title: 'Educational Content - Programming Basics',
      description: 'Learning programming fundamentals as part of our community education initiatives.',
      category: 'Education',
      categoryColor: 'bg-green-600'
    },
    'tqlBAQ77AAE': {
      title: 'Educational Content - Digital Skills',
      description: 'Building digital literacy and technology skills for community empowerment.',
      category: 'Education',
      categoryColor: 'bg-green-600'
    },
    'g9MCF5eeIE0': {
      title: 'Educational Content - Advanced Learning',
      description: 'Advanced educational content supporting our community\'s continuous learning journey.',
      category: 'Education',
      categoryColor: 'bg-green-600'
    },
    'kRydSBxB9WI': {
      title: 'Educational Content - Skills Development',
      description: 'Skills development and training content for community growth and empowerment.',
      category: 'Education',
      categoryColor: 'bg-green-600'
    }
  };

  const video = videoData[videoId];
  
  if (!video) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="bg-gradient-to-br from-red-50 to-red-100 py-12 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Not Found</h1>
            <p className="text-gray-600">The requested video could not be found.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            <div className="flex justify-center mb-4">
              <span className={`${video.categoryColor} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                {video.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {video.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {video.description}
            </p>
          </div>

          {/* Video Content */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-8">
            <div className="aspect-video mb-6">
              <iframe
                className="w-full h-full rounded-lg shadow-lg"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {video.title}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {video.description}
              </p>
            </div>
          </div>

          {/* About Our Programs */}
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {video.category === 'Music' ? 'Our Music Ministry' : 'Educational Programs'}
                </h3>
                {video.category === 'Music' ? (
                  <>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Music is at the heart of our worship and community life at First Lutheran Church of Miami. 
                      Under the direction of world-class pianist Dr. Tingting Wu, our music ministry creates 
                      meaningful worship experiences that touch hearts and souls.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Our music programs include piano lessons, choir participation, and special musical events 
                      that bring our diverse community together in praise and celebration.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Education and community empowerment are core values at First Lutheran Church of Miami. 
                      Through our partnership with tech education programs, we provide valuable learning 
                      opportunities for our community members.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Led by John Riley, our tech tutoring and educational programs help build digital literacy 
                      and provide practical skills for personal and professional growth.
                    </p>
                  </>
                )}
              </div>
              
              <div className="text-center">
                <img 
                  src={video.category === 'Music' 
                    ? "https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/btvo34vs_Tingting%2BCoverPhoto%2Bfor%2BVoyageMIA%2B06282025.webp"
                    : "https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0hgv19y9_City%20of%20Miami%20Gardens%20NextGen%20Coders%20Class%20Graduates%20Photo%20%2310.jpg"
                  } 
                  alt={video.category === 'Music' ? "Dr. Tingting Wu" : "NextGen Coders Graduates"} 
                  className="w-full h-64 object-contain rounded-lg mb-4"
                />
                <p className="text-sm text-gray-600">
                  {video.category === 'Music' 
                    ? "Dr. Tingting Wu - Music Director & World-Class Pianist"
                    : "John Riley with NextGen Coders Graduates"
                  }
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
                  href="/gallery" 
                  className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View Gallery & Media
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

export default YouTubeVideoPage;