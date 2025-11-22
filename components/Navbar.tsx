import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    scrolled 
      ? 'glass-panel py-3 shadow-lg border-b border-primary/20' 
      : 'bg-transparent py-6'
  }`;

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all">
             <span className="font-display font-bold text-xl text-white">G</span>
          </div>
          <span className={`font-display font-bold text-xl tracking-tight transition-all duration-300 ${scrolled ? 'opacity-100 translate-x-0' : 'opacity-100'}`}>
            <span className="text-white">Galo</span>
            <span className="text-primary-glow">Dev</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary-glow relative group ${location.pathname === link.path ? 'text-white' : 'text-slate-300'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
          
          {/* Admin Link (Subtle) */}
          <Link to="/admin" className="p-2 text-slate-400 hover:text-white transition-colors" title="Admin Panel">
            <LayoutDashboard size={18} />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full glass-panel border-t border-white/10 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col p-6 gap-4">
          {links.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-lg font-medium ${location.pathname === link.path ? 'text-primary-glow' : 'text-slate-300'}`}
            >
              {link.name}
            </Link>
          ))}
           <Link to="/admin" className="text-lg font-medium text-slate-500">Admin Panel</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;