export interface Package {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number | null;
  originalPrice?: number;
  duration?: string;
  tag?: string;
  categoryId: string;
}

export const packages: Package[] = [
  {
    id: '1',
    title: 'Griha Pravesh Combo',
    description: 'Complete package for new home blessing with all essential rituals and items',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    price: 7999,
    originalPrice: 9999,
    duration: '3-4 hours',
    tag: 'Best Seller',
    categoryId: '1',
  },
  {
    id: '2',
    title: 'Wedding Puja Package',
    description: 'Comprehensive 3-day service covering all pre and post-wedding rituals',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop',
    price: 15999,
    originalPrice: 18999,
    duration: '3 days',
    tag: 'Popular',
    categoryId: '3',
  },
  {
    id: '3',
    title: 'Monthly Puja Subscription',
    description: 'Regular monthly pujas performed at your home with all required items',
    imageUrl: 'https://images.unsplash.com/photo-1604423481263-992cb2a21ca4?q=80&w=1974&auto=format&fit=crop',
    price: 2499,
    duration: 'Monthly',
    tag: 'New',
    categoryId: '4',
  },
  {
    id: '4',
    title: 'Satyanarayan Katha',
    description: 'Complete arrangement for Satyanarayan Katha with all puja items and prasad',
    imageUrl: 'https://images.unsplash.com/photo-1621472124503-a760c1146f44?q=80&w=1974&auto=format&fit=crop',
    price: 5499,
    originalPrice: 6499,
    duration: '2-3 hours',
    categoryId: '4',
  },
  {
    id: '5',
    title: 'Custom Consultation',
    description: 'Personalized consultation with an expert pandit to address your specific needs',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop',
    price: null,
    duration: 'Varies',
    tag: 'Custom',
    categoryId: '5',
  },
];
