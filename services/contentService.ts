
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where
} from "firebase/firestore";
import { initializeApp, getApp, getApps, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "../firebase";
import { HeroContent, Insight, Author, OfficeLocation, Inquiry, Job, JobApplication, UserProfile, ClientDocument, PaymentRecord, InvoiceItemLibrary } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCSoV1SsHB-0Ue-OcWXhh41lbek4URuHAg",
  authDomain: "anandpandeyindia.firebaseapp.com",
  databaseURL: "https://anandpandeyindia-default-rtdb.firebaseio.com",
  projectId: "anandpandeyindia",
  storageBucket: "anandpandeyindia.firebasestorage.app",
  messagingSenderId: "1080997825126",
  appId: "1:1080997825126:web:4e2508acd6b5ad17983ba7",
  measurementId: "G-86TZWEFCFL"
};

const COLLECTIONS = {
  HERO: 'hero',
  INSIGHTS: 'insights',
  AUTHORS: 'authors',
  OFFICES: 'offices',
  INQUIRIES: 'inquiries',
  EVENTS: 'events',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  USERS: 'users',
  DOCUMENTS: 'client_docs',
  ITEM_LIBRARY: 'item_library'
};

export const contentService = {
  seedData: async () => {
    try {
      const heroRef = doc(db, COLLECTIONS.HERO, 'main');
      const heroSnap = await getDoc(heroRef);
      if (!heroSnap.exists()) {
        await setDoc(heroRef, {
          headline: "Strategic Legal Counsel for a Complex World",
          subtext: "Providing precise legal strategy and uncompromising advocacy for global enterprises and individuals.",
          backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400",
          ctaText: "DISCUSS MANDATE"
        });
      }

      const itemsRef = collection(db, COLLECTIONS.ITEM_LIBRARY);
      const itemsSnap = await getDocs(itemsRef);
      if (itemsSnap.empty) {
        const defaultItems = [
          { code: 'LCON', description: 'Legal Consultation - Senior Counsel', defaultAmount: 25000 },
          { code: 'DRAF', description: 'Legal Drafting & Review', defaultAmount: 15000 },
          { code: 'HCAP', description: 'High Court Appearance', defaultAmount: 50000 }
        ];
        for (const item of defaultItems) {
          await addDoc(itemsRef, item);
        }
      }
    } catch (err) {
      console.error("Content Seeding Error:", err);
    }
  },

  uploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1920; 
          const MAX_HEIGHT = 1920;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error("Browser canvas context failed")); return; }
          ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          const SAFETY_LIMIT = 950000;
          let quality = 0.9;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          while (dataUrl.length > SAFETY_LIMIT && quality > 0.1) {
             quality -= 0.1;
             dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
      };
      reader.onerror = (err) => reject(new Error("Failed to read file"));
    });
  },

  saveUserProfile: async (profile: UserProfile) => {
    await setDoc(doc(db, COLLECTIONS.USERS, profile.uid), profile, { merge: true });
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return snap.exists() ? snap.data() as UserProfile : null;
  },

  createPremierUser: async (clientData: { email: string, password?: string, name: string, companyName: string, mobile: string, address: string }) => {
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, clientData.email, clientData.password || 'Welcome@123');
      const uid = userCredential.user.uid;
      await setDoc(doc(db, COLLECTIONS.USERS, uid), {
        uid,
        email: clientData.email,
        name: clientData.name,
        companyName: clientData.companyName,
        mobile: clientData.mobile,
        address: clientData.address,
        role: 'premier',
        createdAt: new Date().toISOString()
      });
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);
      return uid;
    } catch (error: any) {
      try { await deleteApp(secondaryApp); } catch(e) {} 
      if (error.code === 'auth/email-already-in-use') {
         const q = query(collection(db, COLLECTIONS.USERS), where("email", "==", clientData.email));
         const snap = await getDocs(q);
         if (!snap.empty) {
            const existingDoc = snap.docs[0];
            await updateDoc(doc(db, COLLECTIONS.USERS, existingDoc.id), {
               role: 'premier',
               name: clientData.name,
               companyName: clientData.companyName,
               mobile: clientData.mobile,
               address: clientData.address
            });
            return existingDoc.id;
         }
      }
      throw error;
    }
  },

  getPremierClients: (callback: (clients: UserProfile[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.USERS), (snapshot) => {
      const users = snapshot.docs.map(d => d.data() as UserProfile);
      callback(users.filter(u => u.role === 'premier'));
    });
  },

  updateClientProfile: async (uid: string, data: Partial<UserProfile>) => {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), data);
  },

  deleteClientProfile: async (uid: string) => {
    await deleteDoc(doc(db, COLLECTIONS.USERS, uid));
  },

  subscribeClientDocuments: (userId: string, callback: (docs: ClientDocument[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), (snapshot) => {
      const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument));
      const clientDocs = allDocs.filter(d => d.userId === userId && !d.archived);
      clientDocs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(clientDocs);
    });
  },

  subscribeAllInvoices: (callback: (docs: ClientDocument[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), (snapshot) => {
      const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument));
      const invoices = allDocs.filter(d => d.type === 'invoice');
      invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(invoices);
    });
  },

  addClientDocument: async (docData: Omit<ClientDocument, 'id'>) => {
    await addDoc(collection(db, COLLECTIONS.DOCUMENTS), docData);
  },

  updateDocumentStatus: async (docId: string, status: string, paymentDetails?: PaymentRecord, archived: boolean = false) => {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const currentData = docSnap.data() as ClientDocument;
        const updatedInvoiceDetails = currentData.invoiceDetails ? {
            ...currentData.invoiceDetails,
            ...(paymentDetails ? { payment: paymentDetails } : {})
        } : undefined;
        await updateDoc(docRef, { 
            status,
            archived,
            ...(paymentDetails && { paymentDate: paymentDetails.date }),
            ...(updatedInvoiceDetails && { invoiceDetails: updatedInvoiceDetails })
        });
    }
  },

  revokeInvoice: async (docId: string) => {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentData = docSnap.data() as ClientDocument;
      if (currentData.invoiceDetails) {
        await updateDoc(docRef, {
          status: 'Canceled',
          'invoiceDetails.isRevoked': true
        });
      }
    }
  },

  deleteClientDocument: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.DOCUMENTS, id));
  },

  // Library Items
  subscribeItemLibrary: (callback: (items: InvoiceItemLibrary[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.ITEM_LIBRARY), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InvoiceItemLibrary)));
    });
  },

  saveLibraryItem: async (item: InvoiceItemLibrary) => {
    const { id, ...data } = item;
    if (id) await setDoc(doc(db, COLLECTIONS.ITEM_LIBRARY, id), data);
    else await addDoc(collection(db, COLLECTIONS.ITEM_LIBRARY), data);
  },

  deleteLibraryItem: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.ITEM_LIBRARY, id));
  },

  // Standard Methods
  subscribeHero: (callback: (hero: HeroContent) => void) => {
    return onSnapshot(doc(db, COLLECTIONS.HERO, 'main'), (docSnap) => {
      if (docSnap.exists()) callback({ id: docSnap.id, ...docSnap.data() } as HeroContent);
    });
  },

  saveHero: async (hero: Partial<HeroContent>) => {
    await setDoc(doc(db, COLLECTIONS.HERO, 'main'), hero, { merge: true });
  },

  subscribeJobs: (callback: (jobs: Job[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.JOBS), (snapshot) => {
      const allJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job));
      allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      callback(allJobs.filter(j => j.status === 'active'));
    });
  },

  saveJob: async (job: Job) => {
    const { id, ...data } = job;
    if (id) await setDoc(doc(db, COLLECTIONS.JOBS, id), data);
    else await addDoc(collection(db, COLLECTIONS.JOBS), { ...data, postedDate: new Date().toISOString() });
  },

  deleteJob: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.JOBS, id));
  },

  subscribeUserApplications: (userId: string, callback: (apps: JobApplication[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.APPLICATIONS), (snapshot) => {
      const allApps = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication));
      const userApps = allApps.filter(a => a.userId === userId);
      userApps.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
      callback(userApps);
    });
  },

  subscribeAllApplications: (callback: (apps: JobApplication[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.APPLICATIONS), (snapshot) => {
      const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication));
      apps.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
      callback(apps);
    });
  },

  submitApplication: async (app: Omit<JobApplication, 'id'>) => {
    return await addDoc(collection(db, COLLECTIONS.APPLICATIONS), app);
  },

  updateApplicationStatus: async (id: string, status: JobApplication['status']) => {
    await updateDoc(doc(db, COLLECTIONS.APPLICATIONS, id), { status });
  },

  subscribeInsights: (callback: (insights: Insight[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INSIGHTS), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(data);
    });
  },
  
  subscribeHeroInsights: (callback: (insights: Insight[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INSIGHTS), (snapshot) => {
      const allInsights = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight));
      const heroItems = allInsights.filter(i => i.showInHero === true);
      heroItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(heroItems);
    });
  },
  
  subscribeFeaturedInsights: (callback: (insights: Insight[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INSIGHTS), (snapshot) => {
      const allInsights = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight));
      const featuredItems = allInsights.filter(i => i.isFeatured === true);
      featuredItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(featuredItems);
    });
  },
  
  saveInsight: async (insight: Insight) => {
    const { id, ...data } = insight;
    if (id) await setDoc(doc(db, COLLECTIONS.INSIGHTS, id), data);
    else await addDoc(collection(db, COLLECTIONS.INSIGHTS), { ...data, date: new Date().toISOString() });
  },
  
  deleteInsight: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.INSIGHTS, id)),

  subscribeAuthors: (callback: (authors: Author[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.AUTHORS), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Author)));
    });
  },
  
  saveAuthor: async (author: Author) => {
    const { id, ...data } = author;
    if (id) await setDoc(doc(db, COLLECTIONS.AUTHORS, id), data);
    else await addDoc(collection(db, COLLECTIONS.AUTHORS), data);
  },
  
  deleteAuthor: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.AUTHORS, id)),

  subscribeOffices: (callback: (offices: OfficeLocation[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.OFFICES), (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as OfficeLocation)));
    });
  },
  
  saveOffice: async (office: OfficeLocation) => {
    const { id, ...data } = office;
    if (id) await setDoc(doc(db, COLLECTIONS.OFFICES, id), data);
    else await addDoc(collection(db, COLLECTIONS.OFFICES), data);
  },
  
  deleteOffice: async (id: string) => await deleteDoc(doc(db, COLLECTIONS.OFFICES, id)),

  subscribeInquiries: (callback: (inquiries: Inquiry[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INQUIRIES), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry));
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(data);
    });
  },

  subscribeUserInquiries: (userId: string, callback: (inquiries: Inquiry[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INQUIRIES), (snapshot) => {
      const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry));
      const userInquiries = all.filter(i => i.userId === userId);
      userInquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(userInquiries);
    });
  },
  
  addInquiry: async (inquiry: any) => {
    const uniqueId = `AKP-${Math.floor(Math.random() * 900000) + 100000}`;
    await addDoc(collection(db, COLLECTIONS.INQUIRIES), { 
      ...inquiry, 
      date: new Date().toISOString(), 
      status: 'new', 
      uniqueId 
    });
    return uniqueId;
  },
  
  updateInquiryStatus: async (id: string, status: string) => {
    await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { status });
  }
};
