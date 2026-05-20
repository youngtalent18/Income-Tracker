import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // GET USERS FROM LOCALSTORAGE
      const users = JSON.parse(
        localStorage.getItem('users') || '[]'
      );

      const userExists = users.find(
        (u) => u.email === email
      );

      if (!userExists) {
        setError('No account found with this email');
        return;
      }

      // CREATE RESET TOKEN (SIMULATED)
      const resetData = {
        email,
        token: crypto.randomUUID(),
        expires: Date.now() + 1000 * 60 * 10, // 10 min
      };

      localStorage.setItem(
        'resetPassword',
        JSON.stringify(resetData)
      );

      setSuccess(
        'Reset link generated! Check your inbox (demo mode)'
      );
    } catch (err) {
      setError(
        err.message || 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="flex items-center gap-2.5 mb-10">
          <img
            src="/image.png"
            alt="SalesFlow"
            className="h-9 w-9 rounded-xl object-cover"
          />

          <span className="text-xl font-bold tracking-tight">
            SalesFlow
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Reset password
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Enter your email and we'll generate a reset link
        </p>

        {/* SUCCESS */}
        {success ? (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-sm text-emerald-400">
            <CheckCircle size={16} className="mt-0.5" />
            <span>{success}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* ERROR */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email address
              </label>

              <input
                type="email"
                required
                className="w-full bg-[hsl(220,20%,12%)] border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                placeholder="you@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        )}

        {/* BACK */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link
            to="/"
            className="text-cyan-400 hover:underline font-medium"
          >
            ← Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
