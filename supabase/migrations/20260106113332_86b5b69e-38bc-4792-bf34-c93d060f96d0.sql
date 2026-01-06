-- Add tour completion tracking to both profile tables
ALTER TABLE public.children_profiles 
ADD COLUMN IF NOT EXISTS has_completed_tour boolean DEFAULT false;

ALTER TABLE public.carer_profiles 
ADD COLUMN IF NOT EXISTS has_completed_tour boolean DEFAULT false;