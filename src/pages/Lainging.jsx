import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {Link} from 'react-router-dom'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------------------------------------
   StudyPilot AI — Landing Page (single file)
   Requires: npm i gsap
--------------------------------------------- */

const THEMES = {
  dark: {
    mode: "dark",
    bg: "#0A0A0D",
    bgSoft: "#101116",
    surface: "rgba(255,255,255,0.035)",
    border: "rgba(255,255,255,0.09)",
    borderSoft: "rgba(255,255,255,0.06)",
    text: "#E9EAF0",
    textMuted: "#9AA0B2",
    textFaint: "#5C6070",
    indigo: "#7C93FF",
    indigoSoft: "rgba(124,147,255,0.14)",
    amber: "#F0B166",
    dotColor: "rgba(255,255,255,0.05)",
  },
  light: {
    mode: "light",
    bg: "#F7F6F2",
    bgSoft: "#FFFFFF",
    surface: "rgba(10,10,25,0.03)",
    border: "rgba(10,10,25,0.10)",
    borderSoft: "rgba(10,10,25,0.06)",
    text: "#15161C",
    textMuted: "#54576A",
    textFaint: "#8B8E9C",
    indigo: "#3E5CE8",
    indigoSoft: "rgba(62,92,232,0.10)",
    amber: "#B87A38",
    dotColor: "rgba(10,10,25,0.06)",
  },
};

/* ---------------- data ---------------- */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Technology", href: "#ai-technology" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const PROBLEMS = [
  { title: "Too many PDFs and notes", desc: "Material is scattered across files, folders and apps with no single place to work from." },
  { title: "Hard to find what matters", desc: "Important details are buried inside long documents you don't have time to reread." },
  { title: "Revisions get forgotten", desc: "Without a schedule, topics you covered weeks ago quietly slip out of memory." },
  { title: "Practice questions take time", desc: "Writing your own quizzes and MCQs eats into the time you'd rather spend studying." },
  { title: "Weak topics stay hidden", desc: "It's difficult to see which areas actually need more attention until the exam is close." },
];

const STEPS = [
  { n: "01", title: "Upload", desc: "Upload PDFs, notes or study material directly into your workspace." },
  { n: "02", title: "Understand", desc: "StudyPilot reads and indexes the material so it can reason about it." },
  { n: "03", title: "Ask", desc: "Ask questions directly from your content and get grounded answers." },
  { n: "04", title: "Practice", desc: "Generate summaries, quizzes, MCQs and flashcards from what you uploaded." },
  { n: "05", title: "Revise", desc: "Follow a revision plan built around your progress and weak topics." },
];

const FEATURES = [
  { title: "AI Study Assistant", desc: "A conversational agent that reasons over your material and answers in context." },
  { title: "RAG Knowledge Search", desc: "Retrieves the exact passages relevant to your question before answering." },
  { title: "PDF & Notes Intelligence", desc: "Understands the structure of your uploaded documents, not just raw text." },
  { title: "AI Summaries", desc: "Turns long chapters and notes into summaries you can actually review." },
  { title: "AI Quiz Generator", desc: "Creates quizzes and MCQs straight from the material you've uploaded." },
  { title: "AI Tutor", desc: "Explains concepts step by step when a topic doesn't make sense yet." },
  { title: "Flashcards", desc: "Auto-generated flashcards for quick, repeated recall practice." },
  { title: "Smart Revision", desc: "Builds a revision plan based on what you've studied and what you haven't." },
  { title: "Progress Analytics", desc: "Tracks what you've covered and how your understanding is trending." },
  { title: "Conversation Memory", desc: "Remembers earlier context in your session so follow-up questions just work." },
  { title: "AI Tools", desc: "A calculator and utility tools available right inside your workspace." },
  { title: "Exam Preparation", desc: "Pulls everything together into a focused mode as your exam gets closer." },
];

const USE_CASES = [
  "Explain this Physics chapter",
  "Summarize my PDF",
  "Generate 20 MCQs",
  "Create flashcards",
  "Explain this difficult topic",
  "Help me revise this chapter",
];

const ROADMAP = [
  { phase: "Phase 01", title: "AI Foundation", status: "Live", desc: "Upload, RAG search, AI chat and summaries." },
  { phase: "Phase 02", title: "Smart Practice", status: "In progress", desc: "Quiz generation, flashcards and conversation memory." },
  { phase: "Phase 03", title: "Personalized Learning", status: "Coming Soon", desc: "Weak-topic detection, revision scheduling, analytics." },
  { phase: "Phase 04", title: "Advanced AI Tutor", status: "Coming Soon", desc: "Voice tutor, handwritten-question understanding, exam mode." },
];

/* ---------------- RAG flow ---------------- */
const RAG_FLOW = [
  { title: "PDF / Notes", desc: "You upload your own study material into your workspace." },
  { title: "Text Extraction", desc: "StudyPilot reads the document and pulls out clean, structured text." },
  { title: "Embeddings", desc: "That text is converted into a numerical form the AI can search through." },
  { title: "Vector Store", desc: "Embeddings are stored so relevant sections can be found instantly." },
  { title: "Relevant Information", desc: "When you ask something, the closest matching sections are retrieved." },
  { title: "AI Agent", desc: "The agent reads those sections and reasons about your question." },
  { title: "Answer", desc: "You get an answer grounded in your own material, not a generic guess." },
];

/* ---------------- AI agent + tools ---------------- */
const AGENT_TOOLS = [
  { name: "RAG", desc: "Searches your uploaded material for relevant context." },
  { name: "Memory", desc: "Recalls earlier context from your current session." },
  { name: "Calculator", desc: "Handles numerical and mathematical questions." },
  { name: "Other AI Tools", desc: "Additional utilities the agent can call on as needed." },
];

/* ---------------- technology stack ---------------- */
const TECH_STACK = [
  "React", "Tailwind CSS", "Node.js", "Express", "MongoDB",
  "n8n", "AI Agents", "OpenRouter", "RAG", "Embeddings", "Vector Store",
];

const WHY = [
  { title: "One workspace", desc: "Chat, summaries, quizzes and revision in one place instead of five apps." },
  { title: "Your own study material", desc: "Answers come from what you uploaded, not a generic model guess." },
  { title: "AI-powered learning", desc: "RAG and agents built specifically around how students actually study." },
  { title: "Personalized learning", desc: "Your workspace adapts to what you've studied and what you haven't." },
  { title: "Less searching", desc: "Ask instead of scrolling through pages looking for one paragraph." },
  { title: "Smarter revision", desc: "Revisit topics on a schedule shaped by your own progress." },
];

const PRICING = [
  { name: "Free", price: "₹0", period: "forever", features: ["Basic AI study features", "Limited PDF uploads", "Basic summaries"], cta: "Start Studying", highlight: false },
  { name: "Pro", price: "Coming soon", period: "", features: ["Advanced AI assistant", "More PDF uploads", "Full RAG knowledge search", "Quiz generation", "Flashcards", "Revision planning", "Progress analytics"], cta: "Join the waitlist", highlight: true },
];

const FAQS = [
  { q: "What is StudyPilot AI?", a: "StudyPilot AI is a personal AI study workspace where you upload your material and get answers, summaries, quizzes and a revision plan built from it." },
  { q: "Can I upload PDFs?", a: "Yes. You can upload PDFs and study notes directly into your workspace and start asking questions right away." },
  { q: "How does RAG work?", a: "When you ask a question, StudyPilot retrieves the most relevant sections from your uploaded material before generating an answer, so responses stay grounded in your content." },
  { q: "Can StudyPilot answer questions from my notes?", a: "Yes. Once your notes are uploaded and processed, you can ask questions and get answers sourced from them." },
  { q: "Can it generate quizzes?", a: "Yes. You can generate quizzes, MCQs and flashcards directly from the material you've uploaded." },
  { q: "Is it free?", a: "StudyPilot AI has a free plan with core study features. A Pro plan with advanced features is coming soon." },
];

const FOOTER_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const HERO_PHOTO = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80";

const CHAT_DEMO = [
  { role: "user", text: "Summarize chapter 4 on thermodynamics" },
  { role: "ai", text: "Covers the first and second laws, entropy, and three worked examples from your notes." },
  { role: "user", text: "Make 5 MCQs from this chapter" },
  { role: "ai", text: "Done — 5 MCQs generated from your uploaded chapter, ready to attempt." },
];

/* ---------------- icons ---------------- */
const Icon = ({ name, size = 20, color = "#7C93FF" }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    assistant: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><circle cx="12" cy="12" r="5" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.5-4.5" /></>,
    doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></>,
    summary: <><path d="M4 5h16M4 12h16M4 19h10" /></>,
    quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2 1-1.2 1.8" /><path d="M12 17h.01" /></>,
    tutor: <><path d="M4 19c0-3 3.5-5 8-5s8 2 8 5" /><circle cx="12" cy="8" r="4" /></>,
    cards: <><rect x="4" y="6" width="12" height="14" rx="1.5" /><rect x="8" y="3" width="12" height="14" rx="1.5" /></>,
    plan: <><rect x="3" y="4" width="18" height="17" rx="1.5" /><path d="M8 2v4M16 2v4M3 10h18" /></>,
    chart: <><path d="M4 20V10M12 20V4M20 20v-7" /></>,
    memory: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
    tools: <><path d="M14 6l4 4-9 9H5v-4z" /><path d="M13 7l-2-2 1.5-1.5a2 2 0 0 1 2.8 0L17 5.2a2 2 0 0 1 0 2.8L15.5 9.5" /></>,
    exam: <><path d="M4 4h16v16H4z" /><path d="M8 9l2 2 4-4" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const FEATURE_ICONS = ["assistant", "search", "doc", "summary", "quiz", "tutor", "cards", "plan", "chart", "memory", "tools", "exam"];

/* ---------------- gsap scroll reveal ---------------- */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: delay / 1000,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }
      );
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ---------------- 3D tilt wrapper (mouse on desktop, touch-drag on mobile) ---------------- */
function TiltCard({ children, className = "", style = {}, disabled = false, strength = 10, touchTilt = true }) {
  const ref = useRef(null);

  const tiltFromPoint = useCallback(
    (clientX, clientY) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      gsap.to(ref.current, {
        rotateX: py * -strength,
        rotateY: px * strength,
        transformPerspective: 900,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [strength]
  );

  const handleMove = useCallback(
    (e) => {
      if (disabled) return;
      tiltFromPoint(e.clientX, e.clientY);
    },
    [disabled, tiltFromPoint]
  );

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (!touchTilt || !e.touches || !e.touches[0]) return;
      tiltFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    },
    [touchTilt, tiltFromPoint]
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleLeave}
      onTouchCancel={handleLeave}
    >
      {children}
    </div>
  );
}

/* ---------------- custom cursor (desktop only) ---------------- */
function CustomCursor({ color }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const moveDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });
    const moveRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const moveRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e) => {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };
    const onOver = (e) => {
      if (e.target.closest("a,button,[data-cursor-hover]")) {
        gsap.to(ring, { scale: 1.8, duration: 0.25 });
      }
    };
    const onOut = (e) => {
      if (e.target.closest("a,button,[data-cursor-hover]")) {
        gsap.to(ring, { scale: 1, duration: 0.25 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} style={{ position: "fixed", top: -14, left: -14, width: 28, height: 28, borderRadius: "50%", border: `1px solid ${color}`, pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)" }} />
      <div ref={dotRef} style={{ position: "fixed", top: -2, left: -2, width: 4, height: 4, borderRadius: "50%", background: color, pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)" }} />
    </>
  );
}

/* ---------------- auto-typing chat demo ---------------- */
function useChatTypewriter() {
  const [log, setLog] = useState([]);
  useEffect(() => {
    let mounted = true;
    const timeouts = [];
    const schedule = (fn, delay) => {
      const t = setTimeout(() => mounted && fn(), delay);
      timeouts.push(t);
    };
    function typeMessage(msgIdx, charIdx) {
      const item = CHAT_DEMO[msgIdx];
      if (charIdx === 0) setLog((prev) => [...prev, { role: item.role, text: "" }]);
      setLog((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: item.role, text: item.text.slice(0, charIdx) };
        return copy;
      });
      if (charIdx < item.text.length) {
        schedule(() => typeMessage(msgIdx, charIdx + 1), 20);
      } else if (msgIdx < CHAT_DEMO.length - 1) {
        schedule(() => typeMessage(msgIdx + 1, 0), 800);
      } else {
        schedule(() => {
          setLog([]);
          typeMessage(0, 0);
        }, 2200);
      }
    }
    typeMessage(0, 0);
    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, []);
  return log;
}

/* ---------------- study-themed background art ---------------- */
function StudyBackdrop({ C, layerRef }) {
  return (
    <div ref={layerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* dot-grid, notebook feel */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `radial-gradient(${C.dotColor} 1px, transparent 1px)`, backgroundSize: "22px 22px" }}
      />
      {/* glow blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ background: C.indigo, opacity: 0.16, filter: "blur(100px)" }} />
      <div className="absolute top-40 -left-32 w-80 h-80 rounded-full" style={{ background: C.amber, opacity: 0.1, filter: "blur(110px)" }} />

      {/* open book line-art */}
      <svg className="absolute right-4 bottom-0 opacity-[0.10]" width="420" height="300" viewBox="0 0 420 300" fill="none">
        <path d="M20 40 C 100 10, 150 10, 200 40 L200 260 C150 230, 100 230, 20 260 Z" stroke={C.text} strokeWidth="1.4" />
        <path d="M400 40 C 320 10, 270 10, 220 40 L220 260 C270 230, 320 230, 400 260 Z" stroke={C.text} strokeWidth="1.4" />
        <path d="M40 70h130M40 100h130M40 130h130M40 160h100" stroke={C.text} strokeWidth="1" />
        <path d="M250 70h130M250 100h130M250 130h130M250 160h100" stroke={C.text} strokeWidth="1" />
      </svg>

      {/* study-desk photo, treated so it reads as an editorial detail rather than a stock hero */}
      <div
        className="hero-photo-float absolute overflow-hidden rounded-2xl"
        style={{
          left: "-52px",
          bottom: "-28px",
          width: "168px",
          height: "216px",
          transform: "rotate(-7deg)",
          border: `1px solid ${C.border}`,
          boxShadow: C.mode === "dark" ? "0 30px 60px -20px rgba(0,0,0,0.6)" : "0 30px 60px -20px rgba(20,20,35,0.18)",
        }}
      >
        <img
          src={HERO_PHOTO}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
          className="w-full h-full object-cover"
          style={{
            filter: C.mode === "dark" ? "grayscale(45%) brightness(0.7) contrast(1.05)" : "grayscale(20%) brightness(1.02) contrast(1.02)",
            maskImage: "linear-gradient(155deg, black 45%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(155deg, black 45%, transparent 92%)",
          }}
        />
        <div className="absolute inset-0" style={{ background: C.indigo, opacity: 0.16, mixBlendMode: "overlay" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(155deg, transparent 40%, ${C.bg} 96%)` }} />
      </div>

      {/* floating glyphs */}
      {[
        { s: "Σ", top: "12%", left: "8%", d: "0s" },
        { s: "π", top: "30%", left: "88%", d: "1.1s" },
        { s: "01", top: "70%", left: "6%", d: "0.6s" },
        { s: "∫", top: "60%", left: "92%", d: "1.6s" },
      ].map((g) => (
        <span
          key={g.s}
          className="float-glyph absolute font-serif text-2xl"
          style={{ top: g.top, left: g.left, color: C.textFaint, opacity: 0.35, animationDelay: g.d }}
        >
          {g.s}
        </span>
      ))}
    </div>
  );
}

/* ---------------- main component ---------------- */
export default function StudyPilotLanding() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const C = THEMES[theme];

  const heroTextRef = useRef(null);
  const bgLayerRef = useRef(null);
  const chatLog = useChatTypewriter();

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!heroTextRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-anim", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
    }, heroTextRef);
    return () => ctx.revert();
  }, []);

  const handleHeroMove = (e) => {
    if (isTouch || !bgLayerRef.current) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 16;
    const y = (e.clientY / innerHeight - 0.5) * 16;
    gsap.to(bgLayerRef.current, { x, y, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div style={{ background: C.bg, color: C.text, cursor: isTouch ? "auto" : "none" }} className="min-h-screen font-sans antialiased relative transition-colors duration-500">
      <style>{`
        html { scroll-behavior: smooth; }
        ::selection { background: ${C.indigoSoft}; }
        @keyframes floatY { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-14px);} }
        .float-glyph { animation: floatY 6s ease-in-out infinite; }
        @keyframes blink { 0%,49% { opacity:1;} 50%,100% { opacity:0;} }
        .chat-cursor { animation: blink 1s step-start infinite; }
        @keyframes heroPhotoFloat { 0%,100% { transform: rotate(-7deg) translateY(0px);} 50% { transform: rotate(-4deg) translateY(-10px);} }
        .hero-photo-float { animation: heroPhotoFloat 7s ease-in-out infinite; }
        @keyframes cardGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 1; } }
        .glow-ring { animation: cardGlow 3.2s ease-in-out infinite; }
        @keyframes shineSweep { 0% { transform: translateX(-120%) skewX(-15deg); } 100% { transform: translateX(220%) skewX(-15deg); } }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: ""; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: translateX(-120%) skewX(-15deg);
        }
        .btn-shine:hover::after, .btn-shine:active::after { animation: shineSweep 0.9s ease forwards; }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        @media (pointer: coarse) {
          body, a, button { cursor: auto !important; }
          .hero-photo-float { animation-duration: 9s; }
        }
        @media (max-width: 420px) {
          .hero-photo-float { width: 118px !important; height: 152px !important; left: -40px !important; }
        }
      `}</style>

      {!isTouch && <CustomCursor color={C.indigo} />}

      {/* ---------------- NAVBAR ---------------- */}
      <header className="sticky top-0 z-50" style={{ background: theme === "dark" ? "rgba(10,10,13,0.75)" : "rgba(247,246,242,0.75)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.borderSoft}` }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: C.indigoSoft, border: `1px solid ${C.border}` }}>
              <span style={{ color: C.indigo }} className="text-xs font-serif font-semibold">S</span>
            </div>
            <span className="font-serif text-lg tracking-tight">StudyPilot AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm transition-colors" style={{ color: C.textMuted }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105"
              style={{ border: `1px solid ${C.border}` }}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={16} color={C.text} />
            </button>
            <Link to="/login" className="text-sm px-4 py-2 rounded-lg" style={{ color: C.textMuted }}>Login</Link>
            <Link to="/dashboard" className="text-sm px-4 py-2 rounded-lg font-medium transition-transform hover:scale-[1.03]" style={{ background: C.text, color: C.bg }}>
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button aria-label="Toggle theme" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px solid ${C.border}` }}>
              <Icon name={theme === "dark" ? "sun" : "moon"} size={16} color={C.text} />
            </button>
            <button className="p-2 active:scale-90 transition-transform" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
              <div className="w-5 h-px mb-1.5" style={{ background: C.text }} />
              <div className="w-5 h-px" style={{ background: C.text }} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-5 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm pt-4" style={{ color: C.textMuted }} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <button className="text-sm px-4 py-2.5 rounded-lg font-medium mt-2 active:scale-95 transition-transform" style={{ background: C.text, color: C.bg }}>
              Get Started
            </button>
          </div>
        )}
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden" onMouseMove={handleHeroMove}>
        <StudyBackdrop C={C} layerRef={bgLayerRef} />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-14 items-center" ref={heroTextRef} style={{ zIndex: 1 }}>
          <div>
            <div className="hero-anim inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-6" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.indigo }} />
              AI-powered learning workspace
            </div>

            <h1
              className="hero-anim font-serif text-4xl md:text-5xl leading-[1.12] mb-6"
              style={{ backgroundImage: `linear-gradient(90deg, ${C.text}, ${C.indigo})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
            >
              Your personal AI study workspace
            </h1>

            <p className="hero-anim text-base md:text-lg leading-relaxed mb-8 max-w-md" style={{ color: C.textMuted }}>
              Upload your notes. Ask questions. Generate summaries, quizzes and revision plans — all in one intelligent workspace.
            </p>

            <div className="hero-anim flex flex-wrap gap-3">
              <button
                data-cursor-hover
                className="btn-shine px-5 py-3 rounded-lg text-sm font-medium transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: C.text, color: C.bg, boxShadow: `0 8px 30px ${C.indigoSoft}` }}
              >
                Start Studying
              </button>
              <a href="#features" data-cursor-hover className="px-5 py-3 rounded-lg text-sm font-medium transition-colors active:scale-95" style={{ border: `1px solid ${C.border}`, color: C.text }}>
                Explore Features
              </a>
            </div>
          </div>

          {/* auto-typing chat + flow */}
          <div className="hero-anim relative">
            <div
              className="glow-ring absolute -inset-3 rounded-[28px] pointer-events-none hidden sm:block"
              style={{ background: `linear-gradient(135deg, ${C.indigo}, transparent 55%, ${C.amber})`, filter: "blur(28px)", opacity: 0.5 }}
            />
            <TiltCard className="relative rounded-2xl p-5 md:p-6" style={{ background: C.bgSoft, border: `1px solid ${C.border}`, backdropFilter: "blur(6px)" }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full" style={{ background: "#5fbf6b" }} />
                <span className="text-xs" style={{ color: C.textFaint }}>Live in your workspace</span>
              </div>
              <div className="flex flex-col gap-3 min-h-[190px]">
                {chatLog.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "self-end" : "self-start"}`}
                       style={{ background: m.role === "user" ? C.indigoSoft : C.surface, border: `1px solid ${C.borderSoft}`, color: C.text }}>
                    {m.text}
                    {i === chatLog.length - 1 && <span className="chat-cursor">▍</span>}
                  </div>
                ))}
              </div>
            </TiltCard>

            <div className="mt-4 flex items-center justify-between gap-2 text-xs" style={{ color: C.textFaint }}>
              {["PDF", "AI Agent", "RAG", "Answer"].map((s, i) => (
                <React.Fragment key={s}>
                  <span className="px-2.5 py-1.5 rounded-lg" style={{ border: `1px solid ${C.borderSoft}` }}>{s}</span>
                  {i < 3 && <span>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- PROBLEM ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12 max-w-xl">Studying shouldn't feel this complicated.</h2></Reveal>
        <div className="grid md:grid-cols-2 gap-px" style={{ background: C.borderSoft }}>
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div className="p-6 h-full" style={{ background: C.bg }}>
                <div className="text-sm mb-2" style={{ color: C.textFaint }}>{String(i + 1).padStart(2, "0")}</div>
                <div className="font-medium mb-1.5">{p.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{p.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- SOLUTION ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-5 gap-10 items-start">
          <Reveal className="md:col-span-2"><h2 className="font-serif text-3xl md:text-4xl leading-tight">Meet your AI study partner.</h2></Reveal>
          <Reveal delay={100} className="md:col-span-3">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: C.textMuted }}>
              StudyPilot AI reads what you upload, keeps it organized, and answers questions grounded in your own material —
              not a generic guess. Instead of switching between a PDF reader, a note-taking app and a quiz maker, you work
              from one workspace that understands your syllabus and helps you get through it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12">How it works</h2></Reveal>
        <div className="grid md:grid-cols-5 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-sm font-serif mb-3" style={{ color: C.indigo }}>{s.n}</div>
                <div className="font-medium mb-1.5">{s.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12">Everything you need to study, in one place</h2></Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 6) * 50}>
              <TiltCard strength={6} className="p-5 rounded-xl h-full active:scale-[0.98] transition-transform" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                <div className="mb-3"><Icon name={FEATURE_ICONS[i]} color={C.indigo} /></div>
                <div className="font-medium mb-1.5 text-sm">{f.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{f.desc}</div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- RAG ---------------- */}
      <section id="ai-technology" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-5 gap-10 items-start mb-14">
          <Reveal className="md:col-span-2"><h2 className="font-serif text-3xl md:text-4xl leading-tight">Ask questions from your own study material.</h2></Reveal>
          <Reveal delay={100} className="md:col-span-3">
            <p className="text-base md:text-lg leading-relaxed" style={{ color: C.textMuted }}>
              When you ask a question, StudyPilot doesn't just guess — it looks through your own uploaded notes first,
              finds the exact sections that matter, and answers from there. This is called RAG: retrieval-augmented
              generation. In simple terms, it reads before it answers.
            </p>
          </Reveal>
        </div>

        <div className="max-w-md mx-auto flex flex-col items-stretch">
          {RAG_FLOW.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
              <div>
                <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-sm font-medium mb-1">{step.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{step.desc}</div>
                </div>
                {i < RAG_FLOW.length - 1 && (
                  <div className="flex justify-center py-1.5" style={{ color: C.textFaint }}>
                    <span aria-hidden="true">↓</span>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- AI AGENT ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-3">One agent, the right tool for the question.</h2></Reveal>
        <Reveal delay={80}>
          <p className="text-sm md:text-base mb-12 max-w-2xl" style={{ color: C.textMuted }}>
            Every question goes to the same AI Agent. Depending on what you're asking, it decides which tool it needs —
            searching your material, recalling earlier context, doing a calculation, or something else — before it replies.
          </p>
        </Reveal>

        <div className="flex flex-col items-center">
          <Reveal>
            <div className="px-5 py-3 rounded-xl text-sm font-medium" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
              Student Question
            </div>
          </Reveal>
          <div className="py-2" style={{ color: C.textFaint }} aria-hidden="true">↓</div>
          <Reveal delay={60}>
            <div className="px-6 py-3.5 rounded-xl text-sm font-medium" style={{ background: C.indigoSoft, border: `1px solid ${C.indigo}`, color: C.text }}>
              AI Agent
            </div>
          </Reveal>
          <div className="py-2" style={{ color: C.textFaint }} aria-hidden="true">↓</div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 pt-2" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
            {AGENT_TOOLS.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <TiltCard strength={5} className="h-full rounded-xl p-4 text-center" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-sm font-medium mb-1">{t.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{t.desc}</div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <div className="py-2" style={{ color: C.textFaint }} aria-hidden="true">↓</div>
          <Reveal delay={120}>
            <div className="px-5 py-3 rounded-xl text-sm font-medium" style={{ background: C.text, color: C.bg }}>
              Answer
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- WORKSPACE PREVIEW ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Your workspace, at a glance</h2>
          <p className="text-sm mb-12" style={{ color: C.textMuted }}>An example of what a study session inside StudyPilot looks like.</p>
        </Reveal>

        <Reveal>
          <TiltCard strength={4} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}`, background: C.bgSoft }}>
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4a4a52" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4a4a52" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4a4a52" }} />
              <span className="ml-3 text-xs" style={{ color: C.textFaint }}>app.studypilot.ai</span>
              <span className="ml-auto hidden md:inline-flex text-xs px-2.5 py-1 rounded-full" style={{ background: C.indigoSoft, color: C.indigo }}>Daily goal: 3 of 4 done</span>
            </div>
            <div className="grid grid-cols-12">
              <div className="col-span-3 hidden sm:block p-4" style={{ borderRight: `1px solid ${C.borderSoft}` }}>
                {[{ label: "AI Chat", icon: "assistant" }, { label: "Study Materials", icon: "doc" }, { label: "Recent PDFs", icon: "summary" }, { label: "Progress", icon: "chart" }].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm mb-1" style={{ background: i === 0 ? C.indigoSoft : "transparent", color: i === 0 ? C.text : C.textMuted }}>
                    <Icon name={item.icon} size={15} color={i === 0 ? C.indigo : C.textFaint} />
                    {item.label}
                  </div>
                ))}
                <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
                  <div className="text-xs mb-2 px-1" style={{ color: C.textFaint }}>Quick actions</div>
                  {["New quiz", "Upload PDF", "Ask AI"].map((a) => (
                    <div key={a} className="px-3 py-2 rounded-lg text-xs mb-1 active:scale-95 transition-transform" style={{ border: `1px solid ${C.borderSoft}`, color: C.textMuted }}>{a}</div>
                  ))}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-9 p-5 grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-xs mb-2" style={{ color: C.textFaint }}>AI Summary — Thermodynamics, Ch. 4</div>
                  <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>Covers the first and second laws, entropy, and three worked examples from your notes.</div>
                </div>
                <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-xs mb-2" style={{ color: C.textFaint }}>Quiz — 10 questions generated</div>
                  <div className="text-sm" style={{ color: C.textMuted }}>From your uploaded chapter, ready to attempt.</div>
                </div>
                <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-xs mb-2" style={{ color: C.textFaint }}>Progress</div>
                  <div className="w-full h-1.5 rounded-full mb-2" style={{ background: C.borderSoft }}>
                    <div className="h-full rounded-full" style={{ width: "62%", background: C.indigo }} />
                  </div>
                  <div className="text-sm" style={{ color: C.textMuted }}>3 of 5 chapters reviewed this week</div>
                </div>
                <div className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <div className="text-xs mb-2" style={{ color: C.textFaint }}>Next revision</div>
                  <div className="text-sm" style={{ color: C.textMuted }}>Electrochemistry — flagged as a weak topic</div>
                </div>
                <div className="rounded-xl p-4 sm:col-span-2" style={{ background: C.indigoSoft, border: `1px solid ${C.indigo}` }}>
                  <div className="text-xs mb-2" style={{ color: C.indigo }}>AI recommendation</div>
                  <div className="text-sm leading-relaxed" style={{ color: C.text }}>You haven't revised Electrochemistry in 9 days — want a 10-question refresher before your next session?</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </section>

      {/* ---------------- USE CASES ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-10">What students use it for</h2></Reveal>
        <div className="flex flex-wrap gap-3">
          {USE_CASES.map((u, i) => (
            <Reveal key={u} delay={i * 40}>
              <div className="px-4 py-2.5 rounded-full text-sm active:scale-95 transition-transform" style={{ border: `1px solid ${C.border}`, color: C.textMuted }}>"{u}"</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- ROADMAP ---------------- */}
      <section id="roadmap" className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12">Roadmap</h2></Reveal>
        <div className="grid md:grid-cols-4 gap-6">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.phase} delay={i * 80}>
              <div className="pt-4 h-full" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="text-xs mb-3" style={{ color: C.textFaint }}>{r.phase}</div>
                <div className="font-medium mb-2">{r.title}</div>
                <div className="text-sm leading-relaxed mb-4" style={{ color: C.textMuted }}>{r.desc}</div>
                <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: r.status === "Live" ? C.indigoSoft : "transparent", border: `1px solid ${r.status === "Live" ? C.indigo : C.border}`, color: r.status === "Live" ? C.indigo : C.textFaint }}>
                  {r.status}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- WHY ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12">Why StudyPilot</h2></Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 50}>
              <div>
                <div className="font-medium mb-1.5">{w.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{w.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-12">Pricing</h2></Reveal>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {PRICING.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <TiltCard strength={5} className="rounded-2xl p-6 h-full flex flex-col" style={{ background: p.highlight ? C.indigoSoft : C.surface, border: `1px solid ${p.highlight ? C.indigo : C.border}` }}>
                <div className="font-serif text-xl mb-1">{p.name}</div>
                <div className="mb-5">
                  <span className="text-2xl font-medium">{p.price}</span>
                  {p.period && <span className="text-sm ml-1" style={{ color: C.textFaint }}>/ {p.period}</span>}
                </div>
                <div className="flex flex-col gap-2.5 mb-6 flex-1">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm" style={{ color: C.textMuted }}>
                      <span className="mt-0.5"><Icon name="check" size={14} color={p.highlight ? C.indigo : C.textFaint} /></span>
                      {f}
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-lg text-sm font-medium transition-transform hover:scale-[1.02] active:scale-95" style={{ background: p.highlight ? C.indigo : C.text, color: p.highlight ? "#0A0A0D" : C.bg }}>
                  {p.cta}
                </button>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="max-w-6xl mx-auto px-6 py-20">
        <Reveal><h2 className="font-serif text-3xl md:text-4xl mb-10">Frequently asked questions</h2></Reveal>
        <div className="max-w-2xl">
          {FAQS.map((f, i) => (
            <div key={f.q} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
              <button className="w-full flex items-center justify-between py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span className="font-medium text-sm md:text-base pr-4">{f.q}</span>
                <span style={{ color: C.textFaint }} className="text-lg leading-none flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
              </button>
              <div style={{ maxHeight: openFaq === i ? 200 : 0, opacity: openFaq === i ? 1 : 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease" }}>
                <p className="text-sm leading-relaxed pb-5" style={{ color: C.textMuted }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="rounded-2xl p-10 md:p-14 text-center" style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}>
            <h2 className="font-serif text-3xl md:text-4xl mb-8 max-w-xl mx-auto leading-tight">Turn your study material into your personal AI workspace.</h2>
            <button data-cursor-hover className="btn-shine px-6 py-3 rounded-lg text-sm font-medium transition-transform hover:scale-[1.03] active:scale-95" style={{ background: C.text, color: C.bg, boxShadow: `0 8px 30px ${C.indigoSoft}` }}>
              Start Studying
            </button>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="font-serif text-lg mb-2">StudyPilot AI</div>
            <div className="text-sm" style={{ color: C.textFaint }}>Smarter learning starts with better tools.</div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm" style={{ color: C.textMuted }}>{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}