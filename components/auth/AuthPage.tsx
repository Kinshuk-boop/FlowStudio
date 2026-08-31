'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { sendPasswordReset } from '@/lib/firebase/auth';
import {
  Clapperboard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Zap,
  Camera,
  Layers,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

// ──── Mini dot-grid canvas (for left panel) ────
function AuthDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let w = 0, h = 0;
    const dots: { ox: number; oy: number; x: number; y: number; vx: number; vy: number; a: number; ta: number }[] = [];
    const DOT_SPACING = 28;
    const IMPACT_R = 120;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      dots.length = 0;
      for (let i = 0; i < Math.ceil(w / DOT_SPACING) + 1; i++) {
        for (let j = 0; j < Math.ceil(h / DOT_SPACING) + 1; j++) {
          const ox = i * DOT_SPACING + 4;
          const oy = j * DOT_SPACING + 4;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, a: 0.1, ta: 0.1 });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < IMPACT_R) {
          const f = (1 - dist / IMPACT_R) * 14;
          const ang = Math.atan2(dy, dx);
          d.vx += Math.cos(ang) * f;
          d.vy += Math.sin(ang) * f;
          d.ta = 0.1 + (1 - dist / IMPACT_R) * 0.4;
        } else {
          d.ta = 0.1;
        }
        d.vx += (d.ox - d.x) * 0.08;
        d.vy += (d.oy - d.y) * 0.08;
        d.vx *= 0.84;
        d.vy *= 0.84;
        d.x += d.vx;
        d.y += d.vy;
        d.a += (d.ta - d.a) * 0.1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.a})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ──── Password strength indicator ────
