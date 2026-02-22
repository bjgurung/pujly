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
    description: 'Rituals and ceremonies for blessing and purifying homes',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    count: 28,
    icon: 'Home',
  },
  {
    id: '2',
    title: 'Naamkaran',
    description: 'Rituals for children including naming, first haircut, and more',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop',
    count: 15,
    icon: 'Baby',
  },
  {
    id: '3',
    title: 'Vivaah Sanskar',
    description: 'Traditional Hindu wedding rituals and pre-wedding ceremonies',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
    count: 42,
    icon: 'Heart',
  },
  {
    id: '4',
    title: 'Satyanarayan Katha',
    description: 'Sacred ritual dedicated to Lord Vishnu for prosperity',
    imageUrl: 'https://images.unsplash.com/photo-1604423481263-992cb2a21ca4?q=80&w=1974&auto=format&fit=crop',
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
    description: 'Attend pujas virtually from anywhere in the world',
    imageUrl: 'https://images.unsplash.com/photo-1515942661900-94b3d1972591?q=80&w=2070&auto=format&fit=crop',
    count: 22,
    icon: 'Video',
  },
];
