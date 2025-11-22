import React from 'react';
import { useData } from '../services/dataStore';

const About = () => {
  const { profile } = useData();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-center mb-2">Sobre Mim</h1>
        <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12"></div>

        <div className="glass-panel rounded-xl p-8 md:p-12 border border-white/10 shadow-2xl">
          {/* Biografia */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Biografia</h2>
            <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-line">
              {profile.fullBio}
            </p>
          </div>

          {/* Experiência */}
          <div className="mb-10">
             <h2 className="text-2xl font-display font-bold text-white mb-4">Experiência</h2>
             <p className="text-slate-300 text-lg">
               {profile.experienceYears} anos de experiência
             </p>
          </div>

          {/* Habilidades */}
          <div>
            <h2 className="text-2xl font-display font-bold text-white mb-6">Habilidades</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-primary-glow font-medium hover:border-primary/30 hover:bg-primary/10 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;