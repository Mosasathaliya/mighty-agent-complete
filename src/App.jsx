import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, Info, Settings, User, Globe, Brain, Zap, Code, Palette, Calculator, Search, Image, MessageSquare, MoreVertical, LogOut } from 'lucide-react';
import AuthScreen from './components/AuthScreen';
import LanguageSelector from './components/LanguageSelector';
import { getTranslation, isRTL } from './i18n/translations';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('https://mighty-agent-multi-model.speedofmastry.workers.dev');
  const [showSettings, setShowSettings] = useState(false);
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const messagesEndRef = useRef(null);

  const t = (key) => getTranslation(language, key);
  const rtl = isRTL(language);

  // Load saved language and user on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('mighty-agent-language');
    const savedUser = localStorage.getItem('mighty-agent-user');
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('mighty-agent-user');
      }
    }
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mighty-agent-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mighty-agent-user');
    }
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize welcome message when user logs in
  useEffect(() => {
    if (user && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        content: t('welcomeTitle'),
        timestamp: new Date().toISOString(),
        model: 'system'
      };
      setMessages([welcomeMessage]);
    }
  }, [user, language]);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('mighty-agent-language', newLanguage);
    
    // Update user language preference
    if (user) {
      const updatedUser = { ...user, language: newLanguage };
      setUser(updatedUser);
    }
  };

  const handleAuthentication = (authenticatedUser) => {
    setUser({ ...authenticatedUser, language });
  };

  const handleLogout = () => {
    setUser(null);
    setMessages([]);
    localStorage.removeItem('mighty-agent-user');
  };

  const detectMessageType = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('image') || lowerMessage.includes('picture') || lowerMessage.includes('photo') || 
        lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('draw')) {
      return 'image_generation';
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('function') || 
        lowerMessage.includes('script') || lowerMessage.includes('python') || lowerMessage.includes('javascript')) {
      return 'code_generation';
    }
    if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('solve') || 
        lowerMessage.includes('equation') || lowerMessage.includes('formula')) {
      return 'math_reasoning';
    }
    if (lowerMessage.includes('story') || lowerMessage.includes('write') || lowerMessage.includes('creative') || 
        lowerMessage.includes('poem') || lowerMessage.includes('article')) {
      return 'creative_writing';
    }
    if (lowerMessage.includes('research') || lowerMessage.includes('analyze') || lowerMessage.includes('study') || 
        lowerMessage.includes('investigate') || lowerMessage.includes('current events')) {
      return 'research';
    }
    
    return 'general_chat';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const messageType = detectMessageType(inputMessage);
      
      // Add analyzing message
      const analyzingMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: t('analyzing'),
        timestamp: new Date().toISOString(),
        isLoading: true
      };
      setMessages(prev => [...prev, analyzingMessage]);

      const response = await fetch(`${apiEndpoint}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          message: inputMessage,
          type: messageType,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove analyzing message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        const aiResponse = {
          id: Date.now() + 2,
          type: 'ai',
          content: data.response || t('errorGeneral'),
          timestamp: new Date().toISOString(),
          model: data.model_used || 'unknown',
          imageUrl: data.image_url,
          metadata: data.metadata
        };
        return [...filtered, aiResponse];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove analyzing message and add error response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        const errorResponse = {
          id: Date.now() + 3,
          type: 'ai',
          content: t('errorGeneral'),
          timestamp: new Date().toISOString(),
          isError: true
        };
        return [...filtered, errorResponse];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const newChat = () => {
    setMessages([]);
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: t('welcomeTitle'),
      timestamp: new Date().toISOString(),
      model: 'system'
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const modelCategories = [
    { icon: Code, name: t('codeGeneration'), models: t('qwenCoder'), color: 'text-green-400' },
    { icon: Palette, name: t('creativeWriting'), models: t('claudeSonnet'), color: 'text-purple-400' },
    { icon: Brain, name: t('reasoning'), models: t('gptReasoning'), color: 'text-blue-400' },
    { icon: Search, name: t('research'), models: t('perplexityOnline'), color: 'text-orange-400' },
    { icon: Image, name: t('imageGeneration'), models: t('fluxStable'), color: 'text-pink-400' },
    { icon: Calculator, name: t('mathSolving'), models: t('phi2Math'), color: 'text-yellow-400' }
  ];

  // If user is not authenticated, show auth screen
  if (!user) {
    return (
      <AuthScreen 
        onAuthenticated={handleAuthentication}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className={`h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex ${rtl ? 'flex-row-reverse' : 'flex-row'}`} dir={rtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`w-80 bg-gray-900/50 backdrop-blur-sm border-gray-700 flex flex-col ${rtl ? 'border-l' : 'border-r'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{t('appTitle')}</h1>
              <p className="text-sm text-cyan-300">{t('multiModelSystem')}</p>
              <p className="text-xs text-gray-400">{t('aiModelsCount')}</p>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={newChat}
            className={`w-full flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-4 h-4" />
            <span>{t('newChat')}</span>
            <span className="ml-auto bg-cyan-500 text-xs px-2 py-1 rounded-full">1</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => setShowSystemInfo(!showSystemInfo)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <Info className="w-4 h-4" />
            <span>{t('systemInfo')}</span>
            <span className="ml-auto bg-blue-600 text-xs px-2 py-1 rounded-full">2</span>
          </button>
        </div>

        {/* Model Categories */}
        <div className="flex-1 p-4">
          <h3 className={`text-sm font-semibold text-gray-400 mb-3 ${rtl ? 'text-right' : 'text-left'}`}>
            {t('modelCategories')}
          </h3>
          <div className="space-y-2">
            {modelCategories.map((category, index) => (
              <div key={index} className={`p-3 bg-gray-800/50 rounded-lg border border-gray-700 ${rtl ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-center gap-2 mb-1 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <category.icon className={`w-4 h-4 ${category.color}`} />
                  <span className="text-sm font-medium text-white">{category.name}</span>
                </div>
                <p className="text-xs text-gray-400">{category.models}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center gap-3 mb-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title={t('logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="mb-3">
            <LanguageSelector 
              selectedLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors ${rtl ? 'flex-row-reverse' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('settings')}</span>
            <span className="ml-auto bg-yellow-600 text-xs px-2 py-1 rounded-full">6</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-gray-900/30 backdrop-blur-sm border-b border-gray-700">
          <div className={`flex items-center gap-3 ${rtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{t('mightyLLM')}</h2>
              <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">{t('multiModalActive')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? (rtl ? 'flex-row' : 'flex-row-reverse') : (rtl ? 'flex-row-reverse' : 'flex-row')}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Brain className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 max-w-3xl ${message.type === 'user' ? (rtl ? 'text-right' : 'text-left') : (rtl ? 'text-left' : 'text-right')}`}>
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : message.isError
                    ? 'bg-red-900/50 border border-red-500/50 text-red-300'
                    : 'bg-gray-800/50 border border-gray-600 text-white'
                }`}>
                  {message.isLoading ? (
                    <div className={`flex items-center gap-2 ${rtl ? 'flex-row-reverse' : ''}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-cyan-300">{message.content}</span>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={message.imageUrl} 
                            alt="Generated image" 
                            className="max-w-full h-auto rounded-lg border border-gray-600"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Message Footer */}
                <div className={`flex items-center gap-2 mt-2 text-xs text-gray-400 ${rtl ? 'flex-row-reverse' : ''}`}>
                  <span>{formatTime(message.timestamp)}</span>
                  {message.model && message.model !== 'system' && (
                    <>
                      <span>•</span>
                      <span className="text-cyan-400">{t('mightyLLM')}</span>
                    </>
                  )}
                  {message.metadata?.processing_time && (
                    <>
                      <span>•</span>
                      <span>{message.metadata.processing_time}ms</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900/30 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatPlaceholder')}
                className={`w-full bg-gray-800/50 border border-gray-600 rounded-xl py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-colors ${rtl ? 'text-right pr-16 pl-6' : 'text-left pr-16 pl-6'}`}
                rows="1"
                style={{ minHeight: '56px', maxHeight: '120px' }}
                disabled={isLoading}
                dir={rtl ? 'rtl' : 'ltr'}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className={`absolute top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-all ${rtl ? 'left-2' : 'right-2'}`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Suggestions */}
            <div className={`mt-3 flex flex-wrap gap-2 ${rtl ? 'justify-end' : 'justify-start'}`}>
              <span className="text-xs text-gray-400">{t('suggestions')}</span>
              {[
                t('suggestCode'),
                t('suggestStory'),
                t('suggestMath'),
                t('suggestResearch'),
                t('suggestImage')
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-cyan-300 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

