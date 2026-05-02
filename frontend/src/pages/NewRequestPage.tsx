import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, Eye, Check, ChevronRight, ChevronLeft, Send, Loader2 } from 'lucide-react';

type RequestFormInputs = {
  type: 'OD' | 'MEDICAL' | 'EMERGENCY' | 'OTHER';
  startDate: string;
  endDate: string;
  reason: string;
  registerNumber: string;
};

const REQUEST_TYPES = [
  { value: 'OD', label: 'On Duty', emoji: '🎓', desc: 'For attending events, competitions, or official duties', color: '#818cf8' },
  { value: 'MEDICAL', label: 'Medical Leave', emoji: '🏥', desc: 'Health-related absence with medical support', color: '#a78bfa' },
  { value: 'EMERGENCY', label: 'Emergency', emoji: '🚨', desc: 'Urgent, unforeseen situations requiring immediate leave', color: '#f87171' },
  { value: 'OTHER', label: 'Other Reasons', emoji: '📝', desc: 'Any other reason for leave', color: '#38bdf8' },
] as const;

const STEPS = [
  { id: 1, label: 'Request Type', icon: FileText },
  { id: 2, label: 'Dates & Reason', icon: Calendar },
  { id: 3, label: 'Review', icon: Eye },
];

export default function NewRequestPage() {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RequestFormInputs>({
    defaultValues: { type: 'OD' },
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const watchedType = watch('type');
  const watchedStart = watch('startDate');
  const watchedEnd = watch('endDate');
  const watchedReason = watch('reason');

  const diffDays = (() => {
    if (!watchedStart || !watchedEnd) return 0;
    const s = new Date(watchedStart), e = new Date(watchedEnd);
    const d = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return d > 0 ? d : 0;
  })();

  const selectedType = REQUEST_TYPES.find(t => t.value === watchedType) ?? REQUEST_TYPES[0];

  const onSubmit = async (data: RequestFormInputs) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) { toast.error('End date must be after start date'); return; }
    setSubmitting(true);
    try {
      await api.post('/requests/', {
        student_id: user?.uid,
        type: data.type,
        start_date: data.startDate,
        end_date: data.endDate,
        days: diffDays,
        reason: data.reason,
        register_number: data.registerNumber,
      });
      toast.success('Request submitted successfully! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step === 2 && (!watchedStart || !watchedEnd || !watchedReason || !watch('registerNumber'))) {
      toast.error('Please fill in all fields');
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '0.875rem' },
        }}
      />

      {/* ── Page header ── */}
      <div className="animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
          <Send size={15} color="var(--color-brand-start)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-brand-start)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>New Request</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.025em' }}>
          Submit a Request
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
          Fill in the details below and your request will be routed to the right approvers.
        </p>
      </div>

      {/* ── Step progress bar ── */}
      <div className="animate-fade-up delay-100 glass-card" style={{ borderRadius: '1.25rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Progress line */}
          <div style={{
            position: 'absolute', top: '20px', left: '12.5%', right: '12.5%',
            height: '2px', background: 'var(--color-border)', zIndex: 0,
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-brand-start), var(--color-brand-end))',
              width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
              transition: 'width 0.4s ease',
              borderRadius: '99px',
            }} />
          </div>

          {STEPS.map(s => {
            const isDone = step > s.id;
            const isActive = step === s.id;
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                  ...(isDone ? {
                    background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                    color: '#fff',
                  } : isActive ? {
                    background: 'rgba(99,102,241,0.15)',
                    border: '2px solid var(--color-brand-start)',
                    color: 'var(--color-brand-start)',
                  } : {
                    background: 'var(--color-card-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-subtle)',
                  }),
                }}>
                  {isDone ? <Check size={17} /> : <s.icon size={17} />}
                </div>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600,
                  color: isActive ? 'var(--color-text)' : isDone ? 'var(--color-brand-start)' : 'var(--color-subtle)',
                  textAlign: 'center',
                }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Form steps ── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Request type */}
        {step === 1 && (
          <div className="animate-scale-in glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Select Request Type</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: '0.25rem 0 0' }}>Choose the category that best describes your request.</p>
            </div>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.875rem' }}>
              {REQUEST_TYPES.map(type => {
                const isSelected = watchedType === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    id={`type-${type.value.toLowerCase()}-btn`}
                    onClick={() => setValue('type', type.value as any)}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '1rem',
                      border: isSelected ? `1.5px solid ${type.color}50` : '1px solid var(--color-border)',
                      background: isSelected ? `${type.color}12` : 'var(--color-card-bg-subtle)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0 }}>{type.emoji}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: isSelected ? type.color : 'var(--color-text)', fontSize: '0.92rem', margin: '0 0 0.25rem' }}>
                        {type.label}
                        {isSelected && <Check size={14} style={{ display: 'inline', marginLeft: '0.4rem' }} />}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-subtle)', margin: 0, lineHeight: 1.5 }}>{type.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Dates & Reason */}
        {step === 2 && (
          <div className="animate-scale-in glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Dates & Reason</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: '0.25rem 0 0' }}>Specify the period and provide a clear reason for your request.</p>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Date grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <label htmlFor="start-date-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Start Date
                  </label>
                  <input
                    id="start-date-input"
                    type="date"
                    {...register('startDate', { required: 'Start date is required' })}
                    className="input-base"
                  />
                  {errors.startDate && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.startDate.message}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <label htmlFor="end-date-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    End Date
                  </label>
                  <input
                    id="end-date-input"
                    type="date"
                    {...register('endDate', { required: 'End date is required' })}
                    className="input-base"
                  />
                  {errors.endDate && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.endDate.message}</span>}
                </div>
              </div>

              {/* Register Number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="reg-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Register Number
                </label>
                <input
                  id="reg-input"
                  type="text"
                  placeholder="e.g. 21CS101"
                  {...register('registerNumber', { required: 'Register Number is required' })}
                  className="input-base"
                />
                {errors.registerNumber && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.registerNumber.message}</span>}
              </div>

              {/* Duration pill */}
              {diffDays > 0 && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '99px',
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  alignSelf: 'flex-start',
                }}>
                  <Calendar size={14} color="var(--color-brand-start)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-brand-start)' }}>
                    {diffDays} {diffDays === 1 ? 'day' : 'days'} selected
                  </span>
                </div>
              )}

              {/* Reason */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <label htmlFor="reason-input" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reason
                </label>
                <textarea
                  id="reason-input"
                  {...register('reason', { required: 'Reason is required', minLength: { value: 10, message: 'Please provide at least 10 characters' } })}
                  rows={4}
                  className="input-base"
                  style={{ resize: 'vertical', minHeight: '100px' }}
                  placeholder="Describe why you are submitting this request..."
                />
                {errors.reason && <span style={{ fontSize: '0.75rem', color: 'var(--color-danger)' }}>{errors.reason.message}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="animate-scale-in glass-card" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Review Your Request</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', margin: '0.25rem 0 0' }}>Confirm the details before submitting.</p>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Summary card */}
              <div style={{
                padding: '1.25rem',
                borderRadius: '1rem',
                background: `${selectedType.color}08`,
                border: `1px solid ${selectedType.color}20`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{selectedType.emoji}</span>
                  <div>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: selectedType.color, margin: '0 0 0.1rem' }}>{selectedType.label}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-subtle)', margin: 0 }}>{selectedType.desc}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { label: 'Register Number', value: watch('registerNumber') || '—' },
                    { label: 'Duration', value: diffDays > 0 ? `${diffDays} Day${diffDays > 1 ? 's' : ''}` : '—' },
                    { label: 'Start Date', value: watchedStart ? new Date(watchedStart).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                    { label: 'End Date', value: watchedEnd ? new Date(watchedEnd).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                    { label: 'Submitted By', value: user?.displayName || user?.email || 'You' },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'var(--color-input-bg)' }}>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.2rem' }}>{item.label}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', fontWeight: 600, margin: 0 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '0.75rem', padding: '0.875rem', borderRadius: '0.75rem', background: 'var(--color-input-bg)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.3rem' }}>Reason</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.6 }}>{watchedReason}</p>
                </div>
              </div>

              {/* Workflow note */}
              <div style={{
                padding: '0.875rem 1rem',
                borderRadius: '0.875rem',
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex', gap: '0.625rem',
              }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-subtle)', margin: 0, lineHeight: 1.6 }}>
                  {diffDays <= 2
                    ? 'This request requires approval from your Class Advisor only.'
                    : diffDays <= 5
                    ? 'This request requires approval from your Advisor and HOD.'
                    : 'This request requires approval from Advisor → HOD → Principal.'}
                </p>
              </div>

              {/* Submit button */}
              <button
                id="submit-request-btn"
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ padding: '0.9rem', fontSize: '0.95rem' }}
              >
                {submitting ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
                ) : (
                  <><Send size={17} /> Submit Request</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className="animate-fade-up delay-200" style={{ display: 'flex', justifyContent: 'space-between', gap: '0.875rem', marginTop: '1rem' }}>
          <button
            type="button"
            id="step-back-btn"
            onClick={() => setStep(s => Math.max(s - 1, 1))}
            disabled={step === 1}
            className="btn-ghost"
            style={{ flex: 1, opacity: step === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={17} /> Back
          </button>
          {step < 3 && (
            <button
              type="button"
              id="step-next-btn"
              onClick={handleNext}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Continue <ChevronRight size={17} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
