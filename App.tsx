import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './services/dataStore';
import { HelmetProvider } from 'react-helmet-async';
import BlueShaderBackground from './components/BlueShaderBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const AppContent = () => {
  return (
    <div className="relative w-full min-h-screen text-slate-100 font-sans selection:bg-primary selection:text-white">
      <BlueShaderBackground />
      <Navbar />
      <ScrollToTop />
      
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="relative z-10 py-8 border-t border-white/5 bg-black/20 text-center text-slate-500 text-sm">
        <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} GaloDev. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <DataProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </DataProvider>
    </HelmetProvider>
  );
};

export default App;