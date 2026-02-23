# Shareley - Brand Campaign Setup Guide

## Issue: Brand campaigns and logos not showing

### Step 1: Setup Supabase Storage (REQUIRED)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the contents of `setup_storage.sql` file
6. Click **Run** or press `Cmd+Enter`

This will:
- Create the `listing-images` storage bucket
- Set up proper permissions for uploads
- Allow public read access

### Step 2: Verify Storage Bucket

1. In Supabase Dashboard, click **Storage** in left sidebar
2. You should see `listing-images` bucket
3. Click on it and verify it's marked as **Public**

### Step 3: Upload Profile Picture

1. Go to http://localhost:5173/profile
2. Hover over your avatar circle
3. Click the camera icon
4. Select an image
5. Wait for "Profile picture updated! Refreshing..." message
6. Page will reload with your new avatar

### Step 4: Create a Brand Campaign

1. Click "Create Campaign" in the navbar
2. Upload a campaign image (e.g., product photo)
3. Fill in:
   - Campaign Title: "Push Summer Collection"
   - Description: "Latest summer fashion"
   - Category: Select one
   - Discount: e.g., 50
   - End Date: Select a future date
4. Click "Create Campaign"
5. You'll be redirected to your profile

### Step 5: View Your Campaign

Your campaign should now appear in:
1. **Profile page** - Under "My Brand Campaigns"
2. **Home page** - In the "Shop by Brand" section
3. **With your logo** - The brand logo (your avatar) will show on the campaign card

### Step 6: Test Brand Filtering

1. Go to home page
2. Click on your brand campaign card
3. You'll be taken to marketplace filtered by your brand
4. If you haven't created any listings, it will show empty state

## Troubleshooting

### Avatar not uploading?
- Check browser console (F12) for errors
- Verify storage bucket exists in Supabase
- Make sure you're logged in

### Campaign not showing on home page?
- Refresh the page
- Check if campaign was created successfully in Profile
- Verify campaign is marked as "active" in Supabase database

### Brand logo not showing on campaign card?
- Make sure you uploaded a profile picture first
- The logo comes from your user avatar
- Refresh the page after uploading avatar

## Database Check

To verify campaigns in Supabase:
1. Go to **Table Editor** → **brand_campaigns**
2. You should see your campaign with:
   - user_id: Your user ID
   - brand_name: "Push"
   - is_active: true
   - image_url: URL to your campaign image

## Need Help?

If campaigns still don't show:
1. Open browser console (F12)
2. Go to home page
3. Look for any errors
4. Check the Network tab for failed requests
5. Share the error messages
