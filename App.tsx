
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  Users, 
  ArrowRight,
  Trophy,
  Target,
  Loader2,
  CheckCircle2,
  Dumbbell,
  Timer,
  HeartPulse,
  Award
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateNanoImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: `High-end luxury fitness photography, dramatic lighting: ${prompt}` }] }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return null;
};

const NanoImage: React.FC<{ prompt: string; className?: string; delay?: number }> = ({ prompt, className, delay = 0 }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const img = await generateNanoImage(prompt);
      if (isMounted) {
        setSrc(img);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [prompt]);

  return (
    <div className={`relative overflow-hidden bg-zinc-900 shadow-2xl transition-all duration-1000 ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : src ? (
        <img 
          src={src} 
          alt={prompt} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 hover:scale-110" 
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold uppercase text-[10px]">Media Offline</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
    </div>
  );
};

const SectionHeading: React.FC<{ subtitle: string; title: string; align?: 'left' | 'center' }> = ({ subtitle, title, align = 'center' }) => (
  <div className={`mb-16 reveal ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <span className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4 block">{subtitle}</span>
    <h2 className="text-5xl md:text-7xl font-black text-white italic leading-none">{title}</h2>
  </div>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Philosophy', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Connect', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass py-4 border-b border-white/10' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-4 group">
          <div className="p-2 bg-primary rounded shadow-xl group-hover:rotate-[360deg] transition-transform duration-1000">
            <Trophy className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">EMPIRE</span>
            <span className="text-[9px] font-black text-primary tracking-[0.4em] uppercase">STRENGTH & FITNESS</span>
          </div>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <a href="tel:09718120614" className="bg-primary hover:bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg animate-gold-pulse">
            ENROLL NOW
          </a>
        </div>
        <button onClick={() => setIsOpen(true)} className="md:hidden text-white p-2">
          <Menu size={28} />
        </button>
      </div>
      <div className={`fixed inset-0 bg-zinc-950 z-[200] flex flex-col items-center justify-center gap-12 transition-transform duration-700 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="absolute top-8 right-8 text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}><X size={40} /></button>
        {links.map((link, i) => (
          <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-5xl font-black text-white hover:text-primary uppercase italic tracking-tighter" style={{ transitionDelay: `${i * 100}ms` }}>{link.name}</a>
        ))}
        <a href="tel:09718120614" className="bg-primary text-black px-16 py-6 rounded-full font-black text-xl uppercase tracking-widest mt-4 shadow-2xl">JOIN THE EMPIRE</a>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <NanoImage prompt="Luxury gym interior" className="w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-zinc-950/60" />
      </div>
      <div className="relative z-10 container mx-auto px-6 text-center reveal stagger-1 active">
        <div className="inline-flex items-center gap-3 px-6 py-2 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-zinc-300 text-[10px] font-black tracking-[0.4em] uppercase">6000 SQ FT ELITE FACILITY</span>
        </div>
        <h1 className="text-7xl md:text-[180px] font-black text-white italic tracking-tighter leading-[0.85] mb-8 uppercase reveal stagger-2">
          BUILT <br />
          <span className="text-primary text-glow empire-outline">BEYOND</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-2xl mx-auto mb-14 leading-relaxed reveal stagger-3">
          Imported machinery, elite discipline, and total transformation.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 reveal stagger-4">
          <a href="tel:09718120614" className="group relative flex items-center justify-center gap-4 bg-primary text-black px-12 py-6 rounded-full font-black text-lg uppercase tracking-widest hover:bg-white transition-all shadow-2xl">
            CLAIM YOUR SPOT 
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => (
  <section id="about" className="py-32 bg-white relative overflow-hidden">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative reveal-left">
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <NanoImage prompt="Gym weights rack" className="rounded-3xl h-80 reveal-scale stagger-1" />
              <div className="bg-zinc-950 p-10 rounded-3xl shadow-2xl reveal stagger-2">
                <h3 className="text-primary font-black text-6xl leading-none italic mb-2 tracking-tighter">6K</h3>
                <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest leading-tight">SQUARE FEET OF PURE IRON</p>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="bg-primary p-10 rounded-3xl shadow-2xl reveal stagger-3">
                <Users className="text-black w-10 h-10 mb-6" />
                <h3 className="text-black font-black text-5xl leading-none italic mb-2 tracking-tighter">15+</h3>
                <p className="text-black/60 font-black text-[10px] uppercase tracking-widest leading-tight">PRO CERTIFIED STAFF</p>
              </div>
              <NanoImage prompt="Athlete training" className="rounded-3xl h-80 reveal-scale stagger-4" />
            </div>
          </div>
        </div>
        <div className="reveal-right">
          <span className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-6 block stagger-1">Philosophy</span>
          <h2 className="text-6xl md:text-8xl font-black text-zinc-950 italic mb-10 leading-[0.85] tracking-tighter uppercase stagger-2">
            NOT JUST A <br />
            <span className="text-primary empire-outline" style={{ WebkitTextStrokeColor: '#000' }}>WORKOUT</span>
          </h2>
          <p className="text-zinc-600 text-xl mb-12 font-medium leading-relaxed stagger-3">
            Sanctuary for those who respect the grind. Elite imported equipment.
          </p>
          <a href="tel:09718120614" className="inline-flex items-center gap-4 font-black text-primary hover:text-black transition-all uppercase tracking-[0.2em] text-sm group stagger-5">
            START YOUR EVOLUTION <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Services: React.FC = () => {
  const services = [
    { icon: <Dumbbell />, title: "Imported Machinery", desc: "Top-tier biomechanically optimized equipment." },
    { icon: <Timer />, title: "Elite HIIT Zone", desc: "Dedicated high-intensity tactical training area." },
    { icon: <HeartPulse />, title: "Cardio Loft", desc: "Expansive range of modern trainers." },
    { icon: <Target />, title: "Personal Prep", desc: "1-on-1 body transformation coaching." },
    { icon: <Users />, title: "Group Synergy", desc: "Zumba, Yoga, and Aerobics." },
    { icon: <Award />, title: "Nutrition Lab", desc: "Customized meal planning." },
  ];
  return (
    <section id="services" className="py-32 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <SectionHeading subtitle="Arsenal" title="PRO AMENITIES" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className={`group bg-zinc-900/50 border border-white/5 p-10 rounded-3xl reveal-scale stagger-${(i%3)+1}`}>
              <div className="bg-zinc-800 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                {React.cloneElement(s.icon as any, { size: 32 })}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase">{s.title}</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/search/Empire+Strength+Fitness+Nangloi+Delhi/";
  return (
    <section id="contact" className="py-32 bg-zinc-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="reveal-left">
            <SectionHeading align="left" subtitle="Connect" title="GET IN THE RING" />
            <div className="space-y-10">
              <div className="flex items-start gap-8 group reveal-left stagger-1">
                <div className="p-6 bg-zinc-900 border border-primary/20 rounded-2xl text-primary">
                  <MapPin size={32} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 text-white italic uppercase">Location</h4>
                  <a href={mapUrl} target="_blank" className="text-zinc-400 text-lg hover:text-primary transition-colors">
                    Nangloi Extension, Delhi, 110041
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-8 group reveal-left stagger-2">
                <div className="p-6 bg-zinc-900 border border-primary/20 rounded-2xl text-primary">
                  <Phone size={32} />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 text-white italic uppercase">Phone</h4>
                  <a href="tel:09718120614" className="text-primary text-4xl md:text-5xl font-black tracking-tighter">
                    097181 20614
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal-right h-full min-h-[400px]">
            <NanoImage prompt="Abstract city map" className="w-full h-full rounded-3xl opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const staggers = entry.target.querySelectorAll('.stagger-1, .stagger-2, .stagger-3, .stagger-4');
          staggers.forEach(s => s.classList.add('active'));
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => observer.observe(el));
      }, 100);
    }, 800);

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-6 z-[1000]">
        <Trophy className="text-primary w-12 h-12 animate-spin" />
        <span className="text-primary font-black tracking-[0.6em] text-[10px] uppercase">LOADING EMPIRE</span>
      </div>
    );
  }

  return (
    <div className="antialiased bg-zinc-950">
      <Navbar />
      <Hero />
      <div className="clip-slant -mt-32 pb-32">
        <AboutSection />
      </div>
      <Services />
      <Contact />
      <footer className="py-10 border-t border-white/5 text-center text-zinc-600 uppercase text-[10px] tracking-widest">
        &copy; {new Date().getFullYear()} Empire Fitness Nangloi
      </footer>
    </div>
  );
}
