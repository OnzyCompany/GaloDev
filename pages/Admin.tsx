import React, { useState } from 'react';
import { useData } from '../services/dataStore';
import { Project, MediaType, Category, Contact } from '../types';
import { 
  Trash2, Plus, Edit, Save, X, Upload, 
  LayoutDashboard, Folder, Star, Briefcase, 
  Settings, User, Phone, LogOut, ChevronRight,
  Palette
} from 'lucide-react';

const Admin = () => {
  const { 
    isAuthenticated, login, logout, 
    projects, categories, profile, contacts,
    addProject, updateProject, deleteProject,
    addCategory, updateCategory, deleteCategory,
    updateProfile,
    addContact, updateContact, deleteContact
  } = useData();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Tabs: dashboard, projects, categories, settings, about, contacts
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Project State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Category State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Contact State
  const [editingContact, setEditingContact] = useState<Partial<Contact> | null>(null);

  // Profile State (Local copy for form)
  const [profileForm, setProfileForm] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  
  // Need to update profile form when context profile changes (e.g. initial load)
  React.useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  const handleLogin = async () => {
    if (!emailInput || !passwordInput) {
        setLoginError('Preencha email e senha.');
        return;
    }
    setLoginError('');
    const success = await login(emailInput, passwordInput);
    if (!success) {
        setLoginError('Email ou senha inválidos.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
          {loginError && <p className="text-red-400 text-sm mb-4">{loginError}</p>}
          <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <button 
                onClick={handleLogin}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors"
              >
                Entrar
              </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  
  const handleCreateProject = () => {
      setActiveTab('projects');
      setEditingProject({ title: '', description: '', media: [], categoryId: categories[0]?.id || '', featured: false });
  };

  const handleSaveProject = () => {
    if (!editingProject || !editingProject.title) return;
    const newProject = {
        ...editingProject,
        id: editingProject.id || crypto.randomUUID(),
        createdAt: editingProject.createdAt || new Date().toISOString(),
        media: editingProject.media || []
    } as Project;

    if (editingProject.id) updateProject(newProject);
    else addProject(newProject);
    setEditingProject(null);
  };

  const handleAddMedia = () => {
    if (!editingProject) return;
    const newMedia = {
        id: crypto.randomUUID(),
        url: '',
        type: MediaType.IMAGE,
        isMain: editingProject.media && editingProject.media.length === 0
    };
    setEditingProject({ ...editingProject, media: [...(editingProject.media || []), newMedia] });
  };

  const handleUpdateMedia = (id: string, field: string, value: any) => {
      if(!editingProject?.media) return;
      const updatedMedia = editingProject.media.map(m => {
          if (m.id === id) return { ...m, [field]: value };
          return m;
      });
      setEditingProject({ ...editingProject, media: updatedMedia });
  };

  const handleDeleteMedia = (id: string) => {
      if(!editingProject?.media) return;
      setEditingProject({ ...editingProject, media: editingProject.media.filter(m => m.id !== id) });
  };

  const handleSaveCategory = () => {
    if (!editingCategory || !editingCategory.name) return;
    const newCategory = {
      ...editingCategory,
      id: editingCategory.id || crypto.randomUUID(),
      active: editingCategory.active ?? true,
      order: editingCategory.order ?? categories.length + 1
    } as Category;

    if (editingCategory.id) updateCategory(newCategory);
    else addCategory(newCategory);
    setEditingCategory(null);
  };

  const handleSaveContact = () => {
    if (!editingContact || !editingContact.platform) return;
    const newContact = {
      ...editingContact,
      id: editingContact.id || crypto.randomUUID(),
    } as Contact;

    if (editingContact.id) updateContact(newContact);
    else addContact(newContact);
    setEditingContact(null);
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    alert('Informações salvas com sucesso!');
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    setProfileForm({ ...profileForm, skills: [...profileForm.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileForm({ ...profileForm, skills: profileForm.skills.filter(s => s !== skillToRemove) });
  };

  // --- Stats for Dashboard ---
  const stats = {
      totalProjects: projects.length,
      activeCategories: categories.filter(c => c.active).length,
      featuredProjects: projects.filter(p => p.featured).length
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 font-sans">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-white/10 pb-6 gap-4">
            <div className="flex items-center gap-3">
                <LayoutDashboard className="text-primary" size={28} />
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            
            <div className="flex flex-wrap justify-center gap-1 bg-slate-900/50 p-1.5 rounded-lg border border-white/5">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'projects', label: 'Projetos', icon: Briefcase },
                    { id: 'categories', label: 'Categorias', icon: Folder },
                    { id: 'settings', label: 'Configurações', icon: Settings },
                    { id: 'about', label: 'Sobre', icon: User },
                    { id: 'contacts', label: 'Contatos', icon: Phone },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setEditingProject(null); setEditingCategory(null); setEditingContact(null); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === tab.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {/* Only show icon on mobile or if needed, kept text for desktop clarity per design */}
                        <span className="hidden md:inline">{tab.label}</span>
                        <span className="md:hidden"><tab.icon size={18} /></span>
                    </button>
                ))}
            </div>

            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors p-2" title="Sair">
                <LogOut size={24} />
            </button>
        </div>

        {/* --- DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-slate-400">Visão geral do seu portfólio</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-panel p-6 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Total de Projetos</p>
                            <p className="text-4xl font-bold text-white">{stats.totalProjects}</p>
                        </div>
                        <div className="p-4 bg-blue-500/10 rounded-lg text-blue-400">
                            <Briefcase size={32} />
                        </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Categorias Ativas</p>
                            <p className="text-4xl font-bold text-white">{stats.activeCategories}</p>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-lg text-green-400">
                            <Folder size={32} />
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">Projetos em Destaque</p>
                            <p className="text-4xl font-bold text-white">{stats.featuredProjects}</p>
                        </div>
                        <div className="p-4 bg-yellow-500/10 rounded-lg text-yellow-400">
                            <Star size={32} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Quick Actions */}
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-6">Ações Rápidas</h3>
                        <div className="space-y-4">
                            <button onClick={handleCreateProject} className="w-full p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 flex items-center justify-between group transition-colors">
                                <span className="flex items-center gap-3 text-white font-medium">
                                    <Plus className="text-primary" /> Adicionar Projeto
                                </span>
                                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                            
                            <button onClick={() => setActiveTab('categories')} className="w-full p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 flex items-center justify-between group transition-colors">
                                <span className="flex items-center gap-3 text-white font-medium">
                                    <LayoutDashboard className="text-primary" /> Gerenciar Categorias
                                </span>
                                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>

                            <button onClick={() => setActiveTab('settings')} className="w-full p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 flex items-center justify-between group transition-colors">
                                <span className="flex items-center gap-3 text-white font-medium">
                                    <Palette className="text-primary" /> Personalização
                                </span>
                                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Category Preview */}
                    <div className="glass-panel p-6 rounded-xl border border-white/10">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">Categorias</h3>
                            <button onClick={() => setActiveTab('categories')} className="text-xs text-primary hover:text-white">Ver todas</button>
                         </div>
                         <div className="space-y-3">
                             {categories.sort((a,b) => a.order - b.order).slice(0, 5).map(c => (
                                 <div key={c.id} className="flex items-center justify-between p-3 rounded bg-slate-900/30 border border-white/5">
                                     <div className="flex items-center gap-3">
                                         <span className="text-xl">{c.icon}</span>
                                         <span className="text-slate-200 font-medium">{c.name}</span>
                                     </div>
                                     <span className={`text-xs px-2 py-1 rounded-full ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                         {c.active ? 'Ativa' : 'Inativa'}
                                     </span>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
            <div className="animate-fade-in">
                {!editingProject ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Gerenciar Projetos</h2>
                            <button 
                                onClick={handleCreateProject}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Plus size={18} /> Novo Projeto
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {projects.map(p => (
                                <div key={p.id} className="glass-panel p-4 rounded-lg flex justify-between items-center group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 bg-slate-800 rounded overflow-hidden border border-white/10">
                                            {p.media[0] ? <img src={p.media[0].url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Briefcase size={20} className="text-slate-600"/></div>}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{p.title}</h3>
                                            <span className="text-xs text-slate-400">{categories.find(c => c.id === p.categoryId)?.name || 'Sem Categoria'}</span>
                                            {p.featured && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">Destaque</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingProject(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit size={18} /></button>
                                        <button onClick={() => { if(confirm('Deletar projeto?')) deleteProject(p.id)}} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    // ... Project Form ...
                     <div className="glass-panel p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white">{editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}</h2>
                            <button onClick={() => setEditingProject(null)}><X size={24} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Título</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    value={editingProject.title}
                                    onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Categoria</label>
                                <select 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    value={editingProject.categoryId}
                                    onChange={e => setEditingProject({...editingProject, categoryId: e.target.value})}
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* Descriptions */}
                        <div className="mb-6">
                            <label className="block text-sm text-slate-400 mb-1">Descrição Curta</label>
                            <textarea 
                                className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white h-20 focus:border-primary outline-none resize-none"
                                value={editingProject.description}
                                onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm text-slate-400 mb-1">Descrição Detalhada (Página do Projeto)</label>
                            <textarea 
                                className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white h-32 focus:border-primary outline-none"
                                value={editingProject.descriptionDetailed || ''}
                                onChange={e => setEditingProject({...editingProject, descriptionDetailed: e.target.value})}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={editingProject.featured || false}
                                    onChange={e => setEditingProject({...editingProject, featured: e.target.checked})}
                                    className="w-4 h-4 accent-primary"
                                />
                                Projeto em Destaque
                            </label>
                        </div>
                        {/* Media */}
                        <div className="bg-slate-900/30 p-4 rounded-lg border border-white/5 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white text-sm">Mídias do Projeto</h3>
                                <button onClick={handleAddMedia} className="text-xs bg-primary/20 text-primary hover:bg-primary/30 px-2 py-1 rounded flex items-center gap-1 transition-colors"><Plus size={12} /> Adicionar Mídia</button>
                            </div>
                            <div className="space-y-3">
                                {editingProject.media?.map((m, idx) => (
                                    <div key={m.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 flex flex-col md:flex-row gap-3 items-start">
                                        <div className="w-full md:w-20 h-12 bg-slate-900 rounded flex items-center justify-center overflow-hidden border border-white/5 shrink-0">
                                            {m.url ? (m.type === MediaType.VIDEO ? <div className="text-xs text-slate-500">Video</div> : <img src={m.url} className="w-full h-full object-cover" />) : <Upload size={16} className="text-slate-600" />}
                                        </div>
                                        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                                            <input 
                                                placeholder="URL (Imagem/Video)" 
                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full"
                                                value={m.url}
                                                onChange={e => handleUpdateMedia(m.id, 'url', e.target.value)}
                                            />
                                            <select 
                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                                                value={m.type}
                                                onChange={e => handleUpdateMedia(m.id, 'type', e.target.value)}
                                            >
                                                <option value={MediaType.IMAGE}>Imagem</option>
                                                <option value={MediaType.VIDEO}>Vídeo</option>
                                                <option value={MediaType.GIF}>GIF</option>
                                            </select>
                                            <input 
                                                placeholder="Descrição (opcional)" 
                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full md:col-span-2"
                                                value={m.description || ''}
                                                onChange={e => handleUpdateMedia(m.id, 'description', e.target.value)}
                                            />
                                            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                                                <input 
                                                    type="radio" 
                                                    name="mainMedia"
                                                    checked={m.isMain}
                                                    onChange={() => {
                                                        const newMedia = editingProject.media?.map(media => ({...media, isMain: media.id === m.id}));
                                                        setEditingProject({...editingProject, media: newMedia});
                                                    }}
                                                />
                                                Capa Principal
                                            </label>
                                        </div>
                                        <button onClick={() => handleDeleteMedia(m.id)} className="text-red-400 p-1 hover:bg-red-500/10 rounded self-end md:self-center"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                {(!editingProject.media || editingProject.media.length === 0) && <p className="text-xs text-slate-500 text-center">Nenhuma mídia adicionada.</p>}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setEditingProject(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSaveProject} className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center gap-2">
                                <Save size={18} /> Salvar Projeto
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
             <div className="animate-fade-in">
                {!editingCategory ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Gerenciar Categorias</h2>
                            <button 
                                onClick={() => setEditingCategory({ name: '', icon: '', order: categories.length + 1, active: true })}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Plus size={18} /> Nova Categoria
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {categories.sort((a, b) => a.order - b.order).map(c => (
                                <div key={c.id} className="glass-panel p-4 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-xl border border-white/10">
                                            {c.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{c.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded ${c.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {c.active ? 'Ativa' : 'Inativa'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-500 text-sm hidden md:block">Ordem: {c.order}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingCategory(c)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit size={18} /></button>
                                            <button onClick={() => { if(confirm('Deletar esta categoria afetará os projetos nela. Continuar?')) deleteCategory(c.id); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white">{editingCategory.id ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                            <button onClick={() => setEditingCategory(null)}><X size={24} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Nome da Categoria</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    value={editingCategory.name}
                                    onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-400 mb-1">Ícone (Emoji)</label>
                                    <input 
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none text-center"
                                        value={editingCategory.icon}
                                        onChange={e => setEditingCategory({...editingCategory, icon: e.target.value})}
                                        placeholder="✨"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-slate-400 mb-1">Ordem</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                        value={editingCategory.order}
                                        onChange={e => setEditingCategory({...editingCategory, order: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={editingCategory.active !== false}
                                        onChange={e => setEditingCategory({...editingCategory, active: e.target.checked})}
                                        className="w-4 h-4 accent-primary"
                                    />
                                    Ativa (Visível no site)
                                </label>
                            </div>
                        </div>
                         <div className="flex justify-end gap-4">
                            <button onClick={() => setEditingCategory(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSaveCategory} className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center gap-2">
                                <Save size={18} /> Salvar
                            </button>
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* --- SETTINGS TAB (Basic Info) --- */}
        {activeTab === 'settings' && (
            <div className="glass-panel p-6 rounded-xl border border-white/10 animate-fade-in max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white">Configurações Gerais</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Nome do Artista</label>
                        <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                            value={profileForm.name}
                            onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Título / Cargo</label>
                        <input 
                            className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                            value={profileForm.title}
                            onChange={e => setProfileForm({...profileForm, title: e.target.value})}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Avatar URL</label>
                    <input 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                        value={profileForm.avatarUrl}
                        onChange={e => setProfileForm({...profileForm, avatarUrl: e.target.value})}
                    />
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSaveProfile} className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>
        )}

        {/* --- ABOUT TAB (Bio & Skills) --- */}
        {activeTab === 'about' && (
            <div className="glass-panel p-6 rounded-xl border border-white/10 animate-fade-in max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white">Sobre Mim & Habilidades</h2>
                </div>

                 <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Anos de Experiência</label>
                    <input 
                        type="number"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                        value={profileForm.experienceYears}
                        onChange={e => setProfileForm({...profileForm, experienceYears: parseInt(e.target.value)})}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Biografia Resumida (Home)</label>
                    <textarea 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white h-20 focus:border-primary outline-none resize-none"
                        value={profileForm.shortBio}
                        onChange={e => setProfileForm({...profileForm, shortBio: e.target.value})}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-slate-400 mb-1">Biografia Completa (Página Sobre)</label>
                    <textarea 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white h-32 focus:border-primary outline-none"
                        value={profileForm.fullBio}
                        onChange={e => setProfileForm({...profileForm, fullBio: e.target.value})}
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm text-slate-400 mb-2">Habilidades</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            className="flex-grow bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                            placeholder="Adicionar habilidade (ex: Blender)"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                        />
                        <button onClick={handleAddSkill} className="bg-slate-700 hover:bg-slate-600 text-white px-4 rounded font-medium">Adicionar</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profileForm.skills.map((skill, idx) => (
                            <span key={idx} className="bg-primary/20 text-primary-glow px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-white"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSaveProfile} className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
            </div>
        )}

        {/* --- CONTACTS TAB --- */}
        {activeTab === 'contacts' && (
            <div className="animate-fade-in">
                {!editingContact ? (
                    <>
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Gerenciar Contatos</h2>
                            <button 
                                onClick={() => setEditingContact({ platform: '', username: '', link: '' })}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                <Plus size={18} /> Novo Contato
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {contacts.map(c => (
                                <div key={c.id} className="glass-panel p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white">{c.platform}</h3>
                                        <p className="text-sm text-slate-400">{c.username}</p>
                                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block max-w-[200px]">{c.link}</a>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingContact(c)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><Edit size={18} /></button>
                                        <button onClick={() => { if(confirm('Deletar contato?')) deleteContact(c.id) }} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="glass-panel p-6 rounded-xl border border-white/10 max-w-xl mx-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-xl font-bold text-white">{editingContact.id ? 'Editar Contato' : 'Novo Contato'}</h2>
                            <button onClick={() => setEditingContact(null)}><X size={24} className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <div className="space-y-4 mb-6">
                             <div>
                                <label className="block text-sm text-slate-400 mb-1">Plataforma</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    placeholder="Ex: Discord, Twitter"
                                    value={editingContact.platform}
                                    onChange={e => setEditingContact({...editingContact, platform: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm text-slate-400 mb-1">Usuário / Texto Exibido</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    value={editingContact.username}
                                    onChange={e => setEditingContact({...editingContact, username: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-sm text-slate-400 mb-1">Link URL</label>
                                <input 
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded p-2 text-white focus:border-primary outline-none"
                                    value={editingContact.link}
                                    onChange={e => setEditingContact({...editingContact, link: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setEditingContact(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSaveContact} className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold flex items-center gap-2">
                                <Save size={18} /> Salvar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Admin;