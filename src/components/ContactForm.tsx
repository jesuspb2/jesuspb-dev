import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="field">
        <label htmlFor="name">name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="your name"
          disabled={status === 'sending'}
        />
      </div>

      <div className="field">
        <label htmlFor="email">email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="your@email.com"
          disabled={status === 'sending'}
        />
      </div>

      <div className="field">
        <label htmlFor="message">message</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="what's on your mind?"
          disabled={status === 'sending'}
        />
      </div>

      <button type="submit" className="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'sending...' : 'send message →'}
      </button>

      {status === 'success' && (
        <p className="feedback success" role="status">
          message sent — I'll get back to you soon.
        </p>
      )}

      {status === 'error' && (
        <p className="feedback error" role="alert">
          something went wrong. try emailing me directly.
        </p>
      )}

      <style>{`
        .form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        label {
          font-size: 11px;
          color: var(--fg-mute);
          letter-spacing: 0.04em;
        }

        input,
        textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          color: var(--fg);
          font-family: inherit;
          font-size: 13px;
          line-height: 1.5;
          padding: 6px 0;
          transition: border-color 0.12s;
          resize: none;
          outline: none;
        }

        input::placeholder,
        textarea::placeholder {
          color: var(--fg-mute);
        }

        input:focus,
        textarea:focus {
          border-bottom-color: var(--accent);
        }

        input:disabled,
        textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit {
          align-self: flex-start;
          font-family: inherit;
          font-size: 12px;
          color: var(--fg-dim);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 6px 14px;
          cursor: pointer;
          transition: color 0.12s, border-color 0.12s;
          margin-top: 4px;
        }

        .submit:hover:not(:disabled) {
          color: var(--accent);
          border-color: var(--accent);
        }

        .submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .feedback {
          font-size: 12px;
        }

        .success { color: var(--accent); }
        .error   { color: #ef4444; }
      `}</style>
    </form>
  );
}
