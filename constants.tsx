
import React from 'react';
import { Briefcase, Gavel, Scale, ShieldCheck, FileText, Users } from 'lucide-react';
import { PracticeArea, OfficeLocation } from './types';

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: 'corp',
    title: 'Corporate Law',
    description: 'Expert guidance on mergers, acquisitions, and corporate governance for enterprises.',
    icon: 'Briefcase'
  },
  {
    id: 'crim',
    title: 'Criminal Defense',
    description: 'Strategic defense representation in high-profile criminal litigation cases.',
    icon: 'Gavel'
  },
  {
    id: 'civ',
    title: 'Civil Litigation',
    description: 'Resolving disputes across a broad spectrum of commercial and private legal matters.',
    icon: 'Scale'
  },
  {
    id: 'ip',
    title: 'Intellectual Property',
    description: 'Securing and defending your innovations and creative assets globally.',
    icon: 'ShieldCheck'
  },
  {
    id: 'fam',
    title: 'Family Law',
    description: 'Compassionate legal support for complex family matters and domestic relations.',
    icon: 'Users'
  },
  {
    id: 'est',
    title: 'Estate Planning',
    description: 'Wealth preservation and management for future generations.',
    icon: 'FileText'
  }
];

export const OFFICES: OfficeLocation[] = [
  {
    id: 'ranchi',
    city: 'Ranchi',
    address: '2nd Floor, Tara Kunj Complex, Khelgoan Chowk, Ranchi, Jharkhand - 835217',
    phone: '+91 91101 5484',
    email: 'ranchi@anandpandey.in',
    coordinates: { lat: 23.3750, lng: 85.3550 },
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    locationUrl: 'https://www.google.com/maps/search/?api=1&query=Tara+Kunj+Complex+Khelgoan+Chowk+Ranchi'
  }
];

export const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-6 h-6" />;
    case 'Gavel': return <Gavel className="w-6 h-6" />;
    case 'Scale': return <Scale className="w-6 h-6" />;
    case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
    case 'FileText': return <FileText className="w-6 h-6" />;
    case 'Users': return <Users className="w-6 h-6" />;
    default: return <Scale className="w-6 h-6" />;
  }
};
