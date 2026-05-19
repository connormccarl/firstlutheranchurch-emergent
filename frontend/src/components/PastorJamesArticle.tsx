'use client';

/**
 * @module PastorJamesArticle
 * Static editorial page featuring Pastor James' Voyage MIA magazine
 * profile (linked from /about).
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const PastorJamesArticle = () => {
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
              Daily Inspiration: Meet Pastor James Dunham
            </h1>
            <p className="text-lg text-gray-600">
              Featured in Voyage MIA Magazine
            </p>
          </div>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <img 
                  src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/5eqmmk0k_image.png" 
                  alt="Pastor James (Santiago) Dunham" 
                  className="w-full h-64 md:h-80 object-contain rounded-lg mb-6"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Inspiration: Meet Pastor James Dunham</h2>
              
              <p className="text-gray-700 mb-6 italic">
                We caught up with <strong>Pastor James (Santiago) Dunham</strong> of First Lutheran Church of Miami in our latest interview series exploring faith leaders who are making a difference in their communities.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">A Ministry Built on Diversity and Inclusion</h3>
              
              <p className="text-gray-700 mb-4">
                Pastor James Dunham has dedicated over 25 years to building bridges across cultures and languages. With the ability to teach and conduct services in fourteen different languages, he has created a unique ministry that celebrates diversity while bringing people together in faith.
              </p>

              <p className="text-gray-700 mb-4">
                "Faith knows no boundaries of language or culture," Pastor Dunham explains. "When we can worship together in someone's native tongue, we create a deeper connection not just to God, but to each other as a global community."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">From Coast to Coast: A Journey of Service</h3>
              
              <p className="text-gray-700 mb-4">
                Pastor James's journey has taken him across the United States and beyond. From helping build churches in Michigan to serving Latino communities in Los Angeles and Mexico, his ministry has always focused on meeting people where they are – both geographically and culturally.
              </p>

              <p className="text-gray-700 mb-4">
                His eight years of service in Los Angeles and Hermosillo, Sonora, Mexico, particularly shaped his approach to multilingual ministry. "Serving the Latino community taught me that language is just the beginning," he reflects. "Understanding cultural nuances, family dynamics, and community needs – that's where real ministry happens."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Building Community in Miami</h3>
              
              <p className="text-gray-700 mb-4">
                At First Lutheran Church of Miami, Pastor James has created something remarkable: a truly inclusive space where diversity is not just welcomed but celebrated. The church's multilingual services and international fellowship reflect Miami's multicultural spirit.
              </p>

              <p className="text-gray-700 mb-4">
                "Miami is a melting pot of cultures, and our church should reflect that," he says. "We have members from every continent, speaking dozens of languages. When we worship together, it's a beautiful reminder of God's global family."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">More Than a Pastor: Teacher, Counselor, Friend</h3>
              
              <p className="text-gray-700 mb-4">
                Beyond his pastoral duties, James has spent over 20 years in family counseling, bringing compassion and wisdom to some of life's most challenging moments. His multilingual abilities have proven invaluable in this work, allowing him to connect with families in their preferred language.
              </p>

              <p className="text-gray-700 mb-4">
                "Sometimes the most important conversation happens in someone's mother tongue," he explains. "Being able to offer comfort and guidance in the language closest to someone's heart – that's a privilege I don't take lightly."
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking Forward: A Vision for the Future</h3>
              
              <p className="text-gray-700 mb-4">
                As Pastor James looks to the future, his vision remains focused on building bridges and creating community. The church's various programs – from Dr. Tingting Wu's piano instruction to John Riley's tech education initiatives – reflect his belief in holistic ministry.
              </p>

              <p className="text-gray-700 mb-6">
                "Church isn't just about Sunday services," he emphasizes. "It's about creating a community where people can grow, learn, and support each other throughout the week. Whether someone needs spiritual guidance, wants to learn a new language, or is seeking educational opportunities for their children – we want to be here for all of that."
              </p>

              <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 mb-6 text-lg">
                "When we can worship together in someone's native tongue, we create a deeper connection not just to God, but to each other as a global community."
                <footer className="text-sm text-gray-500 mt-2">— Pastor James (Santiago) Dunham</footer>
              </blockquote>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Inspiration</h3>
              
              <p className="text-gray-700 mb-6">
                When asked about his source of daily inspiration, Pastor James's answer is immediate: "It's the people. Every day, I see acts of kindness, moments of faith, and examples of resilience in our community. From a grandmother teaching her grandchild to pray in their native language to young people like our tech students using their skills to help others – inspiration is everywhere if you're paying attention."
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-600 mb-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Connect with Pastor James</h4>
                <div className="space-y-2">
                  <p className="text-blue-800">
                    <strong>Email:</strong> <a href="mailto:pastorjamesdunham@gmail.com" className="hover:underline">pastorjamesdunham@gmail.com</a>
                  </p>
                  <p className="text-blue-800">
                    <strong>Phone:</strong> <a href="tel:+13136703830" className="hover:underline">(313) 670-3830</a>
                  </p>
                  <p className="text-blue-800">
                    <strong>Languages Offered:</strong> English, Spanish, French, Hebrew, Greek, Portuguese, Mandarin Chinese, Japanese, Italian, German, Hindi, Indonesian, Vietnamese, Russian, Urdu, and ASL
                  </p>
                  <p className="text-blue-800">
                    <strong>Services:</strong> Pastoral Care, Family Counseling, Language Classes, Spiritual Guidance
                  </p>
                  <p className="text-blue-800">
                    <strong>Church:</strong> First Lutheran Church of Miami, 1770 Brickell Avenue, Miami, FL 33129
                  </p>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-gray-600 text-sm">
                  Originally featured in <strong>Voyage MIA Magazine</strong> - Daily Inspiration Interview Series
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

export default PastorJamesArticle;