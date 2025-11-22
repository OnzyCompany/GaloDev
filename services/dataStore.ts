import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Category, Profile, Contact, MediaType } from '../types';
import { db, auth } from './firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, 
  query, orderBy, getDocs, writeBatch
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

// --- Initial Data for Seeding ---

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'VFX', icon: '✨', active: true, order: 1 },
  { id: 'c2', name: 'GFX', icon: '🎨', active: true, order: 2 },
  { id: 'c3', name: 'Modeling', icon: '🗿', active: true, order: 3 },
  { id: 'c4', name: 'Animation', icon: '🎬', active: true, order: 4 },
  { id: 'c5', name: 'Programming', icon: '💻', active: true, order: 5 },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Fire Magic System',
    categoryId: 'c1',
    description: 'Advanced modular fire magic system with dynamic lighting.',
    descriptionDetailed: 'I developed a complete fire magic framework for a high-fantasy RPG on Roblox. \n\nFeatures include:\n- Custom particle emitters optimized for mobile.\n- Dynamic light emission that interacts with the environment.\n- Physics-based projectile motion.\n- Modular script architecture allowing easy addition of new spells.',
    featured: true,
    createdAt: new Date().toISOString(),
    media: [
      { id: 'm1', url: 'https://picsum.photos/id/1/800/450', type: MediaType.IMAGE, isMain: true, description: 'Main spell cast effect' },
      { id: 'm2', url: 'https://picsum.photos/id/2/800/450', type: MediaType.IMAGE, isMain: false, description: 'Explosion impact' },
    ]
  },
  {
    id: 'p2',
    title: 'Cyberpunk City UI',
    categoryId: 'c2',
    description: 'Neon-styled user interface for a sci-fi shooter.',
    descriptionDetailed: 'A complete UI overhaul for "Neon Nights". Includes HUD, Inventory, and Shop systems using the latest Roact framework.',
    featured: true,
    createdAt: new Date().toISOString(),
    media: [
      { id: 'm3', url: 'https://picsum.photos/id/3/800/450', type: MediaType.IMAGE, isMain: true, description: 'HUD Overlay' },
    ]
  },
  {
    id: 'p3',
    title: 'Boss Fight Animation',
    categoryId: 'c4',
    description: 'Complex rigging and animation for final boss.',
    featured: false,
    createdAt: new Date().toISOString(),
    media: [
        { id: 'm4', url: 'https://picsum.photos/id/4/800/450', type: MediaType.IMAGE, isMain: true, description: 'Boss Idle' },
    ]
  }
];

const INITIAL_PROFILE: Profile = {
  name: 'GaloDev',
  title: 'VFX Artist & Roblox Developer',
  shortBio: 'Creating immersive visual experiences on Roblox for over 3 years.',
  fullBio: 'Com mais de 3 anos de experiência, transformo ideias criativas em efeitos visuais espetaculares para jogos do Roblox. Especializo-me em sistemas de partículas, magia, fogo, água e muito mais.',
  avatarUrl: 'https://picsum.photos/id/64/200/200',
  skills: ['VFX', 'Particle Systems', 'Roblox Studio', 'Lua Scripting', 'Blender', 'Photoshop'],
  experienceYears: 3
};

const INITIAL_CONTACTS: Contact[] = [
  { id: 'ct1', platform: 'Instagram', username: '@galodev_vfx', link: 'https://instagram.com' },
  { id: 'ct2', platform: 'Discord', username: 'GaloDev#1234', link: 'https://discord.com' },
  { id: 'ct3', platform: 'WhatsApp', username: '+55 (11) 98765-4321', link: 'https://whatsapp.com' },
];

// --- Context Setup ---

interface DataContextType {
  projects: Project[];
  categories: Category[];
  profile: Profile;
  contacts: Contact[];
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  
  addProject: (p: Project) => void;
  updateProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  
  updateProfile: (p: Profile) => void;
  
  addCategory: (c: Category) => void;
  updateCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;
  
  addContact: (c: Contact) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: string) => void;
  
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Data Sync
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to Collections with Error Handling
    
    const unsubProjects = onSnapshot(collection(db, 'projects'), 
      (snap) => {
        const projData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
        setProjects(projData);
      },
      (error) => {
        console.warn("Firestore Error (Projects):", error.message);
      }
    );

    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('order')), 
      (snap) => {
        const catData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(catData);
        
        // Initial Seed Check: If no categories exist, seed the DB
        // Only attempt seed if successful snapshot and empty
        if (snap.empty && !loading) {
          seedDatabase();
        }
      },
      (error) => {
        console.warn("Firestore Error (Categories):", error.message);
      }
    );

    const unsubContacts = onSnapshot(collection(db, 'contacts'), 
      (snap) => {
        const conData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
        setContacts(conData);
      },
      (error) => {
        console.warn("Firestore Error (Contacts):", error.message);
      }
    );

    const unsubProfile = onSnapshot(doc(db, 'settings', 'profile'), 
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        }
      },
      (error) => {
        console.warn("Firestore Error (Profile):", error.message);
      }
    );

    setLoading(false);

    return () => {
      unsubProjects();
      unsubCategories();
      unsubContacts();
      unsubProfile();
    };
  }, []);

  const seedDatabase = async () => {
    console.log("Attempting to seed database...");
    try {
        const batch = writeBatch(db);
        
        INITIAL_CATEGORIES.forEach(c => {
            const docRef = doc(db, 'categories', c.id);
            batch.set(docRef, c);
        });
        
        INITIAL_PROJECTS.forEach(p => {
            const docRef = doc(db, 'projects', p.id);
            batch.set(docRef, p);
        });
        
        INITIAL_CONTACTS.forEach(c => {
            const docRef = doc(db, 'contacts', c.id);
            batch.set(docRef, c);
        });
        
        const profileRef = doc(db, 'settings', 'profile');
        batch.set(profileRef, INITIAL_PROFILE);

        await batch.commit();
        console.log("Database seeded successfully!");
    } catch (e: any) {
        console.error("Error seeding database (likely permission denied or API disabled):", e.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const logout = () => signOut(auth);

  // --- CRUD Operations ---

  const addProject = async (p: Project) => {
    try { await setDoc(doc(db, 'projects', p.id), p); } catch(e) { console.error(e); }
  };

  const updateProject = async (p: Project) => {
    try { await updateDoc(doc(db, 'projects', p.id), { ...p }); } catch(e) { console.error(e); }
  };

  const deleteProject = async (id: string) => {
    try { await deleteDoc(doc(db, 'projects', id)); } catch(e) { console.error(e); }
  };

  const updateProfile = async (p: Profile) => {
    try { await setDoc(doc(db, 'settings', 'profile'), p); } catch(e) { console.error(e); }
  };

  const addCategory = async (c: Category) => {
    try { await setDoc(doc(db, 'categories', c.id), c); } catch(e) { console.error(e); }
  };

  const updateCategory = async (c: Category) => {
    try { await updateDoc(doc(db, 'categories', c.id), { ...c }); } catch(e) { console.error(e); }
  };

  const deleteCategory = async (id: string) => {
    try { await deleteDoc(doc(db, 'categories', id)); } catch(e) { console.error(e); }
  };

  const addContact = async (c: Contact) => {
    try { await setDoc(doc(db, 'contacts', c.id), c); } catch(e) { console.error(e); }
  };

  const updateContact = async (c: Contact) => {
    try { await updateDoc(doc(db, 'contacts', c.id), { ...c }); } catch(e) { console.error(e); }
  };

  const deleteContact = async (id: string) => {
    try { await deleteDoc(doc(db, 'contacts', id)); } catch(e) { console.error(e); }
  };

  return React.createElement(
    DataContext.Provider,
    {
      value: {
        projects,
        categories,
        profile,
        contacts,
        isAuthenticated: !!user,
        user,
        login,
        logout,
        addProject,
        updateProject,
        deleteProject,
        updateProfile,
        addCategory,
        updateCategory,
        deleteCategory,
        addContact,
        updateContact,
        deleteContact,
        loading
      }
    },
    children
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};