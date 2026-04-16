import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { base44 } from '@/api/base44Client';
import { getTranslation } from '@/translations';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { 
  Home, 
  Stethoscope, 
  Clock, 
  MessageCircle,
  Phone, 
  User,
  Menu,
  X,
  Heart,
  FileText,
  LogOut,
  Globe,
  ChevronDown,
  Check
} from 'lucide-react';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('adam_language') || 'en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'hi', name: 'हिंदी (Hindi)', label: 'HI' },
    { code: 'mr', name: 'मराठी (Marathi)', label: 'MR' }
  ];

  const handleLanguageChange = (code) => {
    setLanguage(code);
    localStorage.setItem('adam_language', code);
    setLangMenuOpen(false);
    // In a real app, this would trigger i18n change
    window.location.reload(); // Simple way to reset state for now
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adam_auth_token');
    if (!token && location.pathname !== '/auth') {
      navigate('/auth');
    } else {
      loadUser();
    }
  }, [location.pathname, navigate]);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.log('Not logged in');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adam_auth_token');
    localStorage.removeItem('adam_current_user');
    localStorage.removeItem('adam_ai_chat_v1');
    base44.auth.logout();
    navigate('/auth');
  };

  const navigation = [
    { name: getTranslation('home'), icon: Home, path: '/' },
    { name: getTranslation('checkSymptoms'), icon: Stethoscope, path: '/symptoms' },
    { name: getTranslation('aiChat'), icon: MessageCircle, path: '/chat' },
    { name: getTranslation('medicines'), icon: Clock, path: '/medicines' },
    { name: getTranslation('history'), icon: FileText, path: '/history' },
    { name: getTranslation('emergency'), icon: Phone, path: '/emergency' },
    { name: getTranslation('profile'), icon: User, path: '/profile' },
  ];



  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="p-1.5 bg-teal-600 rounded-lg">
              <Heart className="h-5 w-5 text-white fill-current" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg">ADAM</span>
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider">{getTranslation('healthAssistant')}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sky-600 text-white shadow-sm" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User / Mobile Menu Toggle / Language Selector */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <Globe className="h-4 w-4 text-teal-600" />
                <span>{languages.find(l => l.code === language)?.label}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", langMenuOpen && "rotate-180")} />
              </button>

              {langMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[60]" 
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-[70] py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between",
                          language === lang.code 
                            ? "bg-teal-50 text-teal-700 font-semibold" 
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {lang.name}
                        {language === lang.code && <Check className="h-4 w-4 text-teal-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {user ? (
              <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {getTranslation('logout')}
                </Button>
              </div>
            ) : (
              <div className="hidden lg:block">
                <Link to="/auth">
                  <Button size="sm">{getTranslation('signIn')}</Button>
                </Link>
              </div>
            )}

            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white border-t border-slate-100 p-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                    isActive 
                      ? "bg-teal-50 text-teal-700" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="h-px bg-slate-100 my-2" />
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              {getTranslation('logout')}
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
