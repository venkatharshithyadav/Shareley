-- Conversations Table
create table if not exists conversations (
  id uuid default uuid_generate_v4() primary key,
  participant1_id uuid references auth.users not null,
  participant2_id uuid references auth.users not null,
  participant1_name text,
  participant2_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure uniqueness of participants pair (order matters or handles both ways)
-- For simplicity, let's assume we check for both combinations in application logic or enforce order
-- But a unique index is safer:
create unique index if not exists unique_participants_idx on conversations (
    least(participant1_id, participant2_id),
    greatest(participant1_id, participant2_id)
);


-- Messages Table
create table if not exists messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references conversations on delete cascade not null,
  sender_id uuid references auth.users not null,
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table conversations enable row level security;
alter table messages enable row level security;

-- Policies
create policy "Users can view their own conversations"
  on conversations for select
  using (auth.uid() = participant1_id or auth.uid() = participant2_id);

create policy "Users can insert conversations they are part of"
  on conversations for insert
  with check (auth.uid() = participant1_id or auth.uid() = participant2_id);

create policy "Users can view messages in their conversations"
  on messages for select
  using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.participant1_id = auth.uid() or conversations.participant2_id = auth.uid())
    )
  );

create policy "Users can insert messages in their conversations"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (conversations.participant1_id = auth.uid() or conversations.participant2_id = auth.uid())
    )
  );