function PasswordStrength({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getStrength();
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              n <= strength ? colors[strength] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className={`text-[11px] font-mono ${strength >= 3 ? 'text-emerald-400' : strength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

// ──── Shared Input ────
function FormInput({
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightEl,
  disabled,
}: {
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  rightEl?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-300 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-white/6 focus:ring-1 focus:ring-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'inherit' }}
      />
      {rightEl && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
  );
}

// ──── Error Banner ────
function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs">
      <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-red-400/60 hover:text-red-400 transition-colors text-xs">✕</button>
    </div>
  );
}

// ──── Google SVG ────
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ──── Left Panel (Cinematic) ────
function CinematicPanel() {
  return (
    <div className="relative h-full overflow-hidden">
      <AuthDotGrid />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/30 via-transparent to-[#09090b]/60 pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-start justify-between p-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white">
            <Clapperboard className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-white">FLOW Studio</span>
        </div>

        {/* Center mockup */}
        <div className="w-full">
          {/* Timeline Mockup */}
          <div className="rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl overflow-hidden mb-6">
            {/* Scene preview area */}
            <div
              className="relative h-44 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0a0a12 0%, #0d0d1a 40%, #080810 100%)',
              }}
            >
              {/* Simulated frame overlay */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&q=40)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'saturate(0.4) brightness(0.5)',
              }} />
              {/* Scope overlay lines */}
              <div className="absolute inset-0 border-[1px] border-white/5 m-4 rounded" />
              <div className="absolute top-1/2 left-4 right-4 h-px bg-white/5" />
              <div className="absolute top-4 bottom-4 left-1/2 w-px bg-white/5" />
              {/* Timecode */}
              <div className="absolute top-3 right-3 font-mono text-[10px] text-zinc-400 bg-black/50 px-2 py-0.5 rounded">
                00:00:03:12
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[10px] text-zinc-500">
                Scene 3 of 5 · 24fps · 1080p
              </div>
            </div>

            {/* Storyboard Strip */}
            <div className="border-t border-white/8 px-3 py-2.5 flex gap-2 items-center bg-black/40">
              {[
                { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=120&q=50', label: 'S1', active: false },
                { url: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?w=120&q=50', label: 'S2', active: false },
                { url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=120&q=50', label: 'S3', active: true },
                { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&q=50', label: 'S4', active: false },
                { url: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=120&q=50', label: 'S5', active: false },
              ].map((shot, i) => (
                <div
                  key={i}
                  className={`relative flex-1 aspect-video rounded overflow-hidden border transition-all ${
                    shot.active
                      ? 'border-blue-500 ring-1 ring-blue-500/50'
                      : 'border-white/10 opacity-60'
                  }`}
                >
                  <img src={shot.url} alt="" className="w-full h-full object-cover" style={{ filter: 'saturate(0.5)' }} />
                  <div className="absolute bottom-0 left-0 right-0 text-[8px] font-mono text-center text-zinc-400 bg-black/60 py-0.5">
                    {shot.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <Zap className="w-3 h-3" />, label: 'Instant AI synthesis' },
              { icon: <Camera className="w-3 h-3" />, label: 'Scene-accurate keyframing' },
              { icon: <Layers className="w-3 h-3" />, label: 'Unlimited projects' },
            ].map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[11px] text-zinc-400"
              >
                <span className="text-zinc-300">{pill.icon}</span>
                {pill.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──── Forgot Password Modal ────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch {
      setError('Could not send reset email. Check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0f1014] border border-white/10 p-6 z-10 space-y-4">
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Reset email sent</h3>
            <p className="text-xs text-zinc-400">Check your inbox at <span className="text-white">{email}</span> for a link to reset your password.</p>
            <button onClick={onClose} className="mt-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-100 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold text-white">Reset your password</h3>
              <p className="text-xs text-zinc-400 mt-1">Enter your email and we'll send you a reset link.</p>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormInput
                icon={<Mail className="w-3.5 h-3.5" />}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={setEmail}
                disabled={loading}
              />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-xs text-zinc-400 hover:text-white border border-white/10 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send Link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ──── Auth Form ────
function AuthForm({ initialTab }: { initialTab: 'login' | 'signup' }) {
  const router = useRouter();
  const { login, signup, loginWithGoogle, actionLoading, error, clearError } = useAuthStore();
  const [tab, setTab] = useState<'login' | 'signup'>(initialTab);
  const [showForgotPw, setShowForgotPw] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);

  // Clear errors when switching tabs
  const switchTab = (t: 'login' | 'signup') => {
    clearError();
    setTab(t);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(loginEmail, loginPassword);
    if (ok) router.replace('/dashboard');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await signup(signupName, signupEmail, signupPassword);
    if (ok) router.replace('/dashboard');
  };

  const handleGoogle = async () => {
    const ok = await loginWithGoogle();
    if (ok) router.replace('/dashboard');
  };

  return (
    <>
      {showForgotPw && <ForgotPasswordModal onClose={() => setShowForgotPw(false)} />}

      <div className="flex flex-col items-center justify-center h-full px-8 py-10">
        <div className="w-full max-w-md space-y-6">
          {/* Right column logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 rounded-md bg-white/10 border border-white/15 flex items-center justify-center">
              <Clapperboard className="w-3 h-3 text-zinc-300" />
            </div>
            <span className="text-sm font-medium text-zinc-300 tracking-tight">FLOW</span>
          </div>

          {/* Tab Switcher */}
          <div className="relative flex p-1 rounded-xl bg-white/5 border border-white/8">
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-lg bg-white/12 border border-white/15 transition-all duration-300"
              style={{ left: tab === 'login' ? '4px' : 'calc(50% + 0px)' }}
            />
            <button
              onClick={() => switchTab('login')}
              className={`relative flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors z-10 ${
                tab === 'login' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`relative flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors z-10 ${
                tab === 'signup' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Global Error Banner */}
          {error && <ErrorBanner message={error} onDismiss={clearError} />}

          {/* ── Login Form ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Welcome back.</h2>
                <p className="text-xs text-zinc-500 mt-1">Continue your cinematic session.</p>
              </div>

              <div className="space-y-3">
                <FormInput
                  icon={<Mail className="w-3.5 h-3.5" />}
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  disabled={actionLoading}
                />
                <FormInput
                  icon={<Lock className="w-3.5 h-3.5" />}
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  disabled={actionLoading}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowLoginPw(!showLoginPw)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showLoginPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPw(true)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-[11px] text-zinc-600">or continue with</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Social Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition-all text-sm text-zinc-300 active:scale-[0.98] disabled:opacity-50"
                >
                  <GoogleIcon /> Google
                </button>
                <button
                  type="button"
                  disabled
                  title="GitHub OAuth coming soon"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-zinc-600 cursor-not-allowed opacity-40"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-center text-xs text-zinc-600">
                No account yet?{' '}
                <button type="button" onClick={() => switchTab('signup')} className="text-zinc-400 hover:text-white transition-colors">
                  Create one →
                </button>
              </p>
            </form>
          )}

          {/* ── Signup Form ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Start creating.</h2>
                <p className="text-xs text-zinc-500 mt-1">Your first sequence is one click away.</p>
              </div>

              <div className="space-y-3">
                <FormInput
                  icon={<User className="w-3.5 h-3.5" />}
                  type="text"
                  placeholder="Full name"
                  value={signupName}
                  onChange={setSignupName}
                  disabled={actionLoading}
                />
                <FormInput
                  icon={<Mail className="w-3.5 h-3.5" />}
                  type="email"
                  placeholder="Work email"
                  value={signupEmail}
                  onChange={setSignupEmail}
                  disabled={actionLoading}
                />
                <div className="space-y-2">
                  <FormInput
                    icon={<Lock className="w-3.5 h-3.5" />}
                    type={showSignupPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={setSignupPassword}
                    disabled={actionLoading}
                    rightEl={
                      <button
                        type="button"
                        onClick={() => setShowSignupPw(!showSignupPw)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showSignupPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                  {signupPassword && <PasswordStrength password={signupPassword} />}
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-black bg-white hover:bg-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Create Free Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-[11px] text-zinc-600">or sign up with</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Social Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition-all text-sm text-zinc-300 active:scale-[0.98] disabled:opacity-50"
                >
                  <GoogleIcon /> Google
                </button>
                <button
                  type="button"
                  disabled
                  title="GitHub OAuth coming soon"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/4 text-sm text-zinc-600 cursor-not-allowed opacity-40"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              <p className="text-center text-xs text-zinc-600">
                Already have an account?{' '}
                <button type="button" onClick={() => switchTab('login')} className="text-zinc-400 hover:text-white transition-colors">
                  Sign in →
                </button>
              </p>

              <p className="text-center text-[10px] text-zinc-600">
                14-day free trial · No credit card required · Cancel anytime
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

// ──── Main Auth Page ────
export default function AuthPage() {
  // useSearchParams is called in the parent page.tsx (wrapped in Suspense)
  // We read the tab from the URL via a prop passed down from the page
  return <AuthPageInner />;
}

function AuthPageInner() {
  // Determine initial tab from URL search params
  const [initialTab, setInitialTab] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInitialTab(params.get('tab') === 'signup' ? 'signup' : 'login');
  }, []);

  return (
    <div className="h-screen bg-[#09090b] flex overflow-hidden">
      {/* Left: Cinematic visual panel */}
      <div className="hidden lg:block relative w-[52%] border-r border-white/8">
        <CinematicPanel />
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 relative overflow-y-auto bg-[#09090b]">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#09090b] via-[#0a0a0f] to-[#09090b]" />
        <div className="relative z-10 h-full">
          <AuthForm initialTab={initialTab} />
        </div>
      </div>
    </div>
  );
}
