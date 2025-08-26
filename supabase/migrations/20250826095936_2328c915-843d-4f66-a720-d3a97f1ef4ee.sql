-- Create crew members table
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guide', 'driver', 'assistant')),
  email TEXT,
  phone TEXT,
  passport_number TEXT,
  visa_status TEXT,
  emergency_contact TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_code TEXT NOT NULL UNIQUE,
  tour_name TEXT NOT NULL,
  date_start DATE,
  date_end DATE,
  passenger_count INTEGER,
  guide_id UUID REFERENCES public.crew_members(id),
  driver_id UUID REFERENCES public.crew_members(id),
  truck_name TEXT,
  tour_leader TEXT,
  tour_type TEXT CHECK (tour_type IN ('camping', 'camping_accommodated', 'accommodated')),
  vehicle_name TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comprehensive feedback table
CREATE TABLE public.comprehensive_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  client_nationality TEXT,
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  guide_rating INTEGER CHECK (guide_rating >= 1 AND guide_rating <= 5),
  driver_rating INTEGER CHECK (driver_rating >= 1 AND driver_rating <= 5),
  vehicle_rating INTEGER CHECK (vehicle_rating >= 1 AND vehicle_rating <= 5),
  accommodation_rating INTEGER CHECK (accommodation_rating >= 1 AND accommodation_rating <= 5),
  food_rating INTEGER CHECK (food_rating >= 1 AND food_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  highlights TEXT,
  improvements TEXT,
  additional_comments TEXT,
  would_recommend BOOLEAN,
  likely_to_return BOOLEAN,
  tour_expectations_met BOOLEAN,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehensive_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an internal management system)
CREATE POLICY "Allow all operations on crew_members" ON public.crew_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tours" ON public.tours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on comprehensive_feedback" ON public.comprehensive_feedback FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_crew_members_updated_at
  BEFORE UPDATE ON public.crew_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_tours_tour_code ON public.tours(tour_code);
CREATE INDEX idx_comprehensive_feedback_tour_id ON public.comprehensive_feedback(tour_id);
CREATE INDEX idx_crew_members_role ON public.crew_members(role);
CREATE INDEX idx_tours_status ON public.tours(status);