-- Create schemes table for storing welfare schemes with eligibility criteria
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scheme_name TEXT NOT NULL,
  scheme_name_hindi TEXT,
  scheme_name_kannada TEXT,
  sector TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Central', 'State', 'Both')),
  state TEXT,
  
  -- Eligibility criteria as separate columns for efficient querying
  min_age INTEGER,
  max_age INTEGER,
  max_income INTEGER,
  occupation TEXT[],
  gender TEXT CHECK (gender IN ('male', 'female', 'all', 'girl_child')),
  category TEXT[],
  education_level TEXT[],
  max_landholding_hectares NUMERIC,
  min_landholding_hectares NUMERIC,
  disability_required BOOLEAN DEFAULT false,
  marital_status TEXT[],
  
  -- Additional eligibility as JSONB for flexibility
  additional_eligibility JSONB DEFAULT '{}',
  
  -- Scheme details
  benefits TEXT NOT NULL,
  benefits_hindi TEXT,
  benefits_kannada TEXT,
  documents_required TEXT[] NOT NULL DEFAULT '{}',
  application_steps TEXT[] NOT NULL DEFAULT '{}',
  official_portal TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  priority_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (schemes are public data)
CREATE POLICY "Schemes are publicly readable" 
ON public.schemes 
FOR SELECT 
USING (true);

-- Create indexes for common queries
CREATE INDEX idx_schemes_sector ON public.schemes(sector);
CREATE INDEX idx_schemes_level ON public.schemes(level);
CREATE INDEX idx_schemes_state ON public.schemes(state);
CREATE INDEX idx_schemes_occupation ON public.schemes USING GIN(occupation);
CREATE INDEX idx_schemes_category ON public.schemes USING GIN(category);
CREATE INDEX idx_schemes_is_active ON public.schemes(is_active);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_schemes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_schemes_updated_at();

