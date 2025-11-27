# Supabase Setup Guide for HomeFlow

This document contains the SQL commands required to set up the backend for the HomeFlow application. Run these commands in the **SQL Editor** of your Supabase dashboard.

## 1. Profiles Table
Create a public profile table that links to the private `auth.users` table.

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  email text,

  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 2. Projects Table
Stores information about home renovation projects.

```sql
-- Create Enum for Project Status
create type project_status as enum ('Planning', 'Permitting', 'Construction', 'Completed');

-- Create Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  name text not null,
  address text,
  status project_status default 'Planning',
  progress integer default 0 check (progress >= 0 and progress <= 100)
);

-- Enable RLS
alter table projects enable row level security;

-- Policies
create policy "Users can view their own projects"
  on projects for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own projects"
  on projects for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own projects"
  on projects for update
  using ( auth.uid() = user_id );
```

## 3. Tasks Table
To-do items for each project.

```sql
create table tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects on delete cascade not null,
  title text not null,
  due_date date,
  completed boolean default false
);

alter table tasks enable row level security;

create policy "Users can view tasks for their projects"
  on tasks for select
  using ( 
    exists ( 
      select 1 from projects 
      where projects.id = tasks.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );

create policy "Users can insert tasks for their projects"
  on tasks for insert
  with check ( 
    exists ( 
      select 1 from projects 
      where projects.id = tasks.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );

create policy "Users can update tasks for their projects"
  on tasks for update
  using ( 
    exists ( 
      select 1 from projects 
      where projects.id = tasks.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );
```

## 4. Milestones Table
Key project milestones.

```sql
create type milestone_status as enum ('Paid', 'Due Soon', 'Upcoming', 'Approval Needed', 'Completed', 'Pending');

create table milestones (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects on delete cascade not null,
  title text not null,
  date date,
  amount numeric,
  status milestone_status default 'Upcoming'
);

alter table milestones enable row level security;

create policy "Users can view milestones for their projects"
  on milestones for select
  using ( 
    exists ( 
      select 1 from projects 
      where projects.id = milestones.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );

create policy "Users can insert milestones for their projects"
  on milestones for insert
  with check ( 
    exists ( 
      select 1 from projects 
      where projects.id = milestones.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );
```

## 5. Contractors Directory
A public directory of contractors.

```sql
create table contractors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  role text not null,
  rating numeric default 0,
  reviews integer default 0,
  image text,
  verified boolean default false,
  specialist boolean default false,
  licensed boolean default false
);

alter table contractors enable row level security;

-- Everyone can view contractors
create policy "Contractors are viewable by everyone"
  on contractors for select
  using ( true );

-- Only admins (service role) can insert/update (implied by no policy for insert/update for auth.uid())
```

## 6. Project Team
Links contractors to specific projects.

```sql
create table project_team (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references projects on delete cascade not null,
  contractor_id uuid references contractors on delete cascade not null,
  role text -- Optional override for their role on this specific project
);

alter table project_team enable row level security;

create policy "Users can view their project team"
  on project_team for select
  using ( 
    exists ( 
      select 1 from projects 
      where projects.id = project_team.project_id 
      and projects.user_id = auth.uid() 
    ) 
  );
```