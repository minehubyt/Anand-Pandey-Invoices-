
export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  locationUrl?: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  role?: 'Partner' | 'Senior Associate' | 'Associate' | 'Counsel' | 'Senior Partner';
  linkedin?: string;
  whatsapp?: string;
  email?: string;
  qualifications?: string;
}

export interface Job {
  id: string;
  title: string;
  department: 'Litigation' | 'Corporate' | 'Support' | 'Internship';
  location: string;
  description: string;
  postedDate: string;
  status: 'active' | 'closed';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  jobTitle: string;
  status: 'Received' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected';
  submittedDate: string;
  data: {
    personal: {
      name: string;
      email: string;
      mobile: string;
      photo: string;
    };
    education: string;
    experience: string;
    interests: string;
    resumeUrl: string;
  };
}

export interface Insight {
  id: string;
  type: 'insights' | 'reports' | 'podcasts' | 'articles' | 'events' | 'casestudy';
  category: string;
  title: string;
  date: string;
  desc: string;
  image: string;
  bannerImage?: string;
  pdfUrl?: string;
  audioUrl?: string;
  season?: string;
  episode?: string;
  authorId?: string;
  content?: string;
  isFeatured?: boolean;
  showInHero?: boolean;
  featuredColor?: string;
  featuredLabel?: string;
}

export interface HeroContent {
  id: string;
  headline: string;
  subtext: string;
  backgroundImage: string;
  ctaText: string;
  active?: boolean;
}

export interface Inquiry {
  id: string;
  userId?: string;
  type: 'rfp' | 'contact' | 'appointment';
  name: string;
  email: string;
  date: string;
  status: 'new' | 'reviewed' | 'archived';
  uniqueId: string;
  details: any;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  itemCode?: string;
}

export interface InvoiceItemLibrary {
  id: string;
  code: string;
  description: string;
  defaultAmount?: number;
}

export interface PaymentRecord {
  amountCleared: number;
  date: string;
  mode: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Cash' | 'Wire Transfer';
  transactionReference: string;
}

export interface DigitalSignature {
  signatoryName: string;
  issuer: string;
  serialNumber: string;
  timestamp: string;
  tokenDevice: string;
  validUntil: string;
}

export interface InvoiceDetails {
  invoiceNo: string;
  date: string;
  kindAttn: string;
  clientName: string;
  mailingAddress: string;
  clientAddress: string;
  items: InvoiceLineItem[];
  totalAmount: number;
  amountInWords: string;
  terms: string[];
  payment?: PaymentRecord;
  signatureImage?: string; // For manual signature image
  digitalSignature?: DigitalSignature; // For DSC
  isRevoked?: boolean;
}

export interface ClientDocument {
  id: string;
  userId: string;
  type: 'invoice' | 'brief' | 'contract' | 'other';
  title: string;
  url: string; // Base64 or URL (Empty if purely digital invoice)
  uploadedBy: 'admin' | 'client';
  date: string;
  amount?: string; // For invoices
  status?: 'Paid' | 'Pending' | 'Overdue' | 'Canceled'; // Added Canceled
  invoiceDetails?: InvoiceDetails;
  archived?: boolean; // For Financial Year Resets
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  mobile?: string;
  role: 'applicant' | 'general' | 'admin' | 'premier';
  createdAt: string;
  // CRM Specific Fields
  address?: string; // Added for automatic invoice fetching
  assignedAdvocate?: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    photo?: string;
  };
  companyName?: string;
}
