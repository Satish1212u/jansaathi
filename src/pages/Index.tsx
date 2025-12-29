import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickPrompts } from "@/components/QuickPrompts";
import { TrustBadges } from "@/components/TrustBadges";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";

const welcomeMessages: Record<string, { title: string; subtitle: string; prompt: string }> = {
  en: {
    title: "Discover Government Schemes Made For You",
    subtitle: "Tell me about yourself — your occupation, age, income, and location — and I'll find welfare schemes you're eligible for.",
    prompt: "Describe your situation or ask about any scheme...",
  },
  hi: {
    title: "सरकारी योजनाएं खोजें जो आपके लिए बनी हैं",
    subtitle: "मुझे अपने बारे में बताएं — आपका पेशा, उम्र, आय और स्थान — और मैं आपके लिए उपयुक्त कल्याण योजनाएं खोजूंगा।",
    prompt: "अपनी स्थिति बताएं या किसी योजना के बारे में पूछें...",
  },
  kn: {
    title: "ನಿಮಗಾಗಿ ಮಾಡಿದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    subtitle: "ನಿಮ್ಮ ಬಗ್ಗೆ ಹೇಳಿ — ನಿಮ್ಮ ಉದ್ಯೋಗ, ವಯಸ್ಸು, ಆದಾಯ ಮತ್ತು ಸ್ಥಳ — ಮತ್ತು ನಾನು ನಿಮಗೆ ಅರ್ಹ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕುತ್ತೇನೆ.",
    prompt: "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ ಅಥವಾ ಯಾವುದೇ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಿ...",
  },
  ta: {
    title: "உங்களுக்கான அரசு திட்டங்களைக் கண்டறியுங்கள்",
    subtitle: "உங்களைப் பற்றி சொல்லுங்கள் — உங்கள் தொழில், வயது, வருமானம் மற்றும் இடம் — நான் உங்களுக்கு தகுதியான நல திட்டங்களைக் கண்டுபிடிப்பேன்.",
    prompt: "உங்கள் நிலையை விவரிக்கவும் அல்லது எந்த திட்டத்தைப் பற்றியும் கேளுங்கள்...",
  },
  te: {
    title: "మీ కోసం రూపొందించిన ప్రభుత్వ పథకాలను కనుగొనండి",
    subtitle: "మీ గురించి చెప్పండి — మీ వృత్తి, వయస్సు, ఆదాయం మరియు స్థానం — మీకు అర్హమైన సంక్షేమ పథకాలను నేను కనుగొంటాను.",
    prompt: "మీ పరిస్థితిని వివరించండి లేదా ఏదైనా పథకం గురించి అడగండి...",
  },
  bn: {
    title: "আপনার জন্য তৈরি সরকারি প্রকল্প খুঁজুন",
    subtitle: "আপনার সম্পর্কে বলুন — আপনার পেশা, বয়স, আয় এবং অবস্থান — আমি আপনার যোগ্য কল্যাণ প্রকল্পগুলি খুঁজে বের করব।",
    prompt: "আপনার পরিস্থিতি বর্ণনা করুন বা যেকোনো প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
  },
  mr: {
    title: "तुमच्यासाठी बनवलेल्या सरकारी योजना शोधा",
    subtitle: "तुमच्याबद्दल सांगा — तुमचा व्यवसाय, वय, उत्पन्न आणि स्थान — मी तुम्हाला पात्र असलेल्या कल्याण योजना शोधून काढेन.",
    prompt: "तुमची परिस्थिती सांगा किंवा कोणत्याही योजनेबद्दल विचारा...",
  },
  gu: {
    title: "તમારા માટે બનેલી સરકારી યોજનાઓ શોધો",
    subtitle: "તમારા વિશે જણાવો — તમારો વ્યવસાય, ઉંમર, આવક અને સ્થાન — હું તમારા માટે યોગ્ય કલ્યાણ યોજનાઓ શોધીશ.",
    prompt: "તમારી પરિસ્થિતિ જણાવો અથવા કોઈપણ યોજના વિશે પૂછો...",
  },
  pa: {
    title: "ਤੁਹਾਡੇ ਲਈ ਬਣੀਆਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲੱਭੋ",
    subtitle: "ਆਪਣੇ ਬਾਰੇ ਦੱਸੋ — ਤੁਹਾਡਾ ਕਿੱਤਾ, ਉਮਰ, ਆਮਦਨ ਅਤੇ ਸਥਾਨ — ਮੈਂ ਤੁਹਾਡੇ ਲਈ ਯੋਗ ਭਲਾਈ ਯੋਜਨਾਵਾਂ ਲੱਭਾਂਗਾ।",
    prompt: "ਆਪਣੀ ਸਥਿਤੀ ਦੱਸੋ ਜਾਂ ਕਿਸੇ ਯੋਜਨਾ ਬਾਰੇ ਪੁੱਛੋ...",
  },
  ml: {
    title: "നിങ്ങൾക്കായി രൂപകൽപ്പന ചെയ്ത സർക്കാർ പദ്ധതികൾ കണ്ടെത്തുക",
    subtitle: "നിങ്ങളെക്കുറിച്ച് പറയുക — നിങ്ങളുടെ തൊഴിൽ, പ്രായം, വരുമാനം, സ്ഥലം — നിങ്ങൾക്ക് അർഹമായ ക്ഷേമ പദ്ധതികൾ ഞാൻ കണ്ടെത്തും.",
    prompt: "നിങ്ങളുടെ സാഹചര്യം വിവരിക്കുക അല്ലെങ്കിൽ ഏതെങ്കിലും പദ്ധതിയെക്കുറിച്ച് ചോദിക്കുക...",
  },
  or: {
    title: "ଆପଣଙ୍କ ପାଇଁ ତିଆରି ସରକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ",
    subtitle: "ନିଜ ବିଷୟରେ କୁହନ୍ତୁ — ଆପଣଙ୍କ ବୃତ୍ତି, ବୟସ, ଆୟ ଏବଂ ସ୍ଥାନ — ମୁଁ ଆପଣଙ୍କ ପାଇଁ ଯୋଗ୍ୟ କଲ୍ୟାଣ ଯୋଜନା ଖୋଜିବି।",
    prompt: "ଆପଣଙ୍କ ପରିସ୍ଥିତି ବର୍ଣ୍ଣନା କରନ୍ତୁ କିମ୍ବା କୌଣସି ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ...",
  },
};

export default function Index() {
  const [language, setLanguage] = useState("en");
  const [scrollY, setScrollY] = useState(0);
  const { messages, isLoading, sendMessage, clearChat } = useChat(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const content = welcomeMessages[language] || welcomeMessages.en;

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickPrompt = (message: string) => {
    sendMessage(message);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} />

      <main className="flex-1 flex flex-col">
        {/* Hero Section - Only show when no messages */}
        {messages.length === 0 && (
          <section id="hero" className="relative overflow-hidden py-16 md:py-24">
            {/* Parallax Decorative Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div 
                className="absolute -top-32 -right-32 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-fade-in" 
                style={{ 
                  animationDuration: '1s',
                  transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.08}px)` 
                }} 
              />
              <div 
                className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/15 rounded-full blur-3xl animate-fade-in" 
                style={{ 
                  animationDelay: '0.2s',
                  animationDuration: '1s',
                  transform: `translate(${scrollY * -0.08}px, ${scrollY * -0.05}px)` 
                }} 
              />
              <div 
                className="absolute top-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-2xl animate-float"
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            <div className="container relative z-10">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                {/* Decorative Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-foreground">AI-Powered Welfare Discovery</span>
                </div>

                {/* Main Heading */}
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
                >
                  <span className="gradient-text">
                    {content.title.split(' ').slice(0, 3).join(' ')}
                  </span>
                  <br />
                  <span className="text-foreground">
                    {content.title.split(' ').slice(3).join(' ')}
                  </span>
                </h2>

                <p 
                  className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}
                >
                  {content.subtitle}
                </p>

                {/* Trust Badges */}
                <div 
                  className="pt-4 opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  <TrustBadges />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How It Works - Only show when no messages */}
        {messages.length === 0 && <HowItWorks />}

        {/* Testimonials - Only show when no messages */}
        {messages.length === 0 && <Testimonials />}

        {/* Chat Area */}
        <section className="flex-1 flex flex-col">
          <div className="container flex-1 flex flex-col max-w-3xl py-4">
            {/* Messages */}
            {messages.length > 0 ? (
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={i}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={isLoading && i === messages.length - 1 && msg.role === "assistant"}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              /* Quick Prompts - Only when no messages */
              <div id="categories" className="py-6 space-y-6">
                <div 
                  className="text-center opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Quick Start
                  </span>
                </div>
                <div 
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
                >
                  <QuickPrompts onSelect={handleQuickPrompt} />
                </div>
              </div>
            )}

            {/* Clear Chat Button */}
            {messages.length > 0 && (
              <div className="flex justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-muted-foreground hover:text-foreground gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New conversation
                </Button>
              </div>
            )}

            {/* Input Area */}
            <div className="sticky bottom-0 glass rounded-2xl p-3 mt-4">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                placeholder={content.prompt}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}