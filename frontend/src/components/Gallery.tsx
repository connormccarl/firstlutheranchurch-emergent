'use client';

/**
 * @module Gallery
 * Public `/gallery` page. Renders a lightbox-style photo grid of
 * community photos plus a leadership/board section.
 */

import Link from 'next/link';

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const Gallery = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // Sample gallery data - you can replace with actual images and videos
  const galleryItems = [
    {
      id: 1,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/r8r2porw_Our%20partner%2C%20Localposh%20CEO%2C%20Eric%20Williams%20and%20family%21.JPG',
      title: 'Eric Williams & Family',
      description: 'LocalPosh CEO and church partner',
      category: 'community'
    },
    {
      id: 2,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hmet117m_Pastor%20James%20with%20Serena%20and%20Boris.jpg',
      title: 'Pastor James with Serena & Boris',
      description: 'Building relationships in our community',
      category: 'community'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/x121373s_Yay%21%201st%20Easter%20at%20FLC.JPG',
      title: 'First Easter Celebration',
      description: 'Celebrating milestones together',
      category: 'events'
    },
    {
      id: 4,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/btvo34vs_Tingting%2BCoverPhoto%2Bfor%2BVoyageMIA%2B06282025.webp',
      title: 'Dr. Tingting Wu',
      description: 'World-class pianist and music director',
      category: 'music'
    },
    {
      id: 5,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0hgv19y9_City%20of%20Miami%20Gardens%20NextGen%20Coders%20Class%20Graduates%20Photo%20%2310.jpg',
      title: 'NextGen Coders Graduates',
      description: 'John Riley with tech tutoring graduates',
      category: 'education'
    },
    {
      id: 6,
      type: 'image',
      src: '/flc-logo.png',
      title: 'First Lutheran Church of Miami Logo',
      description: 'Official church logo and branding',
      category: 'branding'
    },
    {
      id: 7,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/gi0tco68_Screenshot_20250819_155537_Add%20Text.jpg',
      title: 'Pastor James with Music Family',
      description: 'Sunday worship and language classes invitation - English & Spanish',
      category: 'community'
    },
    {
      id: 8,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/0ujczttk_Screenshot_20250819_155919_Add%20Text.jpg',
      title: 'Pastor James & Family Group',
      description: 'Welcome invitation in multiple languages',
      category: 'community'
    },
    {
      id: 9,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/m4fyvt06_Screenshot_20250819_154418_Add%20Text.jpg',
      title: 'Church Family Piano Gathering',
      description: 'Language learning and worship invitation',
      category: 'music'
    },
    {
      id: 10,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-miami/artifacts/afhu1dwf_Screenshot_20250819_154823_Add%20Text.jpg',
      title: 'Pastor Santiago & Church Family',
      description: 'Multilingual worship and classes invitation',
      category: 'community'
    },
    {
      id: 18,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/zr2830yy_20250826_133658.jpg',
      title: 'Pastor James Community Outreach',
      description: 'Pastor James connecting with local Miami businesses and community members',
      category: 'community'
    },
    {
      id: 19,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/apat6neq_Cristina%20and%20James%20%282%29.JPG',
      title: 'Cristina and Pastor James',
      description: 'Pastor James with Cristina, building relationships in our church community',
      category: 'community'
    },
    {
      id: 20,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/1hprx8av_Dr.%20Tingting%20Wu%2C%20Pastor%20James%2C%20and%20amazing%20friends%20at%20First%20Lutheran%20Church%20of%20Miami..jpg',
      title: 'Dr. Tingting Wu, Pastor James & Church Friends',
      description: 'Dr. Tingting Wu, Pastor James, and amazing friends at First Lutheran Church of Miami',
      category: 'community'
    },
    {
      id: 21,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/qq07jghx_JR%20and%20Pastor%20James.jpg',
      title: 'John Riley and Pastor James',
      description: 'Pastor James with John Riley, our tech tutoring program leader',
      category: 'community'
    },
    {
      id: 22,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/2t2u1t2x_Ketler%2C%20Pastor%20Santiago%2C%20Gigi%21.jpg',
      title: 'Ketler, Pastor Santiago & Gigi',
      description: 'Pastor Santiago (James) with Ketler and Gigi - wonderful church fellowship',
      category: 'community'
    },
    {
      id: 23,
      type: 'image',
      src: 'https://customer-assets.emergentagent.com/job_faith-connect-30/artifacts/dsktzjhd_Ketler%2C%20Santiago%2C%20Gigi%202.0%21.jpg',
      title: 'Ketler, Santiago & Gigi 2.0',
      description: 'Another joyful moment with Pastor Santiago, Ketler and Gigi at our church',
      category: 'community'
    },
    
    // YouTube Videos - Music Category
    {
      id: 11,
      type: 'video',
      src: getYouTubeThumbnail(getYouTubeVideoId('https://www.youtube.com/watch?v=PEuGplaeTVU')),
      title: 'Church Music Performance',
      description: 'Beautiful musical performance - Click to watch on YouTube',
      category: 'music',
      videoUrl: 'https://www.youtube.com/watch?v=PEuGplaeTVU',
      videoId: getYouTubeVideoId('https://www.youtube.com/watch?v=PEuGplaeTVU')
    },
    {
      id: 12,
      type: 'video',
      src: getYouTubeThumbnail(getYouTubeVideoId('https://www.youtube.com/watch?v=knJnJJbT0-Y')),
      title: 'Music Ministry Video',
      description: 'Our music ministry in action - Click to watch on YouTube',
      category: 'music',
      videoUrl: 'https://www.youtube.com/watch?v=knJnJJbT0-Y',
      videoId: getYouTubeVideoId('https://www.youtube.com/watch?v=knJnJJbT0-Y')
    },
    
    // Educational Videos from @kpg5277 channel
    {
      id: 13,
      type: 'video',
      src: getYouTubeThumbnail('JSTx0oiiisY'),
      title: 'Educational Video 1',
      description: 'Educational content from @kpg5277 channel - Click to watch on YouTube',
      category: 'education',
      videoUrl: 'https://youtu.be/JSTx0oiiisY?si=7koREEXj3bkLi13m',
      videoId: 'JSTx0oiiisY'
    },
    {
      id: 14,
      type: 'video',
      src: getYouTubeThumbnail('XToCylT-XqI'),
      title: 'Educational Video 2',
      description: 'Educational content from @kpg5277 channel - Click to watch on YouTube',
      category: 'education',
      videoUrl: 'https://youtu.be/XToCylT-XqI?si=ttGt4DEs2XPvEk-S',
      videoId: 'XToCylT-XqI'
    },
    {
      id: 15,
      type: 'video',
      src: getYouTubeThumbnail('tqlBAQ77AAE'),
      title: 'Educational Video 3',
      description: 'Educational content from @kpg5277 channel - Click to watch on YouTube',
      category: 'education',
      videoUrl: 'https://youtu.be/tqlBAQ77AAE?si=oPzL08qYxNalKo1M',
      videoId: 'tqlBAQ77AAE'
    },
    {
      id: 16,
      type: 'video',
      src: getYouTubeThumbnail('g9MCF5eeIE0'),
      title: 'Educational Video 4',
      description: 'Educational content from @kpg5277 channel - Click to watch on YouTube',
      category: 'education',
      videoUrl: 'https://youtu.be/g9MCF5eeIE0?si=lzVPGlHhUiR2LW2v',
      videoId: 'g9MCF5eeIE0'
    },
    {
      id: 17,
      type: 'video',
      src: getYouTubeThumbnail('kRydSBxB9WI'),
      title: 'Educational Video 5',
      description: 'Educational content from @kpg5277 channel - Click to watch on YouTube',
      category: 'education',
      videoUrl: 'https://youtu.be/kRydSBxB9WI?si=xswtyfxduNKH-cBl',
      videoId: 'kRydSBxB9WI'
    }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const categories = ['all', 'community', 'events', 'music', 'education', 'sermons', 'branding'];

  const openModal = (item) => {
    setSelectedMedia(item);
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction) => {
    const currentIndex = filteredItems.findIndex(item => item.id === selectedMedia.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    }
    
    setSelectedMedia(filteredItems[newIndex]);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}        
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src="/flc-logo.png" 
                alt="First Lutheran Church of Miami Logo" 
                className="h-28 w-28 md:h-32 md:w-32 object-contain filter drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Gallery & Media
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Photos, videos, sermons, and media from First Lutheran Church of Miami
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className={`capitalize ${
                  filter === category 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {category === 'all' ? 'All Media' : category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              // Special handling for Eric Williams & Family - route to video page
              if (item.id === 1) {
                return (
                  <Link key={item.id} href="/pastor-james-video">
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <div className="relative">
                        <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                            <Play className="h-16 w-16" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                          Video
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description} - Click to watch Pastor James's testimonial</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
              
              // YouTube videos - route to internal video pages
              if (item.type === 'video' && item.videoId) {
                return (
                  <Link
                    key={item.id}
                    href={`/video/${item.videoId}`}
                    className="block"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <div className="relative">
                        <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.src}
                            alt={item.title}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback if YouTube thumbnail fails to load
                              e.target.parentElement.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full bg-gray-200">
                                  <div class="h-12 w-12 text-gray-400 mb-2">▶</div>
                                  <span class="text-gray-500 text-sm">YouTube Video</span>
                                </div>
                              `;
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                            <Play className="h-16 w-16" />
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                          Video
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              }
              
              // Regular gallery items - open modal
              return (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => openModal(item)}
                >
                  <div className="relative">
                    <div className="h-64 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                        {item.type === 'video' ? (
                          <Play className="h-16 w-16" />
                        ) : (
                          <ImageIcon className="h-16 w-16" />
                        )}
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-blue-600 text-white">
                      {item.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add Media Section */}
          <div className="mt-12 text-center">
            <Card className="bg-white shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Photos & Videos</h2>
              <p className="text-gray-600 mb-6">
                Help us capture the spirit of our church community by sharing your photos and videos from services, events, and special moments.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
                Upload Media
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal for viewing images/videos */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <button
              onClick={() => navigateMedia('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            
            <button
              onClick={() => navigateMedia('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
            >
              <ChevronRight className="h-12 w-12" />
            </button>

            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="max-w-full max-h-96 w-auto h-auto object-contain"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedia.title}</h3>
                <p className="text-gray-600 mb-2">{selectedMedia.description}</p>
                <Badge className="bg-blue-600 text-white">{selectedMedia.category}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;