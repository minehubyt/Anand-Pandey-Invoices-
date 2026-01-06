
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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { HeroContent, Insight, Author, OfficeLocation, Inquiry, Job, JobApplication, UserProfile, ClientDocument, PaymentRecord } from '../types';

// Re-declare config for secondary app usage
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
  DOCUMENTS: 'client_docs'
};

export const contentService = {
  seedData: async () => {
    try {
      // 1. Seed Hero
      const heroRef = doc(db, COLLECTIONS.HERO, 'main');
      const heroSnap = await getDoc(heroRef);
      if (!heroSnap.exists()) {
        console.log("Seeding Hero Data...");
        await setDoc(heroRef, {
          headline: "Strategic Legal Counsel for a Complex World",
          subtext: "Providing precise legal strategy and uncompromising advocacy for global enterprises and individuals.",
          backgroundImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2400",
          ctaText: "DISCUSS MANDATE"
        });
      }

      // 2. Seed Insights (if empty)
      const insightsRef = collection(db, COLLECTIONS.INSIGHTS);
      const insightsSnap = await getDocs(insightsRef);
      if (insightsSnap.empty) {
        console.log("Seeding Insights Data...");
        const sampleInsights = [
          {
            type: 'insights',
            category: 'LEGAL UPDATE',
            title: "The Future of AI Regulation in India",
            desc: "Analyzing the proposed Digital India Act and its impact on large language models and generative AI enterprises.",
            date: new Date().toISOString(),
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            isFeatured: true,
            showInHero: true
          },
          {
            type: 'reports',
            category: 'ANNUAL REPORT',
            title: "Global Litigation Trends 2025",
            desc: "A comprehensive review of cross-border dispute resolution mechanisms and the rise of commercial arbitration.",
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
            isFeatured: true,
            showInHero: false
          },
          {
            type: 'casestudy',
            category: 'CASE STUDY',
            title: "Infrastructure Arbitration Victory",
            desc: "Securing a ₹500 Cr award for a leading construction conglomerate against a state entity.",
            date: new Date(Date.now() - 86400000 * 5).toISOString(),
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
            isFeatured: false,
            showInHero: false
          },
          {
             type: 'podcasts',
             category: 'LEGAL PODCAST',
             title: "Ep 4: White Collar Defense Strategies",
             desc: "A deep dive into PMLA provisions and defense tactics with Senior Counsel AK Pandey.",
             date: new Date(Date.now() - 86400000 * 10).toISOString(),
             image: "https://images.unsplash.com/photo-1478737270239-2f02b77ac618?auto=format&fit=crop&q=80&w=800",
             season: "1",
             episode: "4",
             isFeatured: false,
             showInHero: true
          }
        ];
        for (const item of sampleInsights) {
          await addDoc(insightsRef, item);
        }
      }

      // 3. Seed Jobs
      const jobsRef = collection(db, COLLECTIONS.JOBS);
      const jobsSnap = await getDocs(jobsRef);
      if (jobsSnap.empty) {
         console.log("Seeding Jobs Data...");
         await addDoc(jobsRef, {
            title: "Senior Associate - Litigation",
            department: "Litigation",
            location: "New Delhi",
            description: "Seeking an experienced litigator with 5+ years of High Court practice.",
            postedDate: new Date().toISOString(),
            status: "active"
         });
      }

      // 4. Seed Offices
      const officesRef = collection(db, COLLECTIONS.OFFICES);
      const officesSnap = await getDocs(officesRef);
      if (officesSnap.empty) {
         console.log("Seeding Offices Data...");
         await addDoc(officesRef, {
            city: 'New Delhi',
            address: 'High Court Chambers, Shanti Path, New Delhi, 110001',
            phone: '+91 11 2345 6789',
            email: 'delhi@anandpandey.in',
            coordinates: { lat: 28.6139, lng: 77.2090 },
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'
         });
         await addDoc(officesRef, {
            city: 'Ranchi',
            address: '2nd Floor, Tara Kunj Complex, Khelgoan Chowk, Ranchi, Jharkhand - 835217',
            phone: '+91 91101 5484',
            email: 'ranchi@anandpandey.in',
            coordinates: { lat: 23.3750, lng: 85.3550 },
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
         });
      }

    } catch (err) {
      console.error("Content Seeding Error:", err);
    }
  },

  // --- STORAGE SERVICE ---
  uploadImage: async (file: File, folder: string = 'uploads'): Promise<string> => {
    try {
      // Create a unique filename
      const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${filename}`);
      
      // Upload
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Storage Upload Error:", error);
      throw new Error("Image upload failed. Please try again.");
    }
  },

  saveUserProfile: async (profile: UserProfile) => {
    await setDoc(doc(db, COLLECTIONS.USERS, profile.uid), profile, { merge: true });
  },

  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return snap.exists() ? snap.data() as UserProfile : null;
  },

  // --- CRM & ADMIN CLIENT MANAGEMENT ---

  createPremierUser: async (clientData: { email: string, password?: string, name: string, companyName: string, mobile: string, address: string }) => {
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    const secondaryAuth = getAuth(secondaryApp);

    try {
      // Try to create user
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
      // If user already exists (auth/email-already-in-use), we find their UID via the main app (via Firestore lookup usually, but since we can't search Auth, we assume they have a profile).
      // If we can't find their profile, we can't upgrade them easily without them signing in.
      // However, for this flow, we will try to find a user profile with this email in Firestore.
      
      try { await deleteApp(secondaryApp); } catch(e) {} 

      if (error.code === 'auth/email-already-in-use') {
         const q = query(collection(db, COLLECTIONS.USERS), where("email", "==", clientData.email));
         const snap = await getDocs(q);
         
         if (!snap.empty) {
            const existingDoc = snap.docs[0];
            await updateDoc(doc(db, COLLECTIONS.USERS, existingDoc.id), {
               role: 'premier',
               companyName: clientData.companyName,
               mobile: clientData.mobile,
               address: clientData.address
            });
            return existingDoc.id;
         } else {
            throw new Error("User exists in Auth but has no profile. Please ask user to login first.");
         }
      }
      throw error;
    }
  },

  invitePremierClient: async (clientData: any) => {
     return await contentService.createPremierUser({ ...clientData, password: clientData.password || 'Welcome@123' });
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

  // Documents
  subscribeClientDocuments: (userId: string, callback: (docs: ClientDocument[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), (snapshot) => {
      const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument));
      const clientDocs = allDocs.filter(d => d.userId === userId);
      clientDocs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(clientDocs);
    });
  },

  // Add this new method to get ALL invoices for the admin finance tab
  subscribeAllInvoices: (callback: (docs: ClientDocument[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), (snapshot) => {
      const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientDocument));
      // Filter only invoices and sort by date descending
      const invoices = allDocs.filter(d => d.type === 'invoice');
      invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(invoices);
    });
  },

  addClientDocument: async (docData: Omit<ClientDocument, 'id'>) => {
    await addDoc(collection(db, COLLECTIONS.DOCUMENTS), docData);
  },

  updateDocumentStatus: async (docId: string, status: string, paymentDetails?: PaymentRecord) => {
    // We first get the current document to merge payment details into invoiceDetails if it exists
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const currentData = docSnap.data() as ClientDocument;
        const updatedInvoiceDetails = currentData.invoiceDetails ? {
            ...currentData.invoiceDetails,
            payment: paymentDetails
        } : undefined;

        await updateDoc(docRef, { 
            status,
            ...(paymentDetails && { paymentDate: paymentDetails.date }),
            ...(updatedInvoiceDetails && { invoiceDetails: updatedInvoiceDetails })
        });
    }
  },

  deleteClientDocument: async (id: string) => {
    await deleteDoc(doc(db, COLLECTIONS.DOCUMENTS, id));
  },

  // --- STANDARD EXISTING METHODS ---

  subscribeHero: (callback: (hero: HeroContent) => void) => {
    return onSnapshot(doc(db, COLLECTIONS.HERO, 'main'), (docSnap) => {
      if (docSnap.exists()) callback({ id: docSnap.id, ...docSnap.data() } as HeroContent);
    }, (error) => console.error("Hero Subscription Error:", error));
  },

  saveHero: async (hero: Partial<HeroContent>) => {
    try {
      await setDoc(doc(db, COLLECTIONS.HERO, 'main'), hero, { merge: true });
    } catch (error) {
      console.error("Firestore Hero Save Error:", error);
      throw error; 
    }
  },

  subscribeJobs: (callback: (jobs: Job[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.JOBS), (snapshot) => {
      const allJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Job));
      callback(allJobs.filter(j => j.status === 'active'));
    }, (error) => console.error("Jobs Subscription Error:", error));
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
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as JobApplication)));
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
    }, (error) => console.error("Insights Subscription Error:", error));
  },
  
  subscribeHeroInsights: (callback: (insights: Insight[]) => void) => {
    return onSnapshot(collection(db, COLLECTIONS.INSIGHTS), (snapshot) => {
      const allInsights = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Insight));
      const heroItems = allInsights.filter(i => i.showInHero === true);
      heroItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(heroItems);
    }, (error) => console.error("Hero Insights Subscription Error:", error));
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
