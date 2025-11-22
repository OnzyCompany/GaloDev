import React from 'react';
import { useData } from '../services/dataStore';
import ProjectCard from '../components/ProjectCard';

const Portfolio = () => {
  const { projects, categories } = useData();
  const activeCategories = categories.filter(c => c.active).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold text-white mb-4">My Portfolio</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Explore a collection of my best work across VFX, animation, and programming.</p>
        </div>

        <div className="space-y-24">
          {activeCategories.map(category => {
              const categoryProjects = projects.filter(p => p.categoryId === category.id);
              if (categoryProjects.length === 0) return null;

              return (
                  <div key={category.id} id={`cat-${category.id}`}>
                      <div className="flex items-center gap-4 mb-8 sticky top-20 z-10 py-4 backdrop-blur-sm -mx-4 px-4 rounded-lg border-b border-white/5">
                          <span className="text-3xl">{category.icon}</span>
                          <h2 className="text-3xl font-display font-bold text-white">{category.name}</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {categoryProjects.map(project => (
                              <ProjectCard key={project.id} project={project} />
                          ))}
                      </div>
                  </div>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;