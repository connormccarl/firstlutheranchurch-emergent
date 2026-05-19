'use client';

/**
 * @module Navbar
 * Sticky top navigation with logo, primary links, the global Donate
 * modal trigger, and a Google-Translate-powered language switcher (English,
 * Mandarin, Spanish, Creole/French, Italian, Japanese).
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';
import { Menu, X, Church, MessageCircle, Calendar, Image, Info, Home, Globe, Camera, Mail, Heart } from 'lucide-react';
import { Button } from './ui/button';
import Donation from './Donation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const pathname = usePathname();
  const location = { pathname };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'Creole/French', flag: '🇭🇹' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  ];

  const translatePage = (languageCode, languageName) => {
    setCurrentLanguage(languageName);
    setLanguageOpen(false);
    
    if (languageCode === 'en') {
      // Reset to English by removing any translation parameters
      const url = new URL(window.location);
      url.searchParams.delete('hl');
      url.searchParams.delete('sl');
      url.searchParams.delete('tl');
      window.history.replaceState({}, '', url);
      
      // Remove Google Translate elements if they exist
      const googleTranslateElements = document.querySelectorAll('[id*="google_translate"], .goog-te-banner-frame, .skiptranslate');
      googleTranslateElements.forEach(el => el.remove());
      
      // Reload to get clean English version
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }

    // Try Google Translate first, with fallback to URL-based translation
    const attemptGoogleTranslate = () => {
      // Create or update Google Translate element
      let translateElement = document.getElementById('google_translate_element');
      if (!translateElement) {
        translateElement = document.createElement('div');
        translateElement.id = 'google_translate_element';
        translateElement.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0;';
        document.body.appendChild(translateElement);
      }

      // Load Google Translate script
      const loadTranslateScript = () => {
        return new Promise((resolve, reject) => {
          // Check if script already exists
          if (window.google?.translate?.TranslateElement) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;

          // Define the callback
          window.googleTranslateElementInit = function() {
            try {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'zh,es,fr,it,ja',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');

              // Wait for the select element to be ready
              setTimeout(() => {
                const select = document.querySelector('#google_translate_element select');
                if (select) {
                  select.value = languageCode;
                  select.dispatchEvent(new Event('change', { bubbles: true }));
                  console.log('✅ Google Translate activated for:', languageName);
                } else {
                  console.log('⚠️ Google Translate select not found, using fallback');
                  useUrlTranslation();
                }
              }, 1000);
            } catch (error) {
              console.log('⚠️ Google Translate init failed, using fallback');
              useUrlTranslation();
            }
          };

          document.head.appendChild(script);
        });
      };

      // Fallback: URL-based Google Translate
      const useUrlTranslation = () => {
        const currentUrl = window.location.href;
        const translateUrl = `https://translate.google.com/translate?sl=en&tl=${languageCode}&u=${encodeURIComponent(currentUrl)}`;
        
        // Option 1: Try to redirect to Google Translate
        try {
          window.open(translateUrl, '_blank');
          
          // Show user notification
          const notification = document.createElement('div');
          notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #1e40af; color: white; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-family: system-ui; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
              <div style="font-weight: bold; margin-bottom: 4px;">Translation Opening...</div>
              <div style="font-size: 14px;">The page is opening in Google Translate</div>
              <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 4px; right: 8px; background: none; border: none; color: white; cursor: pointer; font-size: 16px;">&times;</button>
            </div>
          `;
          document.body.appendChild(notification);
          
          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 5000);
          
        } catch (error) {
          console.log('URL translation also failed:', error);
          
          // Final fallback: Show message to user
          alert(`Translation to ${languageName} is currently unavailable. Please try again later or use your browser's built-in translation feature.`);
        }
      };

      // Try Google Translate, fall back to URL method if it fails
      loadTranslateScript().catch(() => {
        console.log('Google Translate script failed to load, using URL fallback');
        useUrlTranslation();
      });
    };

    // Start translation attempt
    attemptGoogleTranslate();
  };

  useEffect(() => {
    // Enhanced CSS to hide Google Translate elements and ensure proper styling
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { 
        display: none !important; 
      }
      .goog-te-menu-frame { 
        display: none !important; 
      }
      body { 
        top: 0px !important; 
        position: static !important;
      }
      #google_translate_element { 
        position: absolute !important;
        left: -9999px !important;
        width: 1px !important;
        height: 1px !important;
        opacity: 0 !important;
      }
      .goog-tooltip { 
        display: none !important; 
      }
      .goog-tooltip:hover { 
        display: none !important; 
      }
      .goog-text-highlight { 
        background: none !important; 
        box-shadow: none !important; 
      }
      .goog-te-gadget { 
        display: none !important; 
      }
      .goog-te-combo {
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
      }
      iframe.goog-te-menu-frame {
        display: none !important;
      }
      .goog-te-ftab {
        display: none !important;
      }
      .goog-te-button {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (languageOpen && !event.target.closest('.language-dropdown')) {
        setLanguageOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [languageOpen]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 min-w-0">
            <img 
              src="/flc-logo.png"
              alt="First Lutheran Church of Miami Logo"
              className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 object-contain"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                First Lutheran Church
              </span>
              <span className="text-sm sm:text-base text-amber-600 -mt-0.5 leading-tight">
                of Miami
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">
                    {item.name.includes('Schedule') ? 'Schedule' : item.name}
                  </span>
                </Link>
              );
            })}
            
            {/* Donate Button */}
            <Button
              onClick={() => setDonationOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden xl:inline">Donate</span>
            </Button>
            
            {/* Language Dropdown */}
            <div className="relative language-dropdown">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:bg-gray-100 hover:text-amber-600"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden xl:inline">{currentLanguage}</span>
              </Button>
              
              {languageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => translatePage(lang.code, lang.name)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medium screens navigation - simplified */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                  }`}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
            
            {/* Donate Button for medium screens */}
            <Button
              onClick={() => setDonationOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-200"
              title="Donate"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile menu button and language */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Donate Button */}
            <Button
              onClick={() => setDonationOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors duration-200"
              title="Donate"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            {/* Mobile Language Dropdown */}
            <div className="relative language-dropdown">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-1 text-gray-700"
              >
                <Globe className="h-5 w-5" />
              </Button>
              
              {languageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => translatePage(lang.code, lang.name)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-amber-50"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-amber-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Donate Menu Item */}
              <button
                onClick={() => {
                  setDonationOpen(true);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Heart className="h-5 w-5" />
                <span>Donate</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" aria-hidden="true"></div>
      
      {/* Donation Modal */}
      <Donation 
        isOpen={donationOpen} 
        onClose={() => setDonationOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;