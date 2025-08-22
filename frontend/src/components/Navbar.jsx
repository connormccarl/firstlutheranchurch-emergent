import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church, MessageCircle, Calendar, Image, Info, Home, Globe, Camera } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const location = useLocation();

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
      // Reset to English by reloading the page
      if (document.querySelector('.goog-te-combo')) {
        const translateCombo = document.querySelector('.goog-te-combo');
        translateCombo.value = '';
        translateCombo.dispatchEvent(new Event('change'));
      }
      setTimeout(() => {
        window.location.reload();
      }, 500);
      return;
    }

    // Initialize Google Translate if not already loaded
    if (!window.googleTranslateElementInit || !document.querySelector('#google_translate_element .goog-te-combo')) {
      // Create Google Translate element
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'zh,es,fr,it,ja',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true
        }, 'google_translate_element');
        
        // Wait for translate element to be ready, then trigger translation
        const checkAndTranslate = setInterval(() => {
          const translateCombo = document.querySelector('#google_translate_element .goog-te-combo');
          if (translateCombo) {
            clearInterval(checkAndTranslate);
            setTimeout(() => {
              translateCombo.value = languageCode;
              translateCombo.dispatchEvent(new Event('change'));
            }, 100);
          }
        }, 100);
      };

      // Load Google Translate script if not already loaded
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      } else {
        window.googleTranslateElementInit();
      }
    } else {
      // Google Translate is already loaded, just change language
      const translateCombo = document.querySelector('#google_translate_element .goog-te-combo');
      if (translateCombo) {
        translateCombo.value = languageCode;
        translateCombo.dispatchEvent(new Event('change'));
      }
    }
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
        display: none !important; 
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
        display: none !important;
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
    { name: 'Media', path: '/media', icon: Image },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'AI Assistant', path: '/ai-assistant', icon: MessageCircle },
    { name: 'Schedule 1-on-1', path: '/schedule', icon: Calendar },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 min-w-0">
            <img 
              src="https://customer-assets.emergentagent.com/job_lutheran-church-web/artifacts/hskzjb5m_image.png" 
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
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
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
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
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
          </div>

          {/* Mobile menu button and language */}
          <div className="md:hidden flex items-center space-x-2">
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
                    to={item.path}
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
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </nav>
  );
};

export default Navbar;