import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils';
import { base44 } from '@/api/base44Client';
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
  LogOut
} from 'lucide-react';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adam_auth_token');
    if (!token && location.pathname !== '/login') {
      navigate('/login');
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
    base44.auth.logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Check Symptoms', icon: Stethoscope, path: '/symptoms' },
    { name: 'AI Chat', icon: MessageCircle, path: '/chat' },
    { name: 'Medicines', icon: Clock, path: '/medicines' },
    { name: 'History', icon: FileText, path: '/history' },
    { name: 'Emergency', icon: Phone, path: '/emergency' },
    { name: 'Profile', icon: User, path: '/profile' },
  ];

  // If we are on the login page, render children directly without the layout frame
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

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
              <span className="text-[10px] font-normal text-slate-500 uppercase tracking-wider">Health Assistant</span>
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

          {/* User / Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
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
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden lg:block">
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
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
              Logout
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
