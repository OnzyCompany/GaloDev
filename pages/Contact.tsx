import React from 'react';
import { useData } from '../services/dataStore';
import { Instagram, Twitter, Phone, MessageCircle, Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';

// Helper to get icon based on platform name
const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram size={24} />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter size={24} />;
  if (p.includes('discord')) return <MessageCircle size={24} />;
  if (p.includes('whatsapp') || p.includes('phone')) return <Phone size={24} />;
  if (p.includes('mail') || p.includes('email')) return <Mail size={24} />;
  return <LinkIcon size={24} />;
}

const Contact = () => {
  const { contacts } = useData();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <div className="container max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Entre em Contato</h1>
        <p className="text-slate-400 text-lg mb-12">Vamos criar algo incrível juntos!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {contacts.map((contact) => (
             <a 
                key={contact.id} 
                href={contact.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-card p-6 rounded-xl flex items-center gap-5 group hover:border-primary/40 transition-all hover:translate-y-[-2px]"
             >
                <div className="w-12 h-12 rounded-lg bg-slate-800/80 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {getIcon(contact.platform)}
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white mb-1">{contact.platform}</h3>
                    <p className="text-slate-400 text-sm">{contact.username}</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
             </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;