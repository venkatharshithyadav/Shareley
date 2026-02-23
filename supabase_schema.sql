-- Create a table for listings
create table listings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  user_name text not null,
  title text not null,
  description text not null,
  price numeric not null,
  type text not null check (type in ('sell', 'rent', 'lend', 'free')),
  category text not null,
  size text,
  condition text not null,
  images text[] default array[]::text[],
  location text not null,
  status text default 'active' check (status in ('active', 'sold', 'lent', 'rented', 'taken')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table listings enable row level security;

-- Create policies
-- Allow everyone to read listings
create policy "Listings are viewable by everyone"
  on listings for select
  using ( true );

-- Allow authenticated users to insert listings
create policy "Users can insert their own listings"
  on listings for insert
  with check ( auth.uid() = user_id );

-- Allow users to update their own listings
create policy "Users can update their own listings"
  on listings for update
  using ( auth.uid() = user_id );

-- Allow users to delete their own listings
create policy "Users can delete their own listings"
  on listings for delete
  using ( auth.uid() = user_id );

-- Add user type support (individual or company/brand)
-- This allows users to register as brands and create campaigns
alter table auth.users add column if not exists user_type text default 'individual';
alter table auth.users add column if not exists company_name text;
alter table auth.users add column if not exists is_verified_brand boolean default false;

-- Note: The above columns are stored in user_metadata in Supabase
-- We'll handle this through the signup process

-- Create a table for brand campaigns
create table brand_campaigns (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  brand_name text not null,
  campaign_title text not null,
  description text,
  image_url text not null,
  discount_percentage integer,
  end_date timestamp with time zone,
  category text not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for brand campaigns
alter table brand_campaigns enable row level security;

-- Allow everyone to read active campaigns
create policy "Active campaigns are viewable by everyone"
  on brand_campaigns for select
  using ( is_active = true );

-- Allow verified brands to create their own campaigns
create policy "Verified brands can create campaigns"
  on brand_campaigns for insert
  with check ( auth.uid() = user_id );

-- Allow brands to update their own campaigns
create policy "Brands can update own campaigns"
  on brand_campaigns for update
  using ( auth.uid() = user_id );

-- Allow brands to delete their own campaigns
create policy "Brands can delete own campaigns"
  on brand_campaigns for delete
  using ( auth.uid() = user_id );
