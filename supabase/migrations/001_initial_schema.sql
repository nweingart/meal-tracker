-- user_profile
create table user_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users unique not null,
  gender text,
  age int,
  height_inches int,
  weight_lbs numeric,
  activity_level text,
  diet_plan text,
  calorie_target int,
  protein_target_g int,
  carbs_target_g int,
  fat_target_g int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- food_library
create table food_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  serving_unit text not null,
  calories_per_serving numeric not null,
  protein_per_serving numeric not null,
  carbs_per_serving numeric not null,
  fat_per_serving numeric not null,
  times_used int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- meal_log
create table meal_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  food_library_id uuid references food_library not null,
  servings numeric not null,
  logged_at date not null default current_date,
  created_at timestamptz default now()
);

-- indexes
create index idx_meal_log_user_date on meal_log(user_id, logged_at);
create index idx_food_library_user on food_library(user_id);

-- RLS policies
alter table user_profile enable row level security;
alter table food_library enable row level security;
alter table meal_log enable row level security;

create policy "Users can manage own profile" on user_profile
  for all using (auth.uid() = user_id);

create policy "Users can manage own foods" on food_library
  for all using (auth.uid() = user_id);

create policy "Users can manage own logs" on meal_log
  for all using (auth.uid() = user_id);
