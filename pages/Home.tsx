import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../services/dataStore';
import ProjectCard from '../components/ProjectCard';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Home = () => {
  const { projects, categories, profile } = useData();

  const featuredProjects = projects.filter(p => p.featured);
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen pt-20 pb-20">
      
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative">
        <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
            <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary-glow text-sm font-medium mb-4 animate-slide-up">
                Available for Hire
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {profile.name}
            </h1>
            
            <h2 className="text-2xl md:text-4xl text-primary font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {profile.title}
            </h2>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
                {profile.shortBio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Link to="/portfolio" className="px-8 py-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(14,165,233,0.3)] flex items-center justify-center gap-2">
                    View Portfolio <ArrowRight size={20} />
                </Link>
                <Link to="/about" className="px-8 py-4 rounded-lg glass-panel hover:bg-white/5 text-white font-bold transition-all flex items-center justify-center">
                    About Me
                </Link>
            </div>
        </div>

        <div className="absolute bottom-10 animate-bounce opacity-50">
            <ChevronDown size={32} />
        </div>
      </section>

      {/* Featured Section */}
      {featuredProjects.length > 0 && (
          <section className="container mx-auto px-6 py-20">
              <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-display font-bold text-white">Featured Projects</h2>
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
      <div className="space-y-24 pb-20">
        {activeCategories.map(category => {
            const categoryProjects = projects
                .filter(p => p.categoryId === category.id)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 4); // Limit to 4 per category on Home

            if (categoryProjects.length === 0) return null;

            return (
                <section key={category.id} className="container mx-auto px-6">
                    <div className="mb-8">
                        <h2 className="text-4xl font-display font-bold text-white flex items-center gap-3 mb-2">
                            <span>{category.icon}</span> {category.name}
                        </h2>
                        <div className="w-24 h-1.5 bg-primary rounded-full mb-4"></div>
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
                        <Link to={`/portfolio?cat=${category.id}`} className="text-primary-glow hover:text-white font-medium text-sm transition-colors inline-flex items-center gap-1">
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