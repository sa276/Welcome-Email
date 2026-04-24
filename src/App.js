import { useState, useRef, useEffect } from "react";
import { toPng } from "https://esm.sh/html-to-image@1.11.11";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Sora:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .we-root {
    min-height: 100vh;
    background: #07070F;
    background-image:
      radial-gradient(ellipse 80% 60% at 15% 40%, rgba(196,163,90,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 85% 15%, rgba(100,80,180,0.06) 0%, transparent 60%);
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ── TOP BAR ── */
  .we-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 36px;
    border-bottom: 1px solid rgba(196,163,90,0.1);
    flex-shrink: 0;
    background: rgba(7,7,15,0.8);
    backdrop-filter: blur(12px);
  }
  .we-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    font-weight: 600;
    color: #EEE9E0;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .we-logo-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C4A35A;
  }
  .we-logo span { color: #C4A35A; }
  .we-live-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 500;
    color: #C4A35A;
    border: 1px solid rgba(196,163,90,0.25);
    padding: 5px 13px;
    border-radius: 20px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }
  .we-pulse {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #C4A35A;
    animation: wePulse 2s ease-in-out infinite;
  }
  @keyframes wePulse {
    0%,100% { opacity:1; transform:scale(1); }
    50% { opacity:0.4; transform:scale(0.7); }
  }

  /* ── LAYOUT ── */
  .we-body { display: flex; flex: 1; overflow: hidden; height: calc(100vh - 57px); }

  /* ── FORM PANEL ── */
  .we-form-panel {
    width: 400px;
    min-width: 360px;
    flex-shrink: 0;
    overflow-y: auto;
    padding: 28px 28px 36px;
    border-right: 1px solid rgba(196,163,90,0.09);
    scrollbar-width: thin;
    scrollbar-color: rgba(196,163,90,0.15) transparent;
  }
  .we-form-panel::-webkit-scrollbar { width: 3px; }
  .we-form-panel::-webkit-scrollbar-thumb { background: rgba(196,163,90,0.15); border-radius: 2px; }

  .we-form-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    color: #EEE9E0;
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .we-form-sub {
    font-size: 12px;
    font-weight: 300;
    color: #4E4E68;
    margin-bottom: 26px;
    letter-spacing: 0.02em;
  }

  /* photo upload */
  .we-photo-zone {
    border: 1.5px dashed rgba(196,163,90,0.25);
    border-radius: 14px;
    padding: 20px;
    cursor: pointer;
    transition: border-color 0.25s, background 0.25s;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(196,163,90,0.018);
  }
  .we-photo-zone:hover, .we-photo-zone.drag { border-color: rgba(196,163,90,0.55); background: rgba(196,163,90,0.04); }
  .we-upload-circle {
    width: 54px; height: 54px;
    border-radius: 50%;
    background: rgba(196,163,90,0.08);
    border: 1px solid rgba(196,163,90,0.18);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }
  .we-upload-circle img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .we-upload-text-title { font-size: 13px; font-weight: 500; color: #C4A35A; margin-bottom: 3px; }
  .we-upload-text-sub { font-size: 11px; color: #3E3E56; }

  /* fields */
  .we-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .we-field { margin-bottom: 14px; }
  .we-label {
    display: block;
    font-size: 10px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: #5A5A78;
    margin-bottom: 7px;
  }
  .we-input {
    width: 100%;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(196,163,90,0.13);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    font-weight: 300;
    color: #EEE9E0;
    outline: none;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
    -webkit-appearance: none;
  }
  .we-input::placeholder { color: #2E2E44; }
  .we-input:focus {
    border-color: rgba(196,163,90,0.45);
    background: rgba(196,163,90,0.035);
    box-shadow: 0 0 0 3px rgba(196,163,90,0.07);
  }
  textarea.we-input { resize: none; height: 72px; line-height: 1.65; }
  input[type=date].we-input::-webkit-calendar-picker-indicator { filter: invert(0.3) sepia(1) saturate(2) hue-rotate(5deg); opacity: 0.5; cursor: pointer; }

  .we-section-divider {
    height: 1px;
    background: rgba(196,163,90,0.08);
    margin: 18px 0;
  }
  .we-section-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
    color: #3A3A54; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .we-section-label::after { content:''; flex:1; height:1px; background: rgba(196,163,90,0.07); }

  .we-send-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(110deg, #A8893A 0%, #C4A35A 30%, #E4C97A 65%, #C4A35A 100%);
    background-size: 220% 100%;
    border: none;
    border-radius: 12px;
    font-family: 'Sora', sans-serif;
    font-size: 13px; font-weight: 600;
    color: #07070F;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: background-position 0.4s ease, transform 0.2s, box-shadow 0.3s;
    margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .we-send-btn:hover {
    background-position: 100% 0;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(196,163,90,0.25);
  }
  .we-select {
    width: 100%;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(196,163,90,0.13);
    border-radius: 10px;
    padding: 10px 36px 10px 14px;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    font-weight: 300;
    color: #EEE9E0;
    outline: none;
    transition: border-color 0.22s, background 0.22s, box-shadow 0.22s;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C4A35A' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  .we-select:focus {
    border-color: rgba(196,163,90,0.45);
    background-color: rgba(196,163,90,0.035);
    box-shadow: 0 0 0 3px rgba(196,163,90,0.07);
  }
  .we-select option { background: #0F0F1C; color: #EEE9E0; }

  .we-send-btn.downloading {
    opacity: 0.75;
    cursor: not-allowed;
  }

  /* ── PREVIEW PANEL ── */
  .we-preview-panel {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px 40px;
    background: #050509;
    scrollbar-width: thin;
    scrollbar-color: rgba(196,163,90,0.08) transparent;
  }
  .we-preview-panel::-webkit-scrollbar { width: 3px; }
  .we-preview-panel::-webkit-scrollbar-thumb { background: rgba(196,163,90,0.08); }

  .we-preview-label {
    font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
    color: #3E3E58;
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px;
  }

  /* ── EMAIL CARD ── */
  .we-email {
    max-width: 540px;
    margin: 0 auto;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  }

  .we-email-chrome {
    background: #0C0C18;
    padding: 11px 16px;
    display: flex; align-items: center; gap: 7px;
  }
  .wc-dot { width:9px; height:9px; border-radius:50%; }
  .wc-red { background:#FF5F57; }
  .wc-yellow { background:#FEBC2E; }
  .wc-green { background:#28C840; }
  .wc-bar {
    flex:1; background: rgba(255,255,255,0.05); border-radius: 4px;
    padding: 4px 10px; font-size: 10px; color: #3A3A58; text-align: center;
    font-family: 'Sora', sans-serif;
  }

  /* email hero */
  .we-email-hero {
    background: #0C0C1A;
    padding: 36px 36px 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .we-email-hero::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 25% 70%, rgba(196,163,90,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 75% 25%, rgba(100,80,190,0.07) 0%, transparent 55%);
    pointer-events: none;
  }
  .we-email-eyebrow {
    position: relative;
    display: flex; align-items: center; gap: 8px;
    width: fit-content; margin: 0 auto 22px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    color: #C4A35A;
    border: 1px solid rgba(196,163,90,0.25);
    padding: 5px 14px; border-radius: 20px;
  }
  .we-email-eyebrow-star { font-size: 8px; }
  .we-photo-ring {
    width: 110px; height: 110px;
    border-radius: 50%;
    background: conic-gradient(#C4A35A 0%, #8B6FBE 40%, #C4A35A 70%, #E8C97D 100%);
    padding: 2.5px;
    display: inline-block;
    position: relative;
  }
  .we-photo-inner {
    width: 100%; height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: #14142A;
    display: flex; align-items: center; justify-content: center;
  }
  .we-photo-inner img { width:100%; height:100%; object-fit:cover; }
  .we-photo-initials {
    font-family: 'Cormorant Garamond', serif;
    font-size: 36px; font-weight: 600; color: #C4A35A;
  }
  .we-email-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px; font-weight: 600; color: #EEE9E0;
    margin-top: 16px; margin-bottom: 6px;
    line-height: 1.15; position: relative;
  }
  .we-email-desig {
    font-size: 12px; font-weight: 500; color: #C4A35A;
    letter-spacing: 0.08em; margin-bottom: 10px;
    position: relative; text-transform: uppercase;
  }
  .we-email-team {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; color: #7A6E52;
    border: 1px solid rgba(196,163,90,0.15);
    background: rgba(196,163,90,0.06);
    padding: 4px 14px; border-radius: 20px;
    margin-bottom: 30px; position: relative;
    letter-spacing: 0.04em;
  }
  .we-wave {
    display: block; width: 100%;
    line-height: 0; position: relative; margin-bottom: -1px;
  }

  /* email body */
  .we-email-body { background: #F4F1EA; padding: 30px 34px 24px; }
  .we-email-greeting {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: #18182A;
    margin-bottom: 10px; line-height: 1.3;
  }
  .we-email-intro {
    font-size: 13px; color: #5A5668; line-height: 1.85;
    margin-bottom: 22px; font-weight: 300;
  }
  .we-email-intro strong { color: #18182A; font-weight: 500; }

  .we-chips {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 10px; margin-bottom: 20px;
  }
  .we-chip {
    background: white;
    border-radius: 12px; padding: 12px 10px;
    text-align: center;
    box-shadow: 0 1px 8px rgba(0,0,0,0.07);
  }
  .we-chip-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #9B98A8; margin-bottom: 4px; }
  .we-chip-val { font-size: 11px; font-weight: 600; color: #18182A; line-height: 1.3; }

  .we-icard {
    background: white;
    border-radius: 12px; padding: 16px 18px;
    margin-bottom: 12px;
    border-left: 2.5px solid #C4A35A;
    box-shadow: 0 1px 10px rgba(0,0,0,0.06);
  }
  .we-icard-lbl {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: #C4A35A; margin-bottom: 5px;
    display: flex; align-items: center; gap: 6px;
  }
  .we-icard-val { font-size: 13px; color: #18182A; line-height: 1.65; }

  .we-icard.accent-purple { border-left-color: #8B6FBE; }
  .we-icard.accent-purple .we-icard-lbl { color: #8B6FBE; }

  .we-funfact {
    background: #0C0C1A;
    border-radius: 12px; padding: 20px 22px;
    margin-bottom: 12px; position: relative; overflow: hidden;
  }
  .we-funfact::before {
    content: '"';
    position: absolute; top: -8px; left: 12px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px; color: rgba(196,163,90,0.12); line-height: 1;
    pointer-events: none;
  }
  .we-funfact-lbl {
    font-size: 9px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: #C4A35A; margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px; position: relative;
  }
  .we-funfact-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-style: italic; color: #D8D4CC;
    line-height: 1.65; position: relative;
  }

  .we-divider { height: 1px; background: rgba(196,163,90,0.12); margin: 20px 0; }

  .we-email-closing {
    text-align: center; padding: 0 10px;
  }
  .we-closing-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px; font-weight: 600; color: #18182A;
    margin-bottom: 8px;
  }
  .we-closing-sub {
    font-size: 12px; color: #8A8799; line-height: 1.75;
  }

  /* email footer */
  .we-email-footer {
    background: #0C0C1A;
    padding: 24px 34px; text-align: center;
  }
  .we-footer-cta {
    display: inline-block;
    background: linear-gradient(110deg, #A8893A, #C4A35A, #E4C97A);
    color: #07070F;
    font-size: 12px; font-weight: 600;
    padding: 11px 26px; border-radius: 30px;
    text-decoration: none; letter-spacing: 0.05em; margin-bottom: 18px;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
  }
  .we-footer-line {
    width: 36px; height: 1px;
    background: rgba(196,163,90,0.18);
    margin: 0 auto 14px;
  }
  .we-footer-txt {
    font-size: 10px; color: #C4A35A; line-height: 1.7;
    font-family: 'Sora', sans-serif;
  }
`;

const ICON_USER = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const ICON_SEND = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ICON_HOBBY = "🎯";
const ICON_STAR = "✨";
const ICON_ZAP = "⚡";

function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || "??";
}

function formatDate(val) {
  if (!val) return "To be announced";
  const d = new Date(val + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function WelcomeEmailer() {
  const [d, setD] = useState({
    name: "", designation: "", team: "",
    hobbies: "", lookForward: "", funFact: "",
    startDate: "", city: "", superpower: "",
  });
  const [photo, setPhoto] = useState(null);
  const [drag, setDrag] = useState(false);
  const [sent, setSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileRef = useRef(null);
  const emailRef = useRef(null);

  const set = (k, v) => setD(p => ({ ...p, [k]: v }));

  const loadPhoto = file => {
    if (!file?.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = e => setPhoto(e.target.result);
    r.readAsDataURL(file);
  };

  const nm   = d.name         || "Your Name";
  const desig = d.designation || "Your Designation";
  const team  = d.team        || "Application Team";
  const hobbies = d.hobbies   || "Rock climbing, jazz piano, building retro computers";
  const lf    = d.lookForward || "Building products that reach millions of people every single day";
  const ff    = d.funFact     || "Once fixed a critical production bug while on a ski slope — and stuck the landing";
  const city  = d.city        || "Mumbai, India";
  const sp    = d.superpower  || "Turning caffeine into clean code at 2am";
  const initials = getInitials(nm);
  const firstName = nm.split(" ")[0];

  const handleSend = async () => {
    if (downloading || !emailRef.current) return;
    setDownloading(true);
    try {
      const node = emailRef.current;
      const rect = node.getBoundingClientRect();
      const width  = Math.round(rect.width);
      const height = node.scrollHeight;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0C0C18",
        width,
        height,
        style: {
          width:    width  + "px",
          height:   height + "px",
          margin:   "0",
          overflow: "visible",
        },
      });
      const link = document.createElement("a");
      link.download = `welcome-${(d.name || "joinee").replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="we-root">

        {/* TOP BAR */}
        <div className="we-topbar">
          <div className="we-logo">
            <div className="we-logo-dot" />
            Welcome to<span>GC</span>
          </div>
          <div className="we-live-badge">
            <div className="we-pulse" /> Live Preview
          </div>
        </div>

        <div className="we-body">

          {/* ── FORM PANEL ── */}
          <div className="we-form-panel">
            <div className="we-form-title">New Joinee Details</div>
            <div className="we-form-sub">The perfect welcome to the perfect team player. </div>

            {/* Photo */}
            <div
              className={`we-photo-zone${drag ? " drag" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); loadPhoto(e.dataTransfer.files[0]); }}
            >
              <input type="file" ref={fileRef} accept="image/*" style={{ display: "none" }} onChange={e => loadPhoto(e.target.files[0])} />
              <div className="we-upload-circle">
                {photo ? <img src={photo} alt="preview" /> : ICON_USER}
              </div>
              <div>
                <div className="we-upload-text-title">{photo ? "Photo uploaded ✓" : "Upload Photo"}</div>
                <div className="we-upload-text-sub">{photo ? "Click to change" : "PNG, JPG, WEBP · Click or drag & drop"}</div>
              </div>
            </div>

            {/* Name + City */}
            <div className="we-row">
              <div>
                <label className="we-label">Full Name</label>
                <input className="we-input" placeholder="Your Name" value={d.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label className="we-label">City / Location</label>
                <input className="we-input" placeholder="Mumbai, India" value={d.city} onChange={e => set("city", e.target.value)} />
              </div>
            </div>

            {/* Designation + Team */}
            <div className="we-row">
              <div>
                <label className="we-label">Designation</label>
                <input className="we-input" placeholder="Your Designation" value={d.designation} onChange={e => set("designation", e.target.value)} />
              </div>
              <div>
                <label className="we-label">Team Name</label>
                <select className="we-select" value={d.team} onChange={e => set("team", e.target.value)}>
                  <option value="">Select a team…</option>
                  <option value="Application Team">Application Team</option>
                  <option value="Digital CX">Digital CX</option>
                  <option value="Infra & Cyber Security">Infra &amp; Cyber Security</option>
                  <option value="Production Support">Production Support</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="we-field">
              <label className="we-label">Start Date</label>
              <input type="date" className="we-input" value={d.startDate} onChange={e => set("startDate", e.target.value)} />
            </div>

            <div className="we-section-divider" />
            <div className="we-section-label">About them</div>

            <div className="we-field">
              <label className="we-label">Hobbies & Interests</label>
              <textarea className="we-input" placeholder="Rock climbing, jazz piano, open-source projects..." value={d.hobbies} onChange={e => set("hobbies", e.target.value)} />
            </div>

            <div className="we-field">
              <label className="we-label">One thing you look forward to</label>
              <textarea className="we-input" placeholder="Building products that millions of people use every day..." value={d.lookForward} onChange={e => set("lookForward", e.target.value)} />
            </div>

            <div className="we-field">
              <label className="we-label">Fun Fact</label>
              <textarea className="we-input" placeholder="Can solve a Rubik's cube in under 45 seconds..." value={d.funFact} onChange={e => set("funFact", e.target.value)} />
            </div>

            <div className="we-field">
              <label className="we-label">Hidden Superpower</label>
              <textarea className="we-input" placeholder="Turns caffeine into clean code at 2am..." value={d.superpower} onChange={e => set("superpower", e.target.value)} style={{ height: "60px" }} />
            </div>

            <button className={`we-send-btn${downloading ? " downloading" : ""}`} onClick={handleSend} disabled={downloading}>
              {downloading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
                  Generating Image…
                </>
              ) : sent ? (
                "Downloaded! ✓"
              ) : (
                <>{ICON_SEND} Submit</>
              )}
            </button>
          </div>

          {/* ── PREVIEW PANEL ── */}
          <div className="we-preview-panel">
            <div className="we-preview-label">
              <div className="we-pulse" />
              Email Preview: Updates as you type
            </div>

            <div className="we-email" ref={emailRef}>
              {/* Browser chrome */}

              {/* HERO */}
              <div className="we-email-hero">
                <div className="we-email-eyebrow">
                  <span className="we-email-eyebrow-star">✦</span>
                  New Team Member
                  <span className="we-email-eyebrow-star">✦</span>
                </div>

                <div className="we-photo-ring">
                  <div className="we-photo-inner">
                    {photo
                      ? <img src={photo} alt={nm} />
                      : <span className="we-photo-initials">{initials}</span>
                    }
                  </div>
                </div>

                <div className="we-email-name">{nm}</div>
                <div className="we-email-desig">{desig}</div>
                <div className="we-email-team">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  {team}
                </div>

                {/* wave */}
                <svg viewBox="0 0 540 44" className="we-wave" preserveAspectRatio="none" style={{ height: "44px" }}>
                  <path d="M0 0 C90 44 180 0 270 22 C360 44 450 10 540 28 L540 44 L0 44 Z" fill="#F4F1EA" />
                </svg>
              </div>

              {/* BODY */}
              <div className="we-email-body">
                <div className="we-email-greeting">Hey team, say hello 👋</div>
                <div className="we-email-intro">
                  We're over the moon to welcome <strong>{nm}</strong> to the <strong>{team}</strong> team!
                  Joining us from {city}, {firstName} brings incredible energy and expertise.
                  Get ready — something amazing is about to happen.
                </div>

                {/* chips */}
                <div className="we-chips">
                  <div className="we-chip">
                    <div className="we-chip-lbl">Start Date</div>
                    <div className="we-chip-val">{formatDate(d.startDate)}</div>
                  </div>
                  <div className="we-chip">
                    <div className="we-chip-lbl">Based in</div>
                    <div className="we-chip-val">{city}</div>
                  </div>
                  <div className="we-chip">
                    <div className="we-chip-lbl">Role</div>
                    <div className="we-chip-val">{desig}</div>
                  </div>
                </div>

                {/* info cards */}
                <div className="we-icard">
                  <div className="we-icard-lbl">{ICON_HOBBY} Hobbies & Interests</div>
                  <div className="we-icard-val">{hobbies}</div>
                </div>

                <div className="we-icard accent-purple">
                  <div className="we-icard-lbl">{ICON_STAR} Most Excited About</div>
                  <div className="we-icard-val">{lf}</div>
                </div>

                <div className="we-icard" style={{ borderLeftColor: "#6BA3C4" }}>
                  <div className="we-icard-lbl" style={{ color: "#6BA3C4" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Hidden Superpower
                  </div>
                  <div className="we-icard-val">{sp}</div>
                </div>

                <div className="we-funfact">
                  <div className="we-funfact-lbl">{ICON_ZAP} Fun Fact</div>
                  <div className="we-funfact-val">{ff}</div>
                </div>

                <div className="we-divider" />

                <div className="we-email-closing">
                  <div className="we-closing-title">Let's give {firstName} a legendary welcome! 🎉</div>
                  <div className="we-closing-sub">
                    Drop them a message on Teams, grab a virtual coffee,<br />
                    or just share a meme. The more the merrier ! welcome aboard! 🚀
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="we-email-footer">
                <div className="we-footer-line" />
                <div className="we-footer-txt">
                  Sent with ❤️ from the Tech Team<br />
                  <span style={{ color: "#C4A35A" }}>Godrej Capital</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
