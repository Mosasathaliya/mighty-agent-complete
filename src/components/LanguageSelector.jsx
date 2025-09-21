import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSelector = ({ onLanguageChange, selectedLanguage = 'en' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ];

  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const handleLanguageSelect = (langCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
    localStorage.setItem('mighty-agent-language', langCode);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('mighty-agent-language');
    if (savedLanguage && savedLanguage !== selectedLanguage) {
      onLanguageChange(savedLanguage);
    }
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-cyan-500/30 transition-all duration-200 text-white"
        dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium">
          {selectedLang.flag} {selectedLang.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-xl z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-cyan-500/10 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                selectedLanguage === language.code ? 'bg-cyan-500/20 text-cyan-300' : 'text-white'
              }`}
              dir={language.code === 'ar' ? 'rtl' : 'ltr'}
            >
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-gray-400">{language.name}</span>
              </div>
              {selectedLanguage === language.code && (
                <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

