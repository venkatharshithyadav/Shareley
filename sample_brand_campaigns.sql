-- Sample Brand Campaigns Data
-- Run this in your Supabase SQL Editor to populate the brand_campaigns table

-- PUMA Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('PUMA', 'Streetwear Sneakers', 'Latest collection of PUMA sneakers with exclusive discounts', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 77, NOW() + INTERVAL '7 days', 'Shoes', true);

-- Nike Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Nike', 'Performance Collection', 'Premium athletic wear and footwear for champions', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 65, NOW() + INTERVAL '5 days', 'Sports', true);

-- Adidas Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Adidas', 'Classic Sportswear', 'Iconic three stripes collection with modern designs', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800', 70, NOW() + INTERVAL '10 days', 'Sports', true);

-- Armani Exchange Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Armani', 'EA7 Collection', 'Luxury sportswear meets Italian elegance', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', 77, NOW() + INTERVAL '3 days', 'Designer', true);

-- Lacoste Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Lacoste', 'Sporty Outfits', 'Timeless French elegance with the iconic crocodile', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800', 76, NOW() + INTERVAL '2 days', 'Casual', true);

-- Zara Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Zara', 'Almost Gone: Classic Looks', 'Minimalist fashion for the modern wardrobe', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 60, NOW() + INTERVAL '1 day', 'Casual', true);

-- H&M Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('H&M', 'Premium Sneakers Collection', 'Sustainable fashion at affordable prices', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 55, NOW() + INTERVAL '14 days', 'Shoes', true);

-- Uniqlo Campaign
INSERT INTO brand_campaigns (brand_name, campaign_title, description, image_url, discount_percentage, end_date, category, is_active)
VALUES 
('Uniqlo', 'Classic Favorite Brands', 'Japanese quality meets everyday comfort', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', 50, NOW() + INTERVAL '6 days', 'Casual', true);
