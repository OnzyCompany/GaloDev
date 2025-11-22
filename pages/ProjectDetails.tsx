import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../services/dataStore';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { MediaType } from '../types';
import SEO from '../components/SEO';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, categories } = useData();
  
  const project = projects.find(p => p.id === id);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
        <Link to="/portfolio" className="text-primary hover:underline">Back to Portfolio</Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === project.categoryId);
  const sortedMedia = [...project.media].sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1));
  const mainImage = sortedMedia.find(m => m.type === MediaType.IMAGE)?.url;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <SEO 
        title={project.title}
        description={project.description}
        image={mainImage}
      />

      <div className="container mx-auto max-w-6xl">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back
        </button>

        {/* Header Card */}
        <div className="glass-panel rounded-2xl p-8 mb-12 border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                         {category && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary-glow text-xs font-bold border border-primary/30">
                                {category.icon} {category.name}
                            </span>
                         )}
                         <span className="flex items-center gap-1 text-slate-500 text-xs">
                            <Calendar size={12} /> {new Date(project.createdAt).toLocaleDateString()}
                         </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">{project.title}</h1>
                    <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">{project.description}</p>
                </div>
            </div>

            {project.descriptionDetailed && (
                <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white mb-3">About the Project</h3>
                    <p className="text-slate-400 whitespace-pre-line leading-relaxed">
                        {project.descriptionDetailed}
                    </p>
                </div>
            )}
        </div>

        {/* Media Gallery */}
        <h3 className="text-2xl font-display font-bold text-white mb-6">Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedMedia.map((media) => (
                <div key={media.id} className="glass-card rounded-xl overflow-hidden flex flex-col">
                    <div className="aspect-video bg-black/40 relative">
                        {media.type === MediaType.VIDEO ? (
                            // Determine if iframe compatible or standard video
                            media.url.includes('youtube') || media.url.includes('vimeo') ? (
                                <iframe 
                                    src={media.url.replace('watch?v=', 'embed/')} 
                                    className="w-full h-full"
                                    title="Video player"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video controls className="w-full h-full object-contain">
                                    <source src={media.url} />
                                    Your browser does not support video.
                                </video>
                            )
                        ) : (
                            <img src={media.url} alt={media.description || project.title} className="w-full h-full object-contain bg-black/20" />
                        )}
                    </div>
                    {media.description && (
                        <div className="p-4 border-t border-white/5">
                            <p className="text-sm text-slate-300">{media.description}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;