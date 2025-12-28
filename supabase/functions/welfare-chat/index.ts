import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are JanSaathi (जनसाथी), an AI-powered Social Welfare Scheme Eligibility & Application Assistant for India.

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

POPULAR SCHEMES TO KNOW:
1. PM-KISAN: ₹6,000/year for small farmers
2. PM Ujjwala Yojana: Free LPG connections for BPL families
3. Ayushman Bharat: ₹5 lakh health coverage
4. PM Awas Yojana: Housing assistance
5. Sukanya Samriddhi: Girl child savings scheme
6. MGNREGA: 100 days guaranteed employment
7. PM Fasal Bima Yojana: Crop insurance
8. Scholarship schemes for students (various categories)

LANGUAGE HANDLING:
- Detect and respond in the user's language (English/Hindi/Kannada)
- For Hindi: Use simple, everyday Hindi
- For Kannada: Use standard Kannada
- Mixed language (Hinglish) is acceptable

TONE: Warm, helpful, respectful. Think of yourself as a knowledgeable village elder who wants to help.

Always end responses with:
"Would you like me to explain any scheme in more detail, help with the application process, or suggest more schemes based on your profile?"`;

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

    // Add language context to system prompt if specified
    let systemPrompt = SYSTEM_PROMPT;
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
