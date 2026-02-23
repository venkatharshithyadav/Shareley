# Campaign Products Feature - Complete Guide

## What's New?

Brands can now create campaigns and add multiple products to each campaign!

## Setup Steps

### 1. Run Database Migration

In Supabase SQL Editor, run:

```sql
-- Add campaign_id to listings table
ALTER TABLE listings ADD COLUMN campaign_id uuid REFERENCES brand_campaigns(id);

-- Create index for performance
CREATE INDEX idx_listings_campaign_id ON listings(campaign_id);
```

### 2. How It Works

#### For Brand Users:

1. **Create a Campaign**
   - Click "Create Campaign" in navbar
   - Upload campaign banner image
   - Fill in campaign details
   - Submit

2. **Add Products to Campaign**
   - Go to your Profile
   - Click on a campaign card
   - Click "Add Product" button
   - OR go to "Add Listing" and select campaign from dropdown
   - Fill in product details
   - Product is now part of the campaign!

3. **View Campaign Products**
   - Click any campaign card
   - See all products in that campaign
   - Users can browse and purchase

#### For Regular Users:

1. **Browse Campaigns**
   - Go to home page
   - See "Shop by Brand" section
   - Click any brand campaign

2. **View Products**
   - See all products in that campaign
   - Click product to view details
   - Purchase/rent/borrow as usual

## Features

### Campaign Detail Page (`/campaign/:id`)
- Shows campaign banner and info
- Lists all products in the campaign
- "Add Product" button for campaign owners
- Empty state if no products

### Add Listing Page
- Campaign dropdown for brand users
- Pre-selected if coming from campaign page
- Can add to campaign or create regular listing

### Profile Page
- Shows brand's campaigns
- Click campaign to manage products
- See product count per campaign

## User Flow Example

### Brand "PUMA" Creates Summer Sale:

1. PUMA logs in
2. Clicks "Create Campaign"
3. Uploads summer sale banner
4. Fills in: "Summer Sale 2024", 50% discount
5. Campaign appears on home page

6. PUMA clicks their campaign
7. Clicks "Add Product"
8. Adds "Running Shoes - Red" with images
9. Adds "Sports T-Shirt - Blue" with images
10. Campaign now shows 2 products

### User Browses:

1. User sees "PUMA - Summer Sale" on home page
2. Clicks the campaign
3. Sees 2 products with 50% discount
4. Clicks "Running Shoes"
5. Views details and purchases

## Database Structure

```
brand_campaigns
├── id
├── user_id (brand owner)
├── brand_name
├── campaign_title
├── image_url (banner)
└── ...

listings
├── id
├── user_id
├── campaign_id (NEW! links to campaign)
├── title
├── images
└── ...
```

## Next Steps

1. Run the SQL migration above
2. Create a campaign
3. Add products to it
4. Test the flow!

## Troubleshooting

**Campaign not showing?**
- Check if `brand_campaigns` table exists
- Verify campaign has `is_active = true`

**Can't add products?**
- Run the SQL migration
- Check if `campaign_id` column exists in `listings` table

**Products not showing in campaign?**
- Verify product has correct `campaign_id`
- Check product status is 'active'
