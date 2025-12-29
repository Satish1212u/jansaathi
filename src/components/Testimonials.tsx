import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh Kumar",
    location: "Bihar",
    occupation: "Farmer",
    quote: "I discovered PM-KISAN and got ₹6,000 yearly support. JanSaathi made it so easy to understand the application process.",
    scheme: "PM-KISAN",
    avatar: "RK",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    location: "Rajasthan",
    occupation: "Student",
    quote: "Found a scholarship I never knew existed. Now my college fees are fully covered. Thank you JanSaathi!",
    scheme: "National Scholarship Portal",
    avatar: "PS",
    rating: 5,
  },
  {
    name: "Lakshmi Devi",
    location: "Tamil Nadu",
    occupation: "Self-employed",
    quote: "Got my family enrolled in Ayushman Bharat. The ₹5 lakh health cover gives us peace of mind.",
    scheme: "Ayushman Bharat",
    avatar: "LD",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Success Stories
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
            Real People, Real Benefits
          </h3>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
            See how JanSaathi has helped citizens across India discover and access government welfare schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass rounded-2xl p-6 hover-lift relative"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
              
              {/* Rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-sm text-foreground leading-relaxed mb-4">
                "{testimonial.quote}"
              </p>
              
              {/* Scheme badge */}
              <div className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium mb-4">
                {testimonial.scheme}
              </div>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.occupation} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}