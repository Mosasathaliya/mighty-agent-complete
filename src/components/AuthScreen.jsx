import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getTranslation, isRTL } from '../i18n/translations';

const AuthScreen = ({ onAuthenticated, language, onLanguageChange }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const t = (key) => getTranslation(language, key);
  const rtl = isRTL(language);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email/password
      if (formData.email && formData.password) {
        const user = {
          email: formData.email,
          name: formData.email.split('@')[0],
          authenticated: true,
          language: language
        };
        onAuthenticated(user);
      } else {
        throw new Error('Please fill in all fields');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: rtl ? 'ذكاء اصطناعي متقدم' : 'Advanced AI',
      description: rtl ? 'أكثر من 70 نموذج ذكاء اصطناعي متخصص' : '70+ specialized AI models'
    },
    {
      icon: Zap,
      title: rtl ? 'توجيه ذكي' : 'Smart Routing',
      description: rtl ? 'اختيار تلقائي لأفضل نموذج' : 'Automatic optimal model selection'
    },
    {
      icon: Sparkles,
      title: rtl ? 'متعدد الوسائط' : 'Multi-Modal',
      description: rtl ? 'نص، كود، صور، ورياضيات' : 'Text, code, images, and math'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex ${rtl ? 'flex-row-reverse' : 'flex-row'}`} dir={rtl ? 'rtl' : 'ltr'}>
      {/* Left Side - Branding and Features */}
      <div className={`hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden`}>
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Logo and Branding */}
        <div className="relative z-10 text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('appTitle')}</h1>
          <p className="text-xl text-cyan-300 mb-8">{t('appSubtitle')}</p>
          
          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-cyan-500/30 ${rtl ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12`}>
        {/* Language Selector */}
        <div className={`w-full max-w-md mb-8 ${rtl ? 'text-right' : 'text-left'}`}>
          <LanguageSelector 
            selectedLanguage={language}
            onLanguageChange={onLanguageChange}
          />
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Form Header */}
            <div className={`text-center mb-8 ${rtl ? 'text-right' : 'text-left'}`}>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isSignUp ? t('getStarted') : t('welcomeBack')}
              </h2>
              <p className="text-gray-400">
                {isSignUp ? t('createAccount') : t('signIn')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium text-gray-300 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${rtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors ${rtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
                    placeholder={t('email')}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-medium text-gray-300 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
                  {t('password')}
                </label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${rtl ? 'right-3' : 'left-3'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors ${rtl ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'}`}
                    placeholder={t('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 ${rtl ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <div>
                  <label className={`block text-sm font-medium text-gray-300 mb-2 ${rtl ? 'text-right' : 'text-left'}`}>
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${rtl ? 'right-3' : 'left-3'}`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800/50 border border-gray-600 rounded-lg py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors ${rtl ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12'}`}
                      placeholder={t('confirmPassword')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 ${rtl ? 'left-3' : 'right-3'}`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link (Sign In Only) */}
              {!isSignUp && (
                <div className={`${rtl ? 'text-left' : 'text-right'}`}>
                  <button
                    type="button"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${rtl ? 'flex-row-reverse' : ''}`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isSignUp ? t('createAccount') : t('signIn')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Sign In/Sign Up */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', confirmPassword: '' });
                }}
                className="mt-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {isSignUp ? t('signIn') : t('signUp')}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {t('poweredBy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

