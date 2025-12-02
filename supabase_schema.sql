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
