-- PujariSewa Supabase Migration
-- Run this in your Supabase SQL Editor (supabase.com > your project > SQL Editor)

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'pandit', 'admin')),
  provider TEXT DEFAULT 'email',
  google_id TEXT,
  bio TEXT,
  location TEXT,
  languages TEXT[],
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pandits
CREATE TABLE IF NOT EXISTS public.pandits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialization TEXT,
  about TEXT,
  location TEXT,
  image_url TEXT,
  languages TEXT[],
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  experience INTEGER DEFAULT 0,
  category_ids TEXT[],
  services TEXT[],
  user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  duration INTEGER DEFAULT 0,
  location TEXT,
  image_url TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  pandit_id UUID REFERENCES public.pandits(id),
  category_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discounted_price NUMERIC,
  images TEXT[],
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  details JSONB,
  delivery_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Categories
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  pandit_id TEXT NOT NULL,
  pandit_name TEXT NOT NULL,
  pandit_image_url TEXT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  location TEXT,
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  address JSONB NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_id TEXT,
  estimated_delivery TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies: Allow service role full access (used by backend)
CREATE POLICY "Service role full access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.pandits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.product_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Seed Categories
INSERT INTO public.categories (id, title, description, image_url, count) VALUES
  (gen_random_uuid(), 'Home Ceremonies', 'Rituals for blessing and purifying homes', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop', 8),
  (gen_random_uuid(), 'Child Ceremonies', 'Rituals for children including naming and first haircut', 'https://images.unsplash.com/photo-1555050455-f96634b5cba6?q=80&w=2033&auto=format&fit=crop', 6),
  (gen_random_uuid(), 'Wedding Ceremonies', 'Traditional Hindu wedding rituals', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop', 5),
  (gen_random_uuid(), 'Vastu & Consultation', 'Vastu analysis and remedies for homes and offices', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop', 3),
  (gen_random_uuid(), 'Astrology', 'Horoscope reading, matchmaking, and remedies', 'https://images.unsplash.com/photo-1515894274780-af6262f1fcc2?q=80&w=2070&auto=format&fit=crop', 4),
  (gen_random_uuid(), 'Festival Pujas', 'Special pujas for festivals like Diwali, Navratri', 'https://images.unsplash.com/photo-1600093112291-7b553e3fcb82?q=80&w=2070&auto=format&fit=crop', 7);

-- Seed Product Categories
INSERT INTO public.product_categories (id, name, description, image, featured) VALUES
  ('puja-kits', 'Puja Kits', 'Complete kits for various pujas and rituals', 'https://images.unsplash.com/photo-1621866908556-4f0a830707c9?q=80&w=500', true),
  ('ritual-items', 'Ritual Items', 'Individual items for rituals and ceremonies', 'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=500', true),
  ('festival-essentials', 'Festival Essentials', 'Everything you need for major festivals', 'https://images.unsplash.com/photo-1604423481263-4cbc0c119d2d?q=80&w=500', true),
  ('digital-items', 'Digital Items', 'E-books, audio chants, and digital content', 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=500', false),
  ('subscriptions', 'Subscriptions', 'Monthly pooja essentials delivered to your door', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=500', false),
  ('gifts', 'Spiritual Gifts', 'Meaningful gifts for special occasions', 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500', false);
