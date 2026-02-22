export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  subcategory?: string;
  tags: string[];
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  details?: {
    weight?: string;
    dimensions?: string;
    material?: string;
    contents?: string[];
    instructions?: string;
  };
  deliveryInfo?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export const productCategories: ProductCategory[] = [
  {
    id: 'puja-kits',
    name: 'Puja Kits',
    description: 'Complete kits for various pujas and rituals',
    image: 'https://images.unsplash.com/photo-1621866908556-4f0a830707c9?q=80&w=500',
    featured: true,
  },
  {
    id: 'ritual-items',
    name: 'Ritual Items',
    description: 'Individual items for rituals and ceremonies',
    image: 'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500',
    featured: true,
  },
  {
    id: 'festival-essentials',
    name: 'Festival Essentials',
    description: 'Everything you need for major festivals',
    image: 'https://images.unsplash.com/photo-1604423481263-4cbc0c119d2d?q=80&w=500',
    featured: true,
  },
  {
    id: 'digital-items',
    name: 'Digital Items',
    description: 'E-books, audio chants, and digital content',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=500',
  },
  {
    id: 'subscriptions',
    name: 'Subscriptions',
    description: 'Monthly pooja essentials delivered to your door',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=500',
  },
  {
    id: 'gifts',
    name: 'Spiritual Gifts',
    description: 'Meaningful gifts for special occasions',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500',
  },
];

export const occasions = [
  {
    id: 'griha-pravesh',
    name: 'Griha Pravesh',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500',
  },
  {
    id: 'satyanarayan',
    name: 'Satyanarayan Puja',
    image: 'https://images.unsplash.com/photo-1621866908556-4f0a830707c9?q=80&w=500',
  },
  {
    id: 'diwali',
    name: 'Diwali',
    image: 'https://images.unsplash.com/photo-1604423481263-4cbc0c119d2d?q=80&w=500',
  },
  {
    id: 'navratri',
    name: 'Navratri',
    image: 'https://images.unsplash.com/photo-1631083570642-b1ef0ba5bc0e?q=80&w=500',
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Lakshmi Puja Kit',
    description: 'Complete kit for Lakshmi Puja during Diwali with all essential items',
    price: 1299,
    discountedPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1621866908556-4f0a830707c9?q=80&w=500',
      'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500',
    ],
    rating: 4.8,
    reviewCount: 124,
    category: 'puja-kits',
    tags: ['diwali', 'lakshmi', 'puja kit'],
    stock: 50,
    featured: true,
    details: {
      weight: '1.5 kg',
      contents: ['Brass Lakshmi idol', 'Brass Ganesh idol', 'Brass diya set', 'Incense sticks', 'Kumkum & Haldi', 'Cotton wicks', 'Ghee container', 'Puja instructions'],
      instructions: 'Store in a cool, dry place.',
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '2',
    name: 'Brass Puja Thali Set',
    description: 'Traditional brass thali set with all essential items for daily puja',
    price: 2499,
    discountedPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500',
    ],
    rating: 4.7,
    reviewCount: 89,
    category: 'ritual-items',
    tags: ['thali', 'brass', 'daily puja'],
    stock: 35,
    featured: true,
    details: {
      weight: '1.2 kg',
      material: 'Pure brass',
      contents: ['Brass thali', 'Brass diya', 'Brass kalash', 'Brass bell', 'Brass incense holder'],
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '3',
    name: 'Satyanarayan Puja Kit',
    description: 'Complete kit for Satyanarayan Puja with all required items and instructions',
    price: 1599,
    discountedPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1621866908556-4f0a830707c9?q=80&w=500',
    ],
    rating: 4.9,
    reviewCount: 156,
    category: 'puja-kits',
    tags: ['satyanarayan', 'puja kit', 'vishnu'],
    stock: 25,
    featured: true,
    details: {
      weight: '2 kg',
      contents: ['Brass Vishnu idol', 'Katha book', 'Brass kalash', 'Diya set', 'Incense sticks'],
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '4',
    name: 'Premium Rudraksha Mala',
    description: '108 beads Rudraksha mala with silver caps, certified and blessed',
    price: 3999,
    images: [
      'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500',
    ],
    rating: 4.8,
    reviewCount: 67,
    category: 'ritual-items',
    tags: ['rudraksha', 'mala', 'shiva'],
    stock: 15,
    details: {
      material: 'Natural Rudraksha with silver caps',
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '5',
    name: 'Diwali Decoration Set',
    description: 'Complete decoration set for Diwali including diyas, lights, and rangoli stencils',
    price: 1499,
    discountedPrice: 1199,
    images: [
      'https://images.unsplash.com/photo-1604423481263-4cbc0c119d2d?q=80&w=500',
    ],
    rating: 4.6,
    reviewCount: 112,
    category: 'festival-essentials',
    tags: ['diwali', 'decoration', 'festival'],
    stock: 40,
    isNew: true,
    details: {
      contents: ['Clay diyas (12)', 'LED string lights', 'Rangoli stencils (5)', 'Rangoli colors (5)', 'Door toran'],
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '6',
    name: 'Vedic Chants Audio Collection',
    description: 'Digital collection of authentic Vedic chants performed by renowned scholars',
    price: 499,
    images: [
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=500',
    ],
    rating: 4.9,
    reviewCount: 78,
    category: 'digital-items',
    tags: ['digital', 'audio', 'vedic', 'chants'],
    stock: 999,
    deliveryInfo: 'Instant digital delivery',
  },
  {
    id: '7',
    name: 'Monthly Puja Essentials Box',
    description: 'Monthly subscription box with fresh puja essentials delivered to your doorstep',
    price: 799,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=500',
    ],
    rating: 4.7,
    reviewCount: 45,
    category: 'subscriptions',
    tags: ['subscription', 'monthly', 'essentials'],
    stock: 100,
    deliveryInfo: 'Monthly delivery on the 1st',
  },
  {
    id: '8',
    name: 'Copper Kalash with Coconut',
    description: 'Pure copper kalash with decorative design, perfect for all pujas',
    price: 1299,
    discountedPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500',
    ],
    rating: 4.8,
    reviewCount: 92,
    category: 'ritual-items',
    tags: ['kalash', 'copper', 'puja'],
    stock: 30,
    details: {
      weight: '500g',
      dimensions: '6 inches height, 4 inches diameter',
      material: 'Pure copper',
    },
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '9',
    name: 'Griha Pravesh Complete Kit',
    description: 'Everything needed for Griha Pravesh ceremony in a new home',
    price: 3999,
    discountedPrice: 3499,
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500',
    ],
    rating: 4.9,
    reviewCount: 67,
    category: 'puja-kits',
    tags: ['griha pravesh', 'new home', 'housewarming'],
    stock: 20,
    featured: true,
    deliveryInfo: 'Delivery within 3-5 business days',
  },
  {
    id: '10',
    name: 'Navratri Special Kit',
    description: 'Complete kit for celebrating all nine days of Navratri',
    price: 2499,
    discountedPrice: 1999,
    images: [
      'https://images.unsplash.com/photo-1631083570642-b1ef0ba5bc0e?q=80&w=500',
    ],
    rating: 4.7,
    reviewCount: 83,
    category: 'festival-essentials',
    tags: ['navratri', 'durga', 'festival'],
    stock: 35,
    isNew: true,
    deliveryInfo: 'Delivery within 3-5 business days',
  },
];

export const featuredProducts = products.filter(product => product.featured);
export const newArrivals = products.filter(product => product.isNew);
