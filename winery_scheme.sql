/*
# Create winery e-commerce schema

1. New Tables
- `products`: Wine bottles and accessories (coolers, openers). Columns: id, name, category (red/white/accessory), price, description, image_url, stock, featured.
- `blog_posts`: Winery blog articles. Columns: id, title, excerpt, content, image_url, author, created_at.
- `contact_messages`: Submissions from the Contact Us page. Columns: id, name, email, subject, message, created_at.
- `orders`: Checkout submissions. Columns: id, username, email, first_name, last_name, gender, street, suburb, postcode, state, phone, cart_items (jsonb), total, created_at.

2. Security
- RLS enabled on all tables.
- All tables allow anon + authenticated CRUD because this is a public storefront with no sign-in (single-tenant).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('red', 'white', 'accessory')),
  price numeric(10,2) NOT NULL,
  description text NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  author text NOT NULL DEFAULT 'Devon Valley Winery',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_blog_posts" ON blog_posts;
CREATE POLICY "anon_select_blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_blog_posts" ON blog_posts;
CREATE POLICY "anon_insert_blog_posts" ON blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_blog_posts" ON blog_posts;
CREATE POLICY "anon_update_blog_posts" ON blog_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_blog_posts" ON blog_posts;
CREATE POLICY "anon_delete_blog_posts" ON blog_posts FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages" ON contact_messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_contact_messages" ON contact_messages;
CREATE POLICY "anon_update_contact_messages" ON contact_messages FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contact_messages" ON contact_messages;
CREATE POLICY "anon_delete_contact_messages" ON contact_messages FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text NOT NULL,
  street text NOT NULL,
  suburb text NOT NULL,
  postcode text NOT NULL,
  state text NOT NULL,
  phone text NOT NULL,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);
