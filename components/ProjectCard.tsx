import React from 'react';
import { Link } from 'react-router-dom';
import { Project, MediaType } from '../types';
import { Star, PlayCircle, Image as ImageIcon } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  categoryName?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, categoryName }) => {
  const mainMedia = project.media.find(m => m.isMain) || project.media[0];
  
  return (
    <Link to={`/project/${project.id}`} className="block group">
      <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col relative">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-slate-900">
            {project.featured && (
                <div className="absolute top-2 right-2 z-10 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} fill="currentColor" /> Featured
                </div>
            )}
            
            {mainMedia ? (
                 <img 
                 src={mainMedia.url} 
                 alt={project.title} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 loading="lazy"
               />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                    No Media
                </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <span className="bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    View Details
                 </span>
            </div>
            
            {/* Media Type Icon */}
            <div className="absolute bottom-2 left-2 text-white/70">
                {mainMedia?.type === MediaType.VIDEO ? <PlayCircle size={16} /> : <ImageIcon size={16} />}
            </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
            {categoryName && (
                <span className="text-xs font-bold text-primary-glow uppercase tracking-wider mb-1">
                    {categoryName}
                </span>
            )}
            <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
            </h3>
            <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
                {project.description}
            </p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;