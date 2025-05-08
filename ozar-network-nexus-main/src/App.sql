
-- Add phone_number and first_name, last_name columns to profiles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone_number') THEN
        ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'first_name') THEN
        ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'last_name') THEN
        ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    -- Add price column to services table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'price') THEN
        ALTER TABLE public.services ADD COLUMN price NUMERIC DEFAULT 0;
    END IF;
END $$;
