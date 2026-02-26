export interface Pandit {
  id: string;
  name: string;
  imageUrl?: string;
  specialization: string;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  experience: number;
  about: string;
  services: string[];
}

export const pandits: Pandit[] = [
  {
    id: '1',
    name: 'Pandit Ramesh Sharma',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    specialization: 'Vedic Rituals & Ceremonies',
    location: 'New York, USA',
    languages: ['Hindi', 'Sanskrit', 'English'],
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    experience: 25,
    about: 'Pandit Ramesh Sharma is a highly respected priest with over 25 years of experience in performing traditional Hindu ceremonies.',
    services: ['1', '7'],
  },
  {
    id: '2',
    name: 'Acharya Sunil Joshi',
    imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    specialization: 'Vastu & Housewarming',
    location: 'Los Angeles, USA',
    languages: ['Hindi', 'Telugu', 'Sanskrit'],
    rating: 4.7,
    reviewCount: 98,
    verified: true,
    experience: 18,
    about: 'Acharya Sunil Joshi is an expert in Vastu Shastra and specializes in housewarming ceremonies.',
    services: ['2', '8'],
  },
  {
    id: '3',
    name: 'Pandit Vijay Agarwal',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
    specialization: 'Family Ceremonies',
    location: 'San Francisco, USA',
    languages: ['Hindi', 'English', 'Sanskrit'],
    rating: 4.9,
    reviewCount: 72,
    verified: true,
    experience: 15,
    about: 'Pandit Vijay Agarwal specializes in family ceremonies including baby naming, thread ceremonies, and other important life events.',
    services: ['3'],
  },
  {
    id: '4',
    name: 'Acharya Deepak Trivedi',
    specialization: 'Festival Pujas',
    location: 'Chicago, USA',
    languages: ['Hindi', 'English', 'Sanskrit'],
    rating: 4.6,
    reviewCount: 112,
    verified: true,
    experience: 20,
    about: 'Acharya Deepak Trivedi is an expert in festival pujas and rituals with 20 years of experience.',
    services: ['4'],
  },
  {
    id: '5',
    name: 'Jyotish Vinod Shastri',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    specialization: 'Vedic Astrology',
    location: 'Houston, USA',
    languages: ['Hindi', 'English', 'Gujarati', 'Sanskrit'],
    rating: 4.5,
    reviewCount: 86,
    verified: true,
    experience: 22,
    about: 'Jyotish Vinod Shastri is a renowned astrologer with over 22 years of experience in Vedic astrology.',
    services: ['5'],
  },
  {
    id: '6',
    name: 'Pandit Kailash Upadhyay',
    specialization: 'Funeral Rites',
    location: 'Seattle, USA',
    languages: ['Telugu', 'Hindi', 'English', 'Sanskrit'],
    rating: 4.9,
    reviewCount: 48,
    verified: true,
    experience: 30,
    about: 'Pandit Kailash Upadhyay specializes in traditional funeral ceremonies with 30 years of experience.',
    services: ['6'],
  },
  {
    id: '7',
    name: 'Pandit Anil Bhat',
    specialization: 'Griha Pravesh',
    location: 'Dallas, USA',
    languages: ['Hindi', 'Punjabi', 'English'],
    rating: 4.8,
    reviewCount: 64,
    verified: true,
    experience: 12,
    about: 'Pandit Anil Bhat specializes in Griha Pravesh ceremonies and home blessings.',
    services: ['1'],
  },
  {
    id: '8',
    name: 'Acharya Priya Sharma',
    specialization: 'Satyanarayan Puja',
    location: 'Boston, USA',
    languages: ['Hindi', 'English', 'Bengali'],
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    experience: 16,
    about: 'Acharya Priya Sharma is an expert in Satyanarayan Puja and family rituals.',
    services: ['4'],
  },
];
