export interface Category {
  id: string;
  title: string;
  imageUrl: string;
  count: number;
  icon?: string;
  description?: string;
}

export const categories: Category[] = [
  {
    id: '1',
    title: 'Griha Pravesh',
    description: 'Housewarming ceremony to bless your new home',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    count: 28,
    icon: 'Home',
  },
  {
    id: '2',
    title: 'Naamkaran',
    description: 'Naming ceremony for newborns',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop',
    count: 15,
    icon: 'Baby',
  },
  {
    id: '3',
    title: 'Vivaah Sanskar',
    description: 'Traditional Hindu wedding rituals',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
    count: 42,
    icon: 'Heart',
  },
  {
    id: '4',
    title: 'Satyanarayan Katha',
    description: 'Sacred ritual dedicated to Lord Vishnu',
    imageUrl: 'https://images.unsplash.com/photo-1604423481263-992cb2a21ca4?q=80&w=2070&auto=format&fit=crop',
    count: 36,
    icon: 'BookOpen',
  },
  {
    id: '5',
    title: 'Shraddha & Tarpan',
    description: 'Honouring ancestors through sacred rituals',
    imageUrl: 'https://images.unsplash.com/photo-1518459384564-d1f5ebb4b4f1?q=80&w=2070&auto=format&fit=crop',
    count: 18,
    icon: 'Flame',
  },
  {
    id: '6',
    title: 'Virtual Puja',
    description: 'Attend pujas virtually from anywhere',
    imageUrl: 'https://images.unsplash.com/photo-1515942661900-94b3d1972591?q=80&w=2070&auto=format&fit=crop',
    count: 22,
    icon: 'Video',
  },
  {
    id: '7',
    title: 'Yoga & Meditation',
    description: 'Online and in-person yoga sessions',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2076&auto=format&fit=crop',
    count: 35,
    icon: 'Lotus',
  },
  {
    id: '8',
    title: 'Astrology',
    description: 'Vedic astrology and horoscope consultations',
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop',
    count: 24,
    icon: 'Star',
  },
  {
    id: '9',
    title: 'Vastu Shastra',
    description: 'Vastu consultation for home and office',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    count: 16,
    icon: 'Building',
  },
  {
    id: '10',
    title: 'Janam Kundli',
    description: 'Birth chart and horoscope matching',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop',
    count: 30,
    icon: 'Scroll',
  },
  {
    id: '11',
    title: 'Ganesh Puja',
    description: 'Lord Ganesha worship for new beginnings',
    imageUrl: 'https://images.unsplash.com/photo-1599694364868-a6c919a55a4c?q=80&w=1974&auto=format&fit=crop',
    count: 20,
    icon: 'Elephant',
  },
  {
    id: '12',
    title: 'Diwali Puja',
    description: 'Festival of lights puja and decorations',
    imageUrl: 'https://images.unsplash.com/photo-1606685262894-96ff5ec0f51d?q=80&w=1974&auto=format&fit=crop',
    count: 25,
    icon: 'Lamp',
  },
  {
    id: '13',
    title: 'Mundan Ceremony',
    description: 'First haircut ritual for children',
    imageUrl: 'https://images.unsplash.com/photo-1596908836088-aadea0c855a5?q=80&w=2070&auto=format&fit=crop',
    count: 12,
    icon: 'Scissors',
  },
  {
    id: '14',
    title: 'Thread Ceremony',
    description: 'Upanayanam sacred thread ritual',
    imageUrl: 'https://images.unsplash.com/photo-1604423481263-992cb2a21ca4?q=80&w=2070&auto=format&fit=crop',
    count: 10,
    icon: 'Thread',
  },
  {
    id: '15',
    title: 'Buddhist Puja',
    description: 'Meditation and peace ceremonies',
    imageUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=2073&auto=format&fit=crop',
    count: 18,
    icon: 'Buddha',
  },
  {
    id: '16',
    title: 'Spiritual Healing',
    description: 'Energy healing and wellness rituals',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2076&auto=format&fit=crop',
    count: 22,
    icon: 'Sparkles',
  },
];
