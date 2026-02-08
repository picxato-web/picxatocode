/*
  # Design Assets Platform Schema

  ## Overview
  This migration creates the foundational schema for a design assets downloading platform,
  similar to Pexels/Pixato, with support for multiple asset types.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, unique, not null) - Category name (e.g., "PNG Images", "Icons")
  - `slug` (text, unique, not null) - URL-friendly version of name
  - `description` (text) - Category description
  - `icon` (text) - Icon name from lucide-react
  - `display_order` (integer) - Order to display categories
  - `created_at` (timestamptz) - Timestamp of creation

  ### `assets`
  - `id` (uuid, primary key) - Unique identifier for each asset
  - `title` (text, not null) - Asset title
  - `description` (text) - Asset description
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `file_url` (text, not null) - URL to the asset file
  - `thumbnail_url` (text, not null) - URL to thumbnail/preview image
  - `file_type` (text) - File extension/type (png, jpg, svg, mp4, etc.)
  - `file_size` (integer) - File size in bytes
  - `width` (integer) - Asset width (for images/videos)
  - `height` (integer) - Asset height (for images/videos)
  - `downloads_count` (integer) - Number of times downloaded
  - `views_count` (integer) - Number of times viewed
  - `tags` (text[]) - Array of tags for search
  - `is_featured` (boolean) - Whether asset is featured
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  ### `downloads`
  - `id` (uuid, primary key) - Unique identifier for each download
  - `asset_id` (uuid, foreign key) - Reference to assets table
  - `downloaded_at` (timestamptz) - Timestamp of download
  - `ip_address` (text) - IP address of downloader (for analytics)

  ## Security
  - Enable RLS on all tables
  - Public read access for categories and assets (anyone can browse)
  - Restricted write access (only authenticated users can modify)
  - Downloads table tracks download events

  ## Indexes
  - Index on category_id for faster asset queries
  - Index on tags for search functionality
  - Index on created_at for sorting by latest uploads
  - Index on downloads_count for trending sorting
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text DEFAULT 'Folder',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  thumbnail_url text NOT NULL,
  file_type text,
  file_size integer DEFAULT 0,
  width integer,
  height integer,
  downloads_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid REFERENCES assets(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  ip_address text
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_category_id ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_tags ON assets USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assets_downloads_count ON assets(downloads_count DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_asset_id ON downloads(asset_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read access)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for assets (public read access)
CREATE POLICY "Anyone can view assets"
  ON assets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for downloads (public insert for tracking, restricted read)
CREATE POLICY "Anyone can create download records"
  ON downloads FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view downloads"
  ON downloads FOR SELECT
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
  ('PNG Images', 'png-images', 'High-quality PNG images with transparent backgrounds', 'Image', 1),
  ('Icons', 'icons', 'Stunning icon packs for your design projects', 'Sparkles', 2),
  ('Background Images', 'background-images', 'Beautiful background images for websites and apps', 'Wallpaper', 3),
  ('Sound Effects', 'sound-effects', 'Professional sound effects for videos and games', 'Volume2', 4),
  ('Videos', 'videos', 'High-quality stock videos and animations', 'Video', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample assets (using Pexels stock photos)
INSERT INTO assets (title, description, category_id, file_url, thumbnail_url, file_type, tags, is_featured) VALUES
  ('Business Professional', 'Professional business person on transparent background', (SELECT id FROM categories WHERE slug = 'png-images'), 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 'png', ARRAY['business', 'professional', 'person', 'transparent'], true),
  ('Abstract Pattern', 'Modern abstract geometric pattern', (SELECT id FROM categories WHERE slug = 'background-images'), 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg', 'https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=400', 'jpg', ARRAY['abstract', 'pattern', 'geometric', 'modern'], true),
  ('Minimal Icon Set', 'Clean and minimal icon collection', (SELECT id FROM categories WHERE slug = 'icons'), 'https://images.pexels.com/photos/1089842/pexels-photo-1089842.jpeg', 'https://images.pexels.com/photos/1089842/pexels-photo-1089842.jpeg?auto=compress&cs=tinysrgb&w=400', 'svg', ARRAY['icons', 'minimal', 'clean', 'ui'], false),
  ('Mountain Landscape', 'Breathtaking mountain landscape background', (SELECT id FROM categories WHERE slug = 'background-images'), 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg', 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg?auto=compress&cs=tinysrgb&w=400', 'jpg', ARRAY['nature', 'mountain', 'landscape', 'scenic'], true),
  ('Customer Service', 'Friendly customer service representative', (SELECT id FROM categories WHERE slug = 'png-images'), 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400', 'png', ARRAY['customer', 'service', 'support', 'headset'], false),
  ('Ocean Waves', 'Calming ocean waves background', (SELECT id FROM categories WHERE slug = 'background-images'), 'https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg', 'https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?auto=compress&cs=tinysrgb&w=400', 'jpg', ARRAY['ocean', 'waves', 'water', 'nature'], false),
  ('Creative Designer', 'Creative designer working on projects', (SELECT id FROM categories WHERE slug = 'png-images'), 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400', 'png', ARRAY['designer', 'creative', 'artist', 'work'], true),
  ('Gradient Background', 'Smooth gradient background pack', (SELECT id FROM categories WHERE slug = 'background-images'), 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.png', 'https://images.pexels.com/photos/2693529/pexels-photo-2693529.png?auto=compress&cs=tinysrgb&w=400', 'jpg', ARRAY['gradient', 'smooth', 'modern', 'colorful'], false),
  ('Business Team', 'Diverse business team collaboration', (SELECT id FROM categories WHERE slug = 'png-images'), 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg', 'https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=400', 'png', ARRAY['team', 'business', 'collaboration', 'group'], false),
  ('Urban Cityscape', 'Modern urban cityscape at night', (SELECT id FROM categories WHERE slug = 'background-images'), 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg', 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400', 'jpg', ARRAY['city', 'urban', 'night', 'skyline'], true)
ON CONFLICT DO NOTHING;