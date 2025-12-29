import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Scheme {
  id: string;
  scheme_name: string;
  scheme_name_hindi: string | null;
  sector: string;
  level: string;
  min_age: number | null;
  max_age: number | null;
  max_income: number | null;
  occupation: string[] | null;
  gender: string | null;
  category: string[] | null;
  max_landholding_hectares: number | null;
  benefits: string;
  benefits_hindi: string | null;
  documents_required: string[];
  application_steps: string[];
  official_portal: string | null;
  priority_score: number;
}

const BASE_SYSTEM_PROMPT = `You are JanSaathi (जनसाथी), an AI-powered Social Welfare Scheme Eligibility & Application Assistant for India.

🎯 YOUR MISSION:
- Identify Central & State Government welfare schemes citizens are eligible for
- Explain benefits clearly without legal jargon
- Guide application processes step-by-step
- Support English, Hindi, and Kannada languages

🧩 USER PROFILING:
From user input, extract: occupation, age, gender, education, income, category (SC/ST/OBC/General/Minority), landholding, disability, marital status, state/district.
If critical fields are missing, ask MINIMUM follow-up questions politely.

📌 RESPONSE FORMAT (For Each Eligible Scheme):
- **Scheme Name** (English + Hindi name if available)
- **Who Can Apply**: Brief eligibility
- **Benefits**: What you get
- **Documents Required**: List
- **How to Apply**: Step-by-step
- **Official Link**: URL

Use bullet points, simple sentences, no bureaucratic language.

🔐 PRIVACY RULES:
❌ NEVER ask for: Aadhaar numbers, OTPs, bank details, passwords
✅ Always suggest official portals or CSC centers
✅ State that eligibility is subject to government verification

🌐 VERIFIED DATA SOURCES:
- myScheme (https://www.myscheme.gov.in)
- PM-KISAN (https://pmkisan.gov.in)
- Ministry of Social Justice (https://socialjustice.gov.in)

LANGUAGE HANDLING:
- Detect and respond in the user's language (English/Hindi/Kannada)
- For Hindi: Use simple, everyday Hindi
- For Kannada: Use standard Kannada
- Mixed language (Hinglish) is acceptable

TONE: Warm, helpful, respectful. Think of yourself as a knowledgeable village elder who wants to help.

Always end responses with:
"Would you like me to explain any scheme in more detail, help with the application process, or suggest more schemes based on your profile?"`;

function formatSchemesForContext(schemes: Scheme[]): string {
  if (schemes.length === 0) return "";

  let context = "\n\n📋 AVAILABLE SCHEMES DATABASE (Use this for accurate matching):\n";
  
  schemes.forEach((scheme, index) => {
    context += `\n${index + 1}. ${scheme.scheme_name}`;
    if (scheme.scheme_name_hindi) context += ` (${scheme.scheme_name_hindi})`;
    context += `\n   Sector: ${scheme.sector} | Level: ${scheme.level}`;
    
    // Eligibility criteria
    const eligibility: string[] = [];
    if (scheme.min_age || scheme.max_age) {
      eligibility.push(`Age: ${scheme.min_age || 0}-${scheme.max_age || '∞'}`);
    }
    if (scheme.max_income) eligibility.push(`Max Income: ₹${scheme.max_income.toLocaleString()}`);
    if (scheme.occupation?.length) eligibility.push(`Occupation: ${scheme.occupation.join(', ')}`);
    if (scheme.gender && scheme.gender !== 'all') eligibility.push(`Gender: ${scheme.gender}`);
    if (scheme.category?.length) eligibility.push(`Category: ${scheme.category.join(', ')}`);
    if (scheme.max_landholding_hectares) eligibility.push(`Max Land: ${scheme.max_landholding_hectares} hectares`);
    
    if (eligibility.length > 0) {
      context += `\n   Eligibility: ${eligibility.join(' | ')}`;
    }
    
    context += `\n   Benefits: ${scheme.benefits}`;
    if (scheme.documents_required?.length) {
      context += `\n   Documents: ${scheme.documents_required.join(', ')}`;
    }
    if (scheme.application_steps?.length) {
      context += `\n   Steps: ${scheme.application_steps.join(' → ')}`;
    }
    if (scheme.official_portal) {
      context += `\n   Portal: ${scheme.official_portal}`;
    }
    context += '\n';
  });
  
  return context;
}

async function fetchSchemes(): Promise<Scheme[]> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    return [];
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from("schemes")
    .select("*")
    .eq("is_active", true)
    .order("priority_score", { ascending: false });
  
  if (error) {
    console.error("Error fetching schemes:", error);
    return [];
  }
  
  return data || [];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch schemes from database
    const schemes = await fetchSchemes();
    console.log(`Fetched ${schemes.length} schemes from database`);
    
    // Build system prompt with schemes context
    let systemPrompt = BASE_SYSTEM_PROMPT + formatSchemesForContext(schemes);
    
    // Add language context if specified
    if (language && language !== "en") {
      const langMap: Record<string, string> = {
        hi: "Hindi (हिंदी)",
        kn: "Kannada (ಕನ್ನಡ)",
      };
      systemPrompt += `\n\nIMPORTANT: The user prefers ${langMap[language] || "English"}. Please respond primarily in this language.`;
    }

    console.log("Calling Lovable AI Gateway with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
