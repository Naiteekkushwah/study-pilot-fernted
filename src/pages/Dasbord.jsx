import React, { useState, useRef, useEffect, useContext } from "react";
import gsap from "gsap";
import axios from "axios"
import { userContext } from "../Usercontext";
import {toast} from 'react-toastify'


const C = {
  bg: "#0A0A0D",
  bgSoft: "#101116",
  surface: "rgba(255,255,255,0.035)",
  surfaceStrong: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.09)",
  borderSoft: "rgba(255,255,255,0.06)",
  text: "#E9EAF0",
  textMuted: "#9AA0B2",
  textFaint: "#5C6070",
  indigo: "#7C93FF",
  indigoSoft: "rgba(124,147,255,0.14)",
  amber: "#F0B166",
  green: "#5FBF6B",
  red: "#F0705F",
};


const Icon = ({ name, size = 18, color = C.textMuted, className = "" }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", className };
  const paths = {
    chat: <path d="M4 4h16v12H8l-4 4z" />,
    doc: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chart: <path d="M4 20V10M12 20V4M20 20v-7" />,
    zap: <path d="M13 2 3 14h7l-1 8 11-14h-7z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="M6 6l12 12M18 6L6 18" />,
    send: <path d="M4 12l16-8-6 16-2-7-8-1z" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" /></>,
    logout: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></>,
    chevronLeft: <path d="M15 18l-6-6 6-6" />,
    chevronRight: <path d="M9 18l6-6-6-6" />,
    upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 20h16" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.24A9.6 9.6 0 0 1 12 4c5 0 9 4.5 10 8-0.4 1.2-1 2.4-1.9 3.4M6.1 6.1C4.2 7.4 2.8 9.4 2 12c1 3.5 5 8 10 8 1.2 0 2.3-.2 3.4-.6" /></>,
    bot: <><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M8 15c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5" /></>,
    file: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></>,
    mic: <><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" /><path d="M19 11a7 7 0 0 1-14 0" /><path d="M12 19v3" /></>,
    micOff: <><path d="M3 3l18 18" /><path d="M9 6a3 3 0 0 1 6 0v6c0 .3-.03.6-.1.9" /><path d="M12 15a3 3 0 0 0 3-3v-1" /><path d="M19 11a7 7 0 0 1-7 7 6.9 6.9 0 0 1-2.5-.47" /><path d="M5 11a7 7 0 0 0 1.3 4.1" /><path d="M12 19v3" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const NAV_ITEMS = [
  { key: "chat", label: "AI Chat", icon: "chat" },
  { key: "materials", label: "Study Materials", icon: "doc" },
  { key: "recent", label: "Recent PDFs", icon: "clock" },
  { key: "progress", label: "Progress", icon: "chart" },
  { key: "automations", label: "Automations", icon: "zap" },
];

const TOPICS = [
  { name: "Motion in a Straight Line", tone: "active" },
  { name: "Thermodynamics", tone: "weak" },
  { name: "Electrochemistry", tone: "weak" },
  { name: "Laws of Motion", tone: "strong" },
  { name: "Organic Chemistry Basics", tone: "strong" },
  
];
const TONE_COLOR = { active: C.indigo, weak: C.amber, strong: C.green };

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}



const SUBJECT_PROGRESS = [
  { name: "Physics", pct: 72 },
  { name: "Chemistry", pct: 54 },
  { name: "Mathematics", pct: 83 },
  { name: "Biology", pct: 40 },
];

// fallback preview answer when /api/chat isn't reachable — replace fetchAIAnswer with your real endpoint
const DEMO_ANSWER =
  "The information provided in the chat is based on your shared notes for Class 11 Physics Chapter 3: Motion in a Straight Line. Here are the concise short notes formatted for your study.\n\n" +
  "1. Basic Concepts\n\n" +
  "Position:\nLocation of an object relative to a reference point.\n\n" +
  "Distance:\nTotal path traveled. It is a scalar quantity (always positive or zero).\n\n" +
  "Displacement:\nChange in position. Formula: Delta x = x2 minus x1. It is a vector quantity (can be positive, negative, or zero).\n\n" +
  "2. Speed and Velocity\n\n" +
  "Speed:\nDistance divided by Time.\n\n" +
  "Velocity:\nDisplacement divided by Time (Delta x / Delta t).\n\n" +
  "3. Acceleration\n\n" +
  "Definition:\nRate of change of velocity with time.";

/* ---------------- answer formatter ---------------- */
function formatInline(text, key) {
  const parts = text.split(/(Formula:)/g);
  return parts.map((p, i) =>
    p === "Formula:" ? (
      <strong key={`${key}-${i}`} style={{ color: C.text }}>{p} </strong>
    ) : (
      <React.Fragment key={`${key}-${i}`}>{p}</React.Fragment>
    )
  );
}

function AnswerBody({ text }) {
  console.log("text",text)
  const textt =
  typeof text?.text === "string"
    ? text.text
    : text?.text?.answer || "";

const blocks = textt.trim().split(/\n\s*\n/);
  return (
    <div>
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return null;
        const first = lines[0];

        const heading = first.match(/^(\d+)\.\s+(.*)/);
        if (heading && lines.length === 1) {
          return (
            <div key={i} className={`flex items-center gap-2 ${i === 0 ? "mt-0" : "mt-5"} mb-2`}>
              <span className="text-xs font-serif w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.indigoSoft, color: C.indigo }}>
                {heading[1]}
              </span>
              <span className="font-serif text-base" style={{ color: C.text }}>{heading[2]}</span>
            </div>
          );
        }

        if (/:$/.test(first) && first.length < 40) {
          const label = first.slice(0, -1);
          const body = lines.slice(1).join(" ");
          return (
            <div key={i} className="flex items-start gap-2 mb-2.5 pl-1">
              <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: C.indigo }} />
              <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>
                <span className="font-medium" style={{ color: C.text }}>{label}: </span>
                {formatInline(body, i)}
              </p>
            </div>
          );
        }

        return (
          <p key={i} className="text-sm leading-relaxed mb-2.5" style={{ color: C.textMuted }}>
            {formatInline(lines.join(" "), i)}
          </p>
        );
      })}
    </div>
  );
}
// add this ABOVE your Dashboard component (same level as AnswerBody/TypingDots)

function QuizBody({ text }) {
  const raw =
    typeof text === "string" ? text : text?.answer || text?.text?.answer || text?.text || "";

  if (!raw || !raw.trim()) {
    return <p className="text-sm" style={{ color: C.textFaint }}>No data available.</p>;
  }

  // normalize + force every header/equation onto its own line, even if backend sent no breaks
  const clean = raw
    .replace(/\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\*\*(.+?)\*\*/g, "\n**$1**\n")
    .replace(/(\d+\s*[x×]\s*\d+\s*=\s*\d+)/g, "\n$1")
    .trim();

  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  // group into typed blocks; consecutive equations collapse into one grid
  const blocks = [];
  let eqBuf = [];
  const flush = () => { if (eqBuf.length) { blocks.push({ type: "eq", items: eqBuf }); eqBuf = []; } };

  lines.forEach((line) => {
    const eq = line.match(/^(\d+)\s*[x×]\s*(\d+)\s*=\s*(\d+)$/);
    if (eq) return eqBuf.push(eq);
    flush();

    const heading = line.match(/^\*\*(.+)\*\*$/) || line.match(/^Table of\s+\d+/i);
    if (heading) return blocks.push({ type: "heading", text: heading[1] || line });

    const q = line.match(/^(\d+)\.\s*(.+)/);
    if (q) return blocks.push({ type: "question", num: q[1], text: q[2] });

    const opt = line.match(/^([A-D])\)\s*(.+)/);
    if (opt) return blocks.push({ type: "option", letter: opt[1], text: opt[2] });

    const ans = line.match(/^Correct Answer:\s*(.+)/i);
    if (ans) return blocks.push({ type: "answer", text: ans[1] });

    const exp = line.match(/^Explanation:\s*(.+)/i);
    if (exp) return blocks.push({ type: "explain", text: exp[1] });

    blocks.push({ type: "text", text: line });
  });
  flush();

  return (
    <div className="space-y-3">
    
      {blocks.map((b, i) => {
        if (b.type === "heading")
          return <h4 key={i} className="font-serif text-base mt-4 mb-1 first:mt-0" style={{ color: C.text }}>{b.text}</h4>;

        if (b.type === "eq")
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {b.items.map(([, a, x, r], j) => (
                <div key={j} className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                  style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                  <span style={{ color: C.textMuted }}>{a} × {x}</span>
                  <span className="font-semibold" style={{ color: C.text }}>= {r}</span>
                </div>
              ))}
            </div>
          );

        if (b.type === "question")
          return (
            <div key={i} className="flex items-start gap-2 mt-4">
              <span className="text-xs font-serif w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: C.indigoSoft, color: C.indigo }}>{b.num}</span>
              <span className="text-sm font-medium pt-0.5" style={{ color: C.text }}>{b.text}</span>
            </div>
          );

        if (b.type === "option")
          return (
            <div key={i} className="text-sm pl-8" style={{ color: C.textMuted }}>
              <span className="font-medium">{b.letter})</span> {b.text}
            </div>
          );

        if (b.type === "answer")
          return (
            <div key={i} className="text-xs pl-8 flex items-center gap-1.5" style={{ color: C.green }}>
              <Icon name="check" size={12} color={C.green} /> Correct: {b.text}
            </div>
          );

        if (b.type === "explain")
          return <div key={i} className="text-xs pl-8" style={{ color: C.textFaint }}>{b.text}</div>;

        return <p key={i} className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{b.text}</p>;
      })}
    </div>
  );
}
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: C.textFaint, animation: `bounceDot 1s ${i * 0.15}s infinite ease-in-out` }} />
      ))}
    </div>
  );
}
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); 
async function fetchAIAnswer(message,selectedRecent) {
  console.log("Fetching AI answer for message:", message);
  
  try {
    const res = await axios.post(`${API_URL}/api/chatdata`,{ message,selectedRecent}, { withCredentials: true });
    const data = await res.data;
    console.log("daaa",data)
    if (data && data.success && data.aiResponse) return data.aiResponse;
    throw new Error("Unexpected response shape");
  } catch (err) {
 
    return DEMO_ANSWER;
  }
}

/* ---------------- circular progress ---------------- */
function CircleProgress({ percent = 0, size = 140, stroke = 10, color = C.indigo }) {
  const ref = useRef(null);
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: circumference - (percent / 100) * circumference, duration: 1.2, ease: "power3.out" }
    );
  }, [percent, circumference]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.borderSoft} strokeWidth={stroke} />
      <circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill={C.text} fontSize="22" fontFamily="serif">
        {percent}%
      </text>
    </svg>
  );
}

function ProgressBar({ name, pct }) {
  const barRef = useRef(null);
  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(barRef.current, { width: "0%" }, { width: `${pct}%`, duration: 1, ease: "power3.out" });
  }, [pct]);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span style={{ color: C.text }}>{name}</span>
        <span style={{ color: C.textFaint }}>{pct}%</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.borderSoft }}>
        <div ref={barRef} className="h-full rounded-full" style={{ background: C.indigo }} />
      </div>
    </div>
  );
}

function ViewTransition({ viewKey, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
  }, [viewKey]);
  return <div ref={ref}>{children}</div>;
}

/* ---------------- main component ---------------- */
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useContext(userContext) || {};
  const [activeView, setActiveView] = useState("chat");
  const [activeTopic, setActiveTopic] = useState(TOPICS[0].name);
  const [tempChat, setTempChat] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Ask me anything from your uploaded notes — I'll answer using your own material." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [selectedRecent, setSelectedRecent] = useState(null);
  const [listening, setListening] = useState(false);
  const [auto, setauto] = useState([])
console.log(auto)
  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);
  const profileRef = useRef(null);
  const pdfInputRef = useRef(null);
  const notesInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const micButtonRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.to(sidebarRef.current, { width: collapsed ? 84 : 288, duration: 0.4, ease: "power3.out" });
  }, [collapsed]);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // voice input setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  useEffect(() => {
    if (!micButtonRef.current) return;
    if (listening) {
      gsap.to(micButtonRef.current, { scale: 1.12, boxShadow: `0 0 0 8px ${C.red}22`, duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    } else {
      gsap.killTweensOf(micButtonRef.current);
      gsap.to(micButtonRef.current, { scale: 1, boxShadow: "0 0 0 0px transparent", duration: 0.3 });
    }
  }, [listening]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input isn't supported in this browser.");
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput("");
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const pulse = (el) => {
    if (!el) return;
    gsap.fromTo(el, { scale: 0.94 }, { scale: 1, duration: 0.35, ease: "back.out(3)" });
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const answer = await fetchAIAnswer(text,selectedRecent);
    setMessages((m) => [...m, { role: "ai", text: answer }]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
const [recentPdfs, setRecentPdfs] = useState([]);
const automationsRef = useRef(null);
const TASK_ICON = {
  quiz: "chart",
  summary: "doc",
  flashcards: "file",
  revision: "clock",
  study_reminder: "zap",
};
useEffect(() => {
  if (activeView !== "recent") return;
  axios
    .get(`${API_URL}/api/pdfandnots`, { withCredentials: true })
    .then(({ data }) => {
      const combined = [...data.pdfs, ...data.notes]
        .map((f) => ({
          id: f._id,
          name: f.originalName,
          type: f.fileType, // "pdf" or "notes"
          meta: `${f.subject || "Study material"} · ${timeAgo(f.createdAt)}`,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setRecentPdfs(combined);
    })
    .catch((err) => console.error("Failed to load recent files:", err));
}, [activeView]);
useEffect(() => {
  if (!automationsRef.current) return;
  gsap.fromTo(
    automationsRef.current.children,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power3.out" }
  );
}, [auto]);
useEffect(() => {
  if (activeView !== "automations") return;
  axios
    .get(`${API_URL}/api/getauto`, { withCredentials: true })
    .then(({ data }) => setauto(data.auto || []))
    .catch((err) => console.error("Failed to load automations:", err));
}, [activeView]);

const handleFilePicked = async (e, type) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;
  e.target.value = "";

  for (const f of files) {
    const tempId = `temp-${Date.now()}-${f.name}`;
    setUploads((u) => [{ id: tempId, name: f.name, type, status: "uploading" }, ...u]);

    const formData = new FormData();
    formData.append("file", f);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, { withCredentials: true });
    if(response.status === 201){
      toast.success(response.data.message)
    }
    const data = response.data
      setUploads((u) =>
        u.map((item) =>
          item.id === tempId
            ? { id: data.file._id, name: data.file.originalName, type: data.file.fileType, url: data.file.url, status: "ready" }
            : item
        )
      );
    } catch (err) {
      setUploads((u) => u.map((item) => (item.id === tempId ? { ...item, status: "error" } : item)));
    }
  }
};

  const useRecent = (item) => {
    setActiveTopic(item.name.replace(/\.[^.]+$/, ""));
    setActiveView("chat");
  };

  const initials = (user?.Fullname?.firstName?.[0] || "S") + (user?.Fullname?.lastName?.[0] || "");
const STATUS_COLOR = {
  pending: C.amber,
  processing: C.indigo,
  completed: C.green,
  failed: C.red,
  cancelled: C.textFaint,
};

const formatSchedule = (dateStr) => {
  if (!dateStr) return "No schedule set";
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const deleteAutomation = async (id) => {
  try {
   const res = await axios.delete(`${API_URL}/api/deletauto/${id}`, { withCredentials: true });
   if(res.status === 200){
    alert(res.data.message)
   }

    setauto((a) => a.filter((item) => item._id !== id));
  } catch (err) {
    console.error("Failed to delete automation:", err);
  }
};
const [resultModal, setResultModal] = useState(null); // holds the automation item whose result is open
const modalRef = useRef(null);

useEffect(() => {
  if (!resultModal || !modalRef.current) return;
  gsap.fromTo(
    modalRef.current,
    { opacity: 0, scale: 0.94, y: 12 },
    { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power3.out" }
  );
}, [resultModal]);

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: C.bg, color: C.text }}>
      <style>{`
        * { transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease; }
        @keyframes bounceDot { 0%,60%,100% { transform: translateY(0); opacity:.5 } 30% { transform: translateY(-4px); opacity:1 } }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 8px; }
      `}</style>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static inset-y-0 left-0 z-40 flex-shrink-0 flex flex-col overflow-hidden transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: C.bgSoft, borderRight: `1px solid ${C.borderSoft}`, width: 300}}
      >
        <div className="flex items-center justify-between h-16 px-5 flex-shrink-0" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: C.indigoSoft, border: `1px solid ${C.border}` }}>
              <span style={{ color: C.indigo }} className="text-xs font-serif font-semibold">S</span>
            </div>
            {!collapsed && <span className="font-serif text-base whitespace-nowrap">StudyPilot AI</span>}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="hidden md:flex p-1.5 rounded-md transition-colors hover:bg-white/5" onClick={() => setCollapsed((c) => !c)} aria-label="Collapse sidebar">
              <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={16} color={C.textMuted} />
            </button>
            <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
              <Icon name="close" size={17} color={C.textMuted} />
            </button>
          </div>
        </div>

        <div className="px-4 pt-3">
          <button
            onClick={(e) => { setTempChat((v) => !v); pulse(e.currentTarget); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all"
            style={{ background: tempChat ? C.indigoSoft : "transparent", color: tempChat ? C.text : C.textMuted, border: `1px solid ${tempChat ? C.indigo : C.borderSoft}` }}
          >
            <Icon name="eyeOff" size={15} color={tempChat ? C.indigo : C.textFaint} />
            {!collapsed && <span className="whitespace-nowrap">Temporary Chat {tempChat ? "· On" : ""}</span>}
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-1 flex-shrink-0">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={(e) => { setActiveView(item.key); pulse(e.currentTarget); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                style={{ background: active ? C.indigoSoft : "transparent", color: active ? C.text : C.textMuted }}
              >
                <Icon name={item.icon} size={16} color={active ? C.indigo : C.textFaint} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>
 <div className="text-xs px-6 mb-2" style={{ color: C.textFaint }}>Topics</div>
        {!collapsed && (
          <div className="px-4 pt-2  flex overflow-y-auto scrollbar-thin">
           
            <div className="flex flex-col gap-0.5 ">
              {TOPICS.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setActiveTopic(t.name); setActiveView("chat"); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={{ background: activeTopic === t.name ? C.surface : "transparent", color: activeTopic === t.name ? C.text : C.textMuted }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TONE_COLOR[t.tone] }} />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {!collapsed && <div className="flex-1" />}
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 md:hidden" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />}

      {/* ---------------- MAIN ---------------- */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-16 flex items-center justify-between gap-3 px-4 md:px-8 flex-shrink-0" style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden p-1.5" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
              <Icon name="menu" size={19} color={C.text} />
            </button>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {activeView === "chat" ? activeTopic : NAV_ITEMS.find((n) => n.key === activeView)?.label}
              </div>
              <div className="text-xs" style={{ color: C.textFaint }}>
                {activeView === "chat" ? (tempChat ? "Temporary chat" : "AI Chat") : "StudyPilot AI"}
              </div>
            </div>
          </div>

          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-transform hover:scale-105"
              style={{ background: C.indigoSoft, color: C.indigo, border: `1px solid ${C.border}` }}
            >
              {initials.trim() ? initials.toUpperCase() : <Icon name="user" size={15} color={C.indigo} />}
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl p-3 z-50" style={{ background: C.bgSoft, border: `1px solid ${C.border}`, boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}>
                <div className="text-sm font-medium truncate">
                  {user.Fullname?.firstName +" "+ user.Fullname?.lastName || "Student"}
                </div>
                <div className="text-xs truncate mt-0.5" style={{ color: C.textFaint }}>{user?.email || "student@studypilot.ai"}</div>
                <div className="h-px my-3" style={{ background: C.borderSoft }} />
                <button
                  onClick={() => logout && logout()}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                  style={{ color: C.red }}
                >
                  <Icon name="logout" size={15} color={C.red} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- CHAT VIEW ---------------- */}
        {activeView === "chat" && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-8">
              <div className="max-w-3xl mx-auto flex flex-col gap-8">
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm" style={{ background: C.indigoSoft, color: C.text }}>
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.indigoSoft }}>
                          <Icon name="bot" size={12} color={C.indigo} />
                        </div>
                        <span className="text-xs" style={{ color: C.textFaint }}>StudyPilot AI</span>
                      </div>
                      <AnswerBody text={m} />
                    </div>
                  )
                )}

                {loading && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: C.indigoSoft }}>
                      <Icon name="bot" size={12} color={C.indigo} />
                    </div>
                    <TypingDots />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 px-4 md:px-10 pb-6 pt-2">
              <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-2xl p-2" style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}>
                <button
                  ref={micButtonRef}
                  onClick={toggleVoice}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors active:scale-90"
                  style={{ background: listening ? `${C.red}22` : "transparent", border: `1px solid ${listening ? C.red : C.borderSoft}` }}
                  aria-label="Voice input"
                >
                  <Icon name={listening ? "micOff" : "mic"} size={16} color={listening ? C.red : C.textMuted} />
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={listening ? "Listening..." : "Ask something from your notes..."}
                  rows={1}
                  className="flex-1 resize-none bg-transparent outline-none text-sm px-2 py-2.5 max-h-32"
                  style={{ color: C.text }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 disabled:opacity-40"
                  style={{ background: C.indigo }}
                  aria-label="Send message"
                >
                  <Icon name="send" size={16} color="#0A0A0D" />
                </button>
              </div>
              <div className="text-xs text-center mt-2" style={{ color: C.textFaint }}>
                StudyPilot can make mistakes — check important facts against your original notes.
              </div>
            </div>
          </>
        )}

        {/* ---------------- MATERIALS VIEW ---------------- */}
        {activeView === "materials" && (
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-8">
            <ViewTransition viewKey="materials">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-2xl mb-6">Study Materials</h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <input ref={pdfInputRef} type="file" accept="application/pdf" hidden onChange={(e) => handleFilePicked(e, "pdf")} />
                  <button
                    onClick={() => pdfInputRef.current?.click()}
                    className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center transition-all hover:bg-white/[0.02] active:scale-[0.98]"
                    style={{ border: `1.5px dashed ${C.border}` }}
                  >
                    <Icon name="upload" size={24} color={C.indigo} />
                    <div className="text-sm font-medium">Upload PDF</div>
                    <div className="text-xs" style={{ color: C.textFaint }}>Chapters, papers, textbooks</div>
                  </button>

                  <input ref={notesInputRef} type="file" accept=".txt,.doc,.docx,.pdf,image/*" hidden onChange={(e) => handleFilePicked(e, "notes")} />
                  <button
                    onClick={() => notesInputRef.current?.click()}
                    className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center transition-all hover:bg-white/[0.02] active:scale-[0.98]"
                    style={{ border: `1.5px dashed ${C.border}` }}
                  >
                    <Icon name="doc" size={24} color={C.amber} />
                    <div className="text-sm font-medium">Upload Notes</div>
                    <div className="text-xs" style={{ color: C.textFaint }}>Handwritten or typed notes</div>
                  </button>
                </div>

                <div className="text-sm mb-3" style={{ color: C.textFaint }}>Uploaded ({uploads.length})</div>
         <div className="flex flex-col gap-2">
  {uploads.length === 0 && recentPdfs.length === 0 && (
    <div className="text-sm" style={{ color: C.textFaint }}>Nothing uploaded yet.</div>
  )}

  {[...uploads, ...recentPdfs].map((f) => (
    <div
      key={f.id}
      className="flex items-center justify-between px-4 py-3 rounded-xl"
      style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon name="file" size={15} color={f.type === "pdf" ? C.indigo : C.amber} />
        <div className="min-w-0">
          <div className="text-sm truncate">{f.name}</div>
          <div className="text-xs" style={{ color: C.textFaint }}>
            {f.status === "uploading" ? "Uploading..." : f.status === "error" ? "Upload failed" : f.meta}
          </div>
        </div>
      </div>

      {f.status === "uploading" && <TypingDots />}
    </div>
  ))}
</div>
              </div>
            </ViewTransition>
          </div>
        )}

        {/* ---------------- RECENT PDFs VIEW ---------------- */}
        {activeView === "recent" && (
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-8">
            <ViewTransition viewKey="recent">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-2xl mb-6">Recent PDFs and Notes</h2>
                <div className="flex flex-col gap-2">
                  {recentPdfs.map((item) => {
                    const isSelected = selectedRecent === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedRecent(item.id)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all"
                        style={{ background: isSelected ? C.indigoSoft : C.surface, border: `1px solid ${isSelected ? C.indigo : C.borderSoft}` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon name="file" size={16} color={isSelected ? C.indigo : C.textFaint} />
                          <div className="min-w-0">
                            <div className="text-sm truncate">{item.name}</div>
                            <div className="text-xs" style={{ color: C.textFaint }}>{item.meta}</div>
                          </div>
                        </div>
                        {isSelected ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); useRecent(item); }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-transform active:scale-95"
                            style={{ background: C.indigo, color: "#0A0A0D" }}
                          >
                            <Icon name="check" size={13} color="#0A0A0D" /> Use this
                          </button>
                        ) : (
                          <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ border: `1.5px solid ${C.border}` }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </ViewTransition>
          </div>
        )}

        {/* ---------------- PROGRESS VIEW ---------------- */}
        {activeView === "progress" && (
          <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-8">
            <ViewTransition viewKey="progress">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-2xl mb-6">Your Progress</h2>
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="rounded-2xl p-6 flex flex-col items-center justify-center" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                    <CircleProgress percent={62} />
                    <div className="text-sm mt-3" style={{ color: C.textMuted }}>Overall completion</div>
                  </div>
                  <div className="rounded-2xl p-6" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                    <div className="text-sm mb-4" style={{ color: C.textFaint }}>Subject-wise progress</div>
                    {SUBJECT_PROGRESS.map((s) => (
                      <ProgressBar key={s.name} name={s.name} pct={s.pct} />
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Chapters reviewed", value: "18 / 30" },
                    { label: "Weak topics flagged", value: "3" },
                    { label: "Study streak", value: "6 days" },
                  ].map((d) => (
                    <div key={d.label} className="rounded-xl p-4" style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}>
                      <div className="text-xs mb-1.5" style={{ color: C.textFaint }}>{d.label}</div>
                      <div className="font-serif text-xl">{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ViewTransition>
          </div>
        )}

        {/* ---------------- AUTOMATIONS VIEW ---------------- */}
    {activeView === "automations" && (
  <div className="flex-1 overflow-y-auto scrollbar-thin px-4 md:px-10 py-8">
    <ViewTransition viewKey="automations">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.indigoSoft }}>
            <Icon name="zap" size={22} color={C.amber} />
          </div>
          <h2 className="font-serif text-2xl mb-2">Automations</h2>
          <p className="text-sm" style={{ color: C.textMuted }}>
            Your scheduled quizzes, summaries and revision reminders.
          </p>
        </div>

        {auto.length === 0 && (
          <div className="text-sm text-center" style={{ color: C.textFaint }}>
            No automations set up yet.
          </div>
        )}

        <div ref={automationsRef} className="flex flex-col gap-3">
          {auto.map((item) => (
            <div
              key={item._id}
              className="flex items-start justify-between gap-3 px-4 py-4 rounded-xl"
              style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.indigoSoft }}>
                  <Icon name={TASK_ICON[item.task] || "zap"} size={16} color={C.indigo} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  {item.description && (
                    <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>{item.description}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs" style={{ color: C.textFaint }}>
                    {item.subject && <span>{item.subject}{item.chapter ? ` · ${item.chapter}` : ""}</span>}
                    <span>{formatSchedule(item.scheduledAt)}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLOR[item.status]}22`, color: STATUS_COLOR[item.status] }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteAutomation(item._id)}
                className="p-1.5 rounded-lg flex-shrink-0 transition-transform active:scale-90"
                aria-label="Delete automation"
              >
                <Icon name="trash" size={15} color={C.textFaint} />
              </button>
              {item.status === "completed" && item.result && (
  <button
    onClick={() => setResultModal(item)}
    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-transform active:scale-95"
    style={{ background: C.green + "22", color: C.green, border: `1px solid ${C.green}55` }}
  >
    <Icon name="check" size={13} color={C.green} /> Answer Ready
  </button>
)}

            </div>
          ))}
        </div>
      </div>
    </ViewTransition>
  </div>
)}{resultModal && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.6)" }}
    onClick={() => setResultModal(null)}
  >
    <div
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin rounded-2xl p-6"
      style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-xs mb-1" style={{ color: C.textFaint }}>
            {resultModal.subject}{resultModal.chapter ? ` · ${resultModal.chapter}` : ""}
          </div>
          <h3 className="font-serif text-xl">{resultModal.name}</h3>
        </div>
        <button onClick={() => setResultModal(null)} className="p-1.5 rounded-lg flex-shrink-0" aria-label="Close">
          <Icon name="close" size={18} color={C.textMuted} />
        </button>
      </div>

      <QuizBody text={resultModal.result} />
    </div>
  </div>
)}
      </main>
    </div>
  );
}