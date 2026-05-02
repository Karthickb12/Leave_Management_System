import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, GraduationCap, ArrowRight, AlertCircle, User as UserIcon, Loader2, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const features = [
  { icon: '📋', title: 'Smart Requests', desc: 'Submit OD, Leave & Medical requests in seconds' },
  { icon: '⚡', title: 'Multi-Level Approval', desc: 'Auto-routed to Advisor → HOD → Principal' },
  { icon: '📊', title: 'Real-time Tracking', desc: 'Live status updates on every request' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Firebase-backed authentication' },
];

export default function LoginPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [department, setDepartment] = useState('');
  const [className, setClassName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!department) {
          setError('Please provide a Department.');
          setLoading(false);
          return;
        }
        if (selectedRole !== 'PRINCIPAL' && selectedRole !== 'ADMIN' && selectedRole !== 'HOD' && !className) {
           setError('Please provide a Class Name for this role.');
           setLoading(false);
           return;
        }

        await signup(email, password, name, selectedRole, department, className);
        toast.success('Account created! Welcome to EduFlow 🎉', { duration: 3000 });
      } else {
        await login(email, password);
        toast.success('Welcome back!', { duration: 3000 });
      }
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      if (err.code === 'auth/too-many-requests') msg = 'Access blocked due to unusual activity. Try later.';
      if (err.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-text)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '0.875rem' },
        }}
      />

      {/* Ambient background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '40%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.07), transparent 60%)', filter: 'blur(50px)' }} />
      </div>

      {/* ── Left hero panel (desktop only) ── */}
      <style>{`
        @media (min-width: 1024px) {
          .hero-panel { display: flex !important; }
        }
      `}</style>
      <div className="hero-panel" style={{
        flex: '1',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 3.5rem',
        borderRight: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.05) 100%)',
        position: 'relative',
        zIndex: 1,
      }}
      >
        {/* Logo */}
        <div className="animate-fade-up" style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '52px', height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}>
              <GraduationCap size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0, letterSpacing: '-0.02em' }}>EduFlow</h2>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-brand-start)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>College Request System</p>
            </div>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, lineHeight: 1.15, color: 'var(--color-text)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Streamline your{' '}
            <span className="gradient-text">academic</span>
            {' '}requests
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted)', lineHeight: 1.7, maxWidth: '400px' }}>
            One platform for students, advisors, HODs and principals to manage OD, Leave, and Permission requests seamlessly.
          </p>
        </div>

        {/* Feature list */}
        <div className="animate-fade-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="animate-fade-up"
              style={{
                animationDelay: `${200 + i * 80}ms`,
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                background: 'var(--color-card-bg-subtle)',
                border: '1px solid var(--color-border)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-hover-overlay)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-card-bg-subtle)'}
            >
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem', margin: '0 0 0.2rem' }}>{f.title}</p>
                <p style={{ color: 'var(--color-subtle)', fontSize: '0.8rem', margin: 0 }}>{f.desc}</p>
              </div>
              <CheckCircle size={16} color="#6366f1" style={{ flexShrink: 0, marginLeft: 'auto', marginTop: '2px' }} />
            </div>
          ))}
        </div>

        {/* Bottom credit */}
        <p className="animate-fade-up delay-500" style={{ marginTop: '2.5rem', color: 'var(--color-subtle)', fontSize: '0.75rem' }}>
          Secure · Firebase-backed · Built for Indian colleges
        </p>
      </div>

      {/* ── Right auth panel ── */}
      <div style={{
        flex: '0 0 auto',
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: '2rem 2.5rem',
        position: 'relative',
        zIndex: 1,
      }}
      className="lg:w-[480px]"
      >
        {/* Mobile logo - show only when hero panel is hidden */}
        <div id="mobile-logo" className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            margin: '0 auto 0.75rem',
          }}>
            <GraduationCap size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.25rem' }}>EduFlow</h2>
          <p style={{ color: 'var(--color-subtle)', fontSize: '0.82rem' }}>College Request System</p>
        </div>
        <style>{`
          @media (min-width: 1024px) {
            #mobile-logo { display: none !important; }
          }
        `}</style>

        {/* Auth card */}
        <div className="glass-card animate-scale-in" style={{ borderRadius: '1.5rem', overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{
            padding: '1.75rem 2rem 1.25rem',
            borderBottom: '1px solid var(--color-border)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(124,58,237,0.06) 100%)',
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', margin: 0 }}>
              {isSignUp
                ? 'Join the EduFlow platform as a student'
                : 'Enter your college credentials to continue'}
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: '1.75rem 2rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

              {/* Error */}
              {error && (
                <div className="animate-scale-in" style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.875rem',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#fca5a5',
                  fontSize: '0.85rem',
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name field (sign up only) */}
              {isSignUp && (
                <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="name-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={16} color="#475569" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="input-base"
                      style={{ paddingLeft: '2.75rem' }}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {isSignUp && (
                <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <label htmlFor="role-select" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Select Role
                  </label>
                  <select
                    id="role-select"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                    className="input-base"
                    style={{ padding: '0.75rem 1rem', appearance: 'none', background: 'var(--color-surface)', cursor: 'pointer' }}
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ADVISOR">Class Advisor</option>
                    <option value="HOD">Head of Department</option>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              )}

              {isSignUp && (
                <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <label htmlFor="dept-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Department
                  </label>
                  <input
                    id="dept-input"
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="input-base"
                    required={isSignUp}
                  />
                </div>
              )}

              {isSignUp && selectedRole !== 'PRINCIPAL' && selectedRole !== 'ADMIN' && selectedRole !== 'HOD' && (
                <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <label htmlFor="class-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Class / Section
                  </label>
                  <input
                    id="class-input"
                    type="text"
                    value={className}
                    onChange={e => setClassName(e.target.value)}
                    placeholder="e.g. CSE-A, 3rd Year"
                    className="input-base"
                    required={isSignUp}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="email-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#475569" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="input-base"
                    style={{ paddingLeft: '2.75rem' }}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label htmlFor="password-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#475569" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-base"
                    style={{ paddingLeft: '2.75rem' }}
                    required
                    minLength={6}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '0.25rem', padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Toggle mode footer */}
          <div style={{
            padding: '1rem 2rem',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            background: 'var(--color-card-bg-subtle)',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-subtle)', margin: 0 }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                id="auth-toggle-btn"
                onClick={toggleMode}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#818cf8', fontWeight: 600, fontSize: '0.85rem',
                  padding: 0, textDecoration: 'underline', textDecorationColor: 'transparent',
                  transition: 'color 0.15s, text-decoration-color 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#a5b4fc';
                  (e.currentTarget as HTMLButtonElement).style.textDecorationColor = '#a5b4fc';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#818cf8';
                  (e.currentTarget as HTMLButtonElement).style.textDecorationColor = 'transparent';
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        <p className="animate-fade-in delay-500" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-subtle)', fontSize: '0.72rem' }}>
          EduFlow © {new Date().getFullYear()} — Secure College Request Management
        </p>
      </div>
    </div>
  );
}
