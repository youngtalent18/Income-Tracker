import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import heroBg from '../assets/salesFlow.png';
import { auth } from '../lib/data';
import { getApiError } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auth.getUser() && auth.getToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      await auth.login(form.email, form.password);
      toast.success('Welcome back!');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      setError(getApiError(err, 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    'w-full bg-[hsl(220,20%,12%)] border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow';

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
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
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Access your analytics dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                className={inputCls}
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-cyan-400 hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  className={inputCls + ' pr-10'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
                  }
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No account?{' '}
            <Link
              to="/register"
              className="text-cyan-400 hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroBg}
          alt="SalesFlow Dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/80 via-background/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Your business,
            <br />
            <span className="text-cyan-400">
              fully visible.
            </span>
          </h2>

          <p className="text-muted-foreground mt-3 text-sm max-w-xs">
            Real-time revenue tracking, analytics, and milestone management.
          </p>
        </div>
      </div>
    </div>
  );
}