-- Insert popular schemes data
INSERT INTO public.schemes (
  scheme_name, scheme_name_hindi, sector, level, 
  min_age, max_age, max_income, occupation, gender, category, max_landholding_hectares,
  benefits, benefits_hindi, documents_required, application_steps, official_portal, priority_score
) VALUES 
(
  'PM-KISAN Samman Nidhi',
  'पीएम-किसान सम्मान निधि',
  'Agriculture',
  'Central',
  18, NULL, NULL,
  ARRAY['farmer'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  2,
  '₹6,000 per year in 3 installments of ₹2,000 each, directly to bank account',
  'प्रति वर्ष ₹6,000 तीन किस्तों में सीधे बैंक खाते में',
  ARRAY['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Account Details', 'Mobile Number'],
  ARRAY['Visit pmkisan.gov.in', 'Click on New Farmer Registration', 'Enter Aadhaar and State details', 'Fill land and bank details', 'Submit and note registration number'],
  'https://pmkisan.gov.in',
  100
),
(
  'PM Awas Yojana (Gramin)',
  'प्रधानमंत्री आवास योजना (ग्रामीण)',
  'Housing',
  'Central',
  NULL, NULL, 300000,
  ARRAY['farmer', 'laborer', 'unemployed', 'self-employed'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  '₹1.20 lakh in plain areas, ₹1.30 lakh in hilly areas for building pucca house',
  'मैदानी क्षेत्रों में ₹1.20 लाख, पहाड़ी क्षेत्रों में ₹1.30 लाख पक्का मकान बनाने के लिए',
  ARRAY['Aadhaar Card', 'Income Certificate', 'BPL Card (if available)', 'Land Documents', 'Bank Account'],
  ARRAY['Apply through Gram Panchayat', 'Verification by Block Development Officer', 'Approval and fund disbursement in installments'],
  'https://pmayg.nic.in',
  95
),
(
  'Ayushman Bharat (PM-JAY)',
  'आयुष्मान भारत (पीएम-जय)',
  'Health',
  'Central',
  NULL, NULL, 500000,
  ARRAY['farmer', 'laborer', 'unemployed', 'self-employed', 'student'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  '₹5 lakh health insurance per family per year for secondary and tertiary hospitalization',
  'प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा',
  ARRAY['Aadhaar Card', 'Ration Card', 'Income Certificate'],
  ARRAY['Check eligibility at mera.pmjay.gov.in', 'Visit nearest CSC or Ayushman Mitra', 'Get Ayushman Card generated', 'Use at empanelled hospitals'],
  'https://pmjay.gov.in',
  98
),
(
  'PM Ujjwala Yojana',
  'प्रधानमंत्री उज्ज्वला योजना',
  'Energy',
  'Central',
  18, NULL, NULL,
  ARRAY['farmer', 'laborer', 'unemployed', 'self-employed'],
  'female',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  'Free LPG connection with first refill and stove for BPL families',
  'बीपीएल परिवारों के लिए मुफ्त एलपीजी कनेक्शन, पहला रिफिल और स्टोव',
  ARRAY['Aadhaar Card', 'BPL Card or SECC-2011 listed', 'Bank Account', 'Passport Photo'],
  ARRAY['Visit nearest LPG distributor', 'Fill KYC form', 'Submit BPL proof', 'Receive connection within 7 days'],
  'https://www.pmuy.gov.in',
  90
),
(
  'Sukanya Samriddhi Yojana',
  'सुकन्या समृद्धि योजना',
  'Financial Inclusion',
  'Central',
  0, 10, NULL,
  ARRAY['farmer', 'laborer', 'unemployed', 'self-employed', 'student'],
  'girl_child',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  'High interest savings account (8.2%) for girl child education and marriage',
  'बालिका की शिक्षा और विवाह के लिए उच्च ब्याज बचत खाता (8.2%)',
  ARRAY['Birth Certificate of Girl Child', 'Parents Aadhaar & PAN', 'Address Proof', 'Passport Photos'],
  ARRAY['Visit any post office or authorized bank', 'Fill account opening form', 'Deposit minimum ₹250', 'Receive passbook'],
  'https://www.india.gov.in/sukanya-samriddhi-yojna',
  85
),
(
  'PM Kisan Maandhan Yojana',
  'पीएम किसान मानधन योजना',
  'Agriculture',
  'Central',
  18, 40, NULL,
  ARRAY['farmer'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  2,
  '₹3,000 monthly pension after age 60 for small farmers',
  '60 वर्ष की आयु के बाद छोटे किसानों को ₹3,000 मासिक पेंशन',
  ARRAY['Aadhaar Card', 'Land Records', 'Bank Account', 'Mobile Number'],
  ARRAY['Visit CSC center', 'Self-register at maandhan.in', 'Pay monthly contribution (₹55-200 based on age)', 'Receive pension from age 60'],
  'https://maandhan.in',
  80
),
(
  'National Scholarship Portal Schemes',
  'राष्ट्रीय छात्रवृत्ति पोर्टल योजनाएं',
  'Education',
  'Central',
  NULL, 35, 250000,
  ARRAY['student'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'Minority'],
  NULL,
  'Various scholarships from ₹1,000 to ₹50,000 per year for students',
  'छात्रों के लिए ₹1,000 से ₹50,000 प्रति वर्ष तक विभिन्न छात्रवृत्तियां',
  ARRAY['Aadhaar Card', 'Income Certificate', 'Caste Certificate', 'Previous Marksheets', 'Bank Account', 'Institute Verification'],
  ARRAY['Register at scholarships.gov.in', 'Complete profile and KYC', 'Apply for eligible scholarships', 'Upload documents', 'Institute verification', 'DBT to bank account'],
  'https://scholarships.gov.in',
  88
),
(
  'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee)',
  'मनरेगा',
  'Employment',
  'Central',
  18, NULL, NULL,
  ARRAY['farmer', 'laborer', 'unemployed'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  '100 days guaranteed wage employment per year at ₹200-300/day based on state',
  'प्रति वर्ष 100 दिन की गारंटीकृत मजदूरी रोजगार',
  ARRAY['Aadhaar Card', 'Job Card', 'Bank Account', 'Photo'],
  ARRAY['Apply at Gram Panchayat for Job Card', 'Request work in writing', 'Work must be provided within 15 days', 'Wages paid within 15 days of work'],
  'https://nrega.nic.in',
  92
),
(
  'Pradhan Mantri Fasal Bima Yojana',
  'प्रधानमंत्री फसल बीमा योजना',
  'Agriculture',
  'Central',
  NULL, NULL, NULL,
  ARRAY['farmer'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  'Crop insurance at low premium (2% Kharif, 1.5% Rabi) with full claim on crop loss',
  'कम प्रीमियम पर फसल बीमा (खरीफ 2%, रबी 1.5%)',
  ARRAY['Aadhaar Card', 'Land Records', 'Bank Account', 'Sowing Certificate'],
  ARRAY['Apply through bank or CSC before sowing deadline', 'Pay premium', 'Report crop loss within 72 hours', 'Claim settled after assessment'],
  'https://pmfby.gov.in',
  87
),
(
  'Atal Pension Yojana',
  'अटल पेंशन योजना',
  'Financial Inclusion',
  'Central',
  18, 40, NULL,
  ARRAY['farmer', 'laborer', 'unemployed', 'self-employed'],
  'all',
  ARRAY['SC', 'ST', 'OBC', 'General', 'Minority'],
  NULL,
  'Guaranteed pension of ₹1,000 to ₹5,000 per month after age 60',
  '60 वर्ष के बाद ₹1,000 से ₹5,000 प्रति माह गारंटीकृत पेंशन',
  ARRAY['Aadhaar Card', 'Bank Account', 'Mobile Number'],
  ARRAY['Visit bank branch with savings account', 'Fill APY registration form', 'Choose pension amount', 'Auto-debit from account monthly'],
  'https://npscra.nsdl.co.in/scheme-details.php',
  82
);