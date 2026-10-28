import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Usercontext from "../Usercontext.jsx";
import {toast} from 'react-toastify'



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
    danger: "#F0766B",
    dangerSoft: "rgba(240,118,107,0.12)",
    success: "#6FCF97",
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
    danger: "#C6483C",
    dangerSoft: "rgba(198,72,60,0.08)",
    success: "#2F9E5C",
    dotColor: "rgba(10,10,25,0.06)",
  },
};

const GLYPHS = [
  { s: "∑", top: "10%", left: "6%", size: "38px", dur: "7.5s", delay: "0s" },
  { s: "π", top: "76%", left: "9%", size: "42px", dur: "8.5s", delay: "1.1s" },
  { s: "∫", top: "16%", left: "89%", size: "36px", dur: "7s", delay: "0.6s" },
  { s: "√", top: "82%", left: "88%", size: "30px", dur: "8s", delay: "1.8s" },
  { s: "e=mc²", top: "48%", left: "3%", size: "15px", dur: "9s", delay: "0.3s" },
  { s: "Δ", top: "6%", left: "48%", size: "24px", dur: "6.5s", delay: "1.4s" },
  { s: "%", top: "90%", left: "46%", size: "22px", dur: "7s", delay: "0.9s" },
  { s: "📖", top: "30%", left: "94%", size: "26px", dur: "8s", delay: "0.4s" },
];

/* ---------------- icons (same stroke style as landing page) ---------------- */
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-3.8 5-5 7.5-5s6 1.2 7.5 5" /></>,
    mail: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="M4 6.5l8 6 8-6" /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /></>,
    eye: <><path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.7A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.6 15.6 0 0 1-3.3 4.1M6.6 6.6C4 8.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.6 9.6 0 0 0 4-.85" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 7" />,
    arrowRight: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
    close: <><path d="M6 6l12 12M18 6L6 18" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />,
    alert: <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>,
    spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
  };
  return <svg {...common}>{paths[name]}</svg>;
};
const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); 
/* ---------------- mock backend — swap these with real API calls ---------------- */
async function apiSendOtp(email, firstName, lastName) {
  console.log("Sending OTP to:", email);

  const res = await axios.post(`${API_URL}/api/email`, { firstName, lastName, email }, { withCredentials: true });

  return res;
}

async function apiVerifyOtp(email, otp) {
 const res = await axios.post(`${API_URL}/api/verify-otp`,{email,otp}, { withCredentials: true });

  return res;
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
    const onMove = (e) => { moveDot(e.clientX); moveDotY(e.clientY); moveRing(e.clientX); moveRingY(e.clientY); };
    const onOver = (e) => { if (e.target.closest("a,button,input,[data-cursor-hover]")) gsap.to(ring, { scale: 1.8, duration: 0.25 }); };
    const onOut = (e) => { if (e.target.closest("a,button,input,[data-cursor-hover]")) gsap.to(ring, { scale: 1, duration: 0.25 }); };
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

/* ---------------- 3D tilt wrapper (mouse desktop, touch-drag mobile) ---------------- */
function TiltCard({ children, className = "", style = {}, strength = 6 }) {
  const ref = useRef(null);
  const tiltFromPoint = useCallback((clientX, clientY) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, { rotateX: py * -strength, rotateY: px * strength, transformPerspective: 1000, duration: 0.4, ease: "power2.out" });
  }, [strength]);
  const handleMove = useCallback((e) => tiltFromPoint(e.clientX, e.clientY), [tiltFromPoint]);
  const handleLeave = useCallback(() => { if (ref.current) gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" }); }, []);
  const handleTouchMove = useCallback((e) => { if (e.touches && e.touches[0]) tiltFromPoint(e.touches[0].clientX, e.touches[0].clientY); }, [tiltFromPoint]);
  return (
    <div ref={ref} className={className} style={{ ...style, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMove} onMouseLeave={handleLeave} onTouchMove={handleTouchMove} onTouchEnd={handleLeave} onTouchCancel={handleLeave}>
      {children}
    </div>
  );
}

/* ---------------- background: dot grid + glow blobs + floating study glyphs ---------------- */
function AuthBackdrop({ C }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${C.dotColor} 1px, transparent 1px)`, backgroundSize: "26px 26px" }} />
      <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full" style={{ background: C.indigo, opacity: 0.16, filter: "blur(120px)" }} />
      <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full" style={{ background: C.amber, opacity: 0.12, filter: "blur(120px)" }} />
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="float-glyph absolute font-serif"
          style={{ top: g.top, left: g.left, fontSize: g.size, color: C.text, opacity: C.mode === "dark" ? 0.09 : 0.14, animationDuration: g.dur, animationDelay: g.delay }}
        >
          {g.s}
        </span>
      ))}
    </div>
  );
}

/* ---------------- OTP input boxes ---------------- */
function OtpBoxes({ values, onChange, C, error, shakeKey }) {
  const refs = useRef([]);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!error || !wrapRef.current) return;
    gsap.fromTo(wrapRef.current, { x: -8 }, { x: 0, duration: 0.45, ease: "elastic.out(1.2, 0.35)" });
  }, [shakeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const setDigit = (i, val) => {
    const clean = val.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[i] = clean;
    onChange(next);
    if (clean && refs.current[i + 1]) refs.current[i + 1].focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !values[i] && refs.current[i - 1]) refs.current[i - 1].focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, values.length);
    if (!text) return;
    e.preventDefault();
    const next = [...values];
    for (let i = 0; i < values.length; i++) next[i] = text[i] || "";
    onChange(next);
    const lastFilled = Math.min(text.length, values.length) - 1;
    if (refs.current[lastFilled]) refs.current[lastFilled].focus();
  };

  return (
    <div ref={wrapRef} className="flex justify-center gap-2 sm:gap-3">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={v}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          data-cursor-hover
          className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-medium rounded-xl outline-none transition-colors"
          style={{
            background: C.surface,
            color: C.text,
            border: `1.5px solid ${error ? C.danger : v ? C.indigo : C.border}`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- field ---------------- */
function Field({ label, icon, error, C, children }) {
  return (
    <label className="block">
      <span className="block text-xs mb-1.5" style={{ color: C.textFaint }}>{label}</span>
      <div
        className="flex items-center gap-2.5 rounded-xl px-3.5 transition-colors"
        style={{ background: C.surface, border: `1.5px solid ${error ? C.danger : C.border}` }}
      >
        <Icon name={icon} size={17} color={C.textFaint} />
        {children}
      </div>
      {error && <span className="block text-xs mt-1.5" style={{ color: C.danger }}>{error}</span>}
    </label>
  );
}

/* ================================================================== */

export default function Login() {
  const [theme, setTheme] = useState("dark");
  const [isTouch, setIsTouch] = useState(false);
  const C = THEMES[theme];

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const cardRef = useRef(null);
  const modalRef = useRef(null);
  const toastTimer = useRef(null);
const navigat = useNavigate()
  useEffect(() => { setIsTouch(window.matchMedia("(pointer: coarse)").matches); }, []);

  useEffect(() => {
    if (cardRef.current) gsap.fromTo(cardRef.current, { opacity: 0, y: 24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!otpOpen) return;
    if (modalRef.current) gsap.fromTo(modalRef.current, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" });
  }, [otpOpen]);

  useEffect(() => {
    if (!otpOpen || resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [otpOpen, resendTimer]);

  const showToast = (message, kind = "info") => {
    setToast({ message, kind });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (ev) => {
  
    ev.preventDefault();
   
    try {
      const res = await apiSendOtp(form.email,form.firstName,form.lastName);
   console.log(res.status,res.data.message)
      if (res.status === 200) {
       toast.success(res.data.message);
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpError("");
        setResendTimer(30);
        setOtpOpen(true);
      } else if(res.status === 201){
           toast.success(res.data.message);
        navigat("/dashboard");
     
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    const res = await apiSendOtp(form.email);
    if (res.success) {
      showToast(res.message, "success");
      setResendTimer(30);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      setOtpError("Enter all 6 digits");
      setShakeKey((k) => k + 1);
      return;
    }
    setIsVerifying(true);
    setOtpError("");
    const res = await apiVerifyOtp(form.email, otp);
    setIsVerifying(false);
    if (res.status === 200) {
      setVerified(true);
      toast.success(req.data.message)
      navigat("/dashboard");
      setTimeout(() => setOtpOpen(false), 1400);
    } else {
      toast.error(res.data.message);
      setShakeKey((k) => k + 1);
    }
  };

  const closeModal = () => { if (!isVerifying) setOtpOpen(false); };

  return (
    <div style={{ background: C.bg, color: C.text, cursor: isTouch ? "auto" : "none" }} className="min-h-screen font-sans antialiased relative transition-colors duration-500 flex items-center justify-center p-4 sm:p-6">
      <style>{`
        @keyframes floatY { 0%,100% { transform: translateY(0px);} 50% { transform: translateY(-16px);} }
        .float-glyph { animation-name: floatY; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1;} 100% { transform: scale(1); } }
        .pop-in { animation: popIn 0.4s ease-out; }
        @keyframes shineSweep { 0% { transform: translateX(-120%) skewX(-15deg); } 100% { transform: translateX(220%) skewX(-15deg); } }
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after {
          content: ""; position: absolute; top: 0; left: 0; width: 40%; height: 100%;
          background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: translateX(-120%) skewX(-15deg);
        }
        .btn-shine:hover::after, .btn-shine:active::after { animation: shineSweep 0.9s ease forwards; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
        @media (pointer: coarse) { body, a, button, input { cursor: auto !important; } }
      `}</style>

      <AuthBackdrop C={C} />
      {!isTouch && <CustomCursor color={C.indigo} />}

      {/* theme toggle */}
      <button
        data-cursor-hover
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
        aria-label="Toggle theme"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} size={16} color={C.textMuted} />
      </button>

      {/* toast */}
      {toast && (
        <div
          className="pop-in fixed top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg max-w-[90vw]"
          style={{
            background: toast.kind === "error" ? C.dangerSoft : C.indigoSoft,
            border: `1px solid ${toast.kind === "error" ? C.danger : C.indigo}`,
            color: C.text,
          }}
        >
          <Icon name={toast.kind === "error" ? "alert" : "check"} size={15} color={toast.kind === "error" ? C.danger : C.indigo} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* card */}
      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        <div
          className="absolute -inset-3 rounded-[28px] pointer-events-none hidden sm:block"
          style={{ background: `linear-gradient(135deg, ${C.indigo}, transparent 55%, ${C.amber})`, filter: "blur(30px)", opacity: 0.35 }}
        />
        <TiltCard style={{ background: C.bgSoft, border: `1px solid ${C.border}` }} className="relative rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.indigoSoft }}>
              <span style={{ color: C.indigo }} className="text-xs font-serif font-semibold">S</span>
            </span>
            <span className="font-serif text-base tracking-tight">StudyPilot AI</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl mt-4 mb-1.5 leading-tight">Create your account</h1>
          <p className="text-sm mb-7" style={{ color: C.textMuted }}>Your personal AI study workspace, ready in under a minute.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Field label="First name" icon="user" error={errors.firstName} C={C}>
                <input
                  data-cursor-hover
                  value={form.firstName}
                  onChange={update("firstName")}
                  placeholder="Aditi"
                  className="w-full bg-transparent outline-none text-sm py-3"
                  style={{ color: C.text }}
                />
              </Field>
              <Field label="Last name" icon="user" error={errors.lastName} C={C}>
                <input
                  data-cursor-hover
                  value={form.lastName}
                  onChange={update("lastName")}
                  placeholder="Sharma"
                  className="w-full bg-transparent outline-none text-sm py-3"
                  style={{ color: C.text }}
                />
              </Field>
            </div>

            <div className="mb-4">
              <Field label="Email" icon="mail" error={errors.email} C={C}>
                <input
                  data-cursor-hover
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="w-full bg-transparent outline-none text-sm py-3"
                  style={{ color: C.text }}
                />
              </Field>
            </div>

            <button
              onClick={() => console.log("clicked")}
              type="submit"
              data-cursor-hover
              disabled={isSubmitting}
              className="btn-shine w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
              style={{ background: C.text, color: C.bg, boxShadow: `0 10px 30px ${C.indigoSoft}` }}
            >
              {isSubmitting ? (
                <>
                  <span className="spin"><Icon name="spinner" size={16} color={C.bg} /></span>
                  Sending code…
                </>
              ) : (
                <>
                  Continue <Icon name="arrowRight" size={16} color={C.bg} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: C.textFaint }}>
            Already have an account? <a href="#" data-cursor-hover style={{ color: C.indigo }}>Log in</a>
          </p>
        </TiltCard>
      </div>

      {/* OTP modal */}
      {otpOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} onClick={closeModal}>
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl p-6 sm:p-7"
            style={{ background: C.bgSoft, border: `1px solid ${C.border}`, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" }}
          >
            <button data-cursor-hover onClick={closeModal} className="absolute top-4 right-4 opacity-70 hover:opacity-100" aria-label="Close">
              <Icon name="close" size={16} color={C.textFaint} />
            </button>

            {!verified ? (
              <>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ background: C.indigoSoft }}>
                  <Icon name="mail" size={19} color={C.indigo} />
                </div>
                <h2 className="font-serif text-xl mb-1.5">Verify your email</h2>
                <p className="text-sm mb-6" style={{ color: C.textMuted }}>
                  Enter the 6-digit code sent to <span style={{ color: C.text }}>{form.email}</span>
                </p>

                <OtpBoxes values={otpDigits} onChange={setOtpDigits} C={C} error={otpError} shakeKey={shakeKey} />
                {otpError && <p className="text-center text-xs mt-3" style={{ color: C.danger }}>{otpError}</p>}
                <p className="text-center text-xs mt-3" style={{ color: C.textFaint }}>Demo code: 123456</p>

                <button
                  data-cursor-hover
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="btn-shine w-full mt-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
                  style={{ background: C.text, color: C.bg }}
                >
                  {isVerifying ? (
                    <>
                      <span className="spin"><Icon name="spinner" size={16} color={C.bg} /></span>
                      Verifying…
                    </>
                  ) : (
                    "Verify & continue"
                  )}
                </button>

                <p className="text-center text-xs mt-4" style={{ color: C.textFaint }}>
                  Didn't get it?{" "}
                  {resendTimer > 0 ? (
                    <span>Resend in {resendTimer}s</span>
                  ) : (
                    <button data-cursor-hover onClick={handleResend} style={{ color: C.indigo }}>Resend code</button>
                  )}
                </p>
              </>
            ) : (
              <div className="pop-in text-center py-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${C.success}22` }}>
                  <Icon name="check" size={24} color={C.success} />
                </div>
                <h2 className="font-serif text-xl mb-1.5">Email verified</h2>
                <p className="text-sm" style={{ color: C.textMuted }}>Welcome to StudyPilot AI, {form.firstName || "there"}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}