import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../services/dataStore';
import ProjectCard from '../components/ProjectCard';
import SEO from '../components/SEO';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Home = () => {
  const { projects, categories, profile } = useData();

  const featuredProjects = projects.filter(p => p.featured);
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen pt-20 pb-20">
      <SEO 
        title="Home" 
        description={`${profile.shortBio} Portfolio of ${profile.name} - Roblox VFX Artist & Developer.`} 
      />
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
        <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
            {/* Status Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/40 bg-black/40 backdrop-blur-md text-primary-glow text-sm font-medium mb-4 animate-slide-up shadow-lg shadow-black/20">
                Available for Hire
            </div>
            
            {/* Main Title with Text Shadow */}
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-white animate-slide-up drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]" style={{ animationDelay: '0.1s', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                {profile.name}
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-2xl md:text-4xl text-primary font-light animate-slide-up drop-shadow-lg" style={{ animationDelay: '0.2s' }}>
                {profile.title}
            </h2>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-slate-100 max-w-2xl mx-auto leading-relaxed animate-slide-up drop-shadow-md" style={{ animationDelay: '0.3s' }}>
                {profile.shortBio}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/portfolio" className="px-8 py-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2 border border-white/10 backdrop-blur-sm">
                    View Portfolio <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="px-8 py-4 rounded-lg bg-black/30 border border-white/20 hover:bg-white/10 hover:border-white/40 text-white font-bold transition-all flex items-center justify-center backdrop-blur-md shadow-lg">
                    About Me
                </Link>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce opacity-70 drop-shadow-lg">
            <ChevronDown size={32} />
        </div>
      </section>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
          <section className="container mx-auto px-6 py-20 relative z-10">
              <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-display font-bold text-white drop-shadow-md">Featured Projects</h2>
                  <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-grow"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        categoryName={categories.find(c => c.id === project.categoryId)?.name}
                      />
                  ))}
              </div>
          </section>
      )}

      {/* Categories Sections */}
      <div className="space-y-24 pb-20 relative z-10">
        {activeCategories.map(category => {
            const categoryProjects = projects
                .filter(p => p.categoryId === category.id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 4); // Limit to 4 per category on Home

            if (categoryProjects.length === 0) return null;

            return (
                <section key={category.id} className="container mx-auto px-6">
                    <div className="mb-8">
                        <h2 className="text-4xl font-display font-bold text-white flex items-center gap-3 mb-2 drop-shadow-md">
                            <span>{category.icon}</span> {category.name}
                        </h2>
                        <div className="w-24 h-1.5 bg-primary rounded-full mb-4 shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categoryProjects.map(project => (
                             <ProjectCard 
                                key={project.id} 
                                project={project} 
                             />
                        ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                        <Link to={`/portfolio?cat=${category.id}`} className="text-primary-glow hover:text-white font-medium text-sm transition-colors inline-flex items-center gap-1 backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/5 hover:border-primary/50">
                            View all {category.name} projects <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>
            );
        })}
      </div>

    </div>
  );
};

export default Home;