import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { auth } from "../lib/data";
import { getApiError } from "../lib/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 💾 persist form draft (safe version)
  useEffect(() => {
    localStorage.setItem("registerForm", JSON.stringify(form));
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // VALIDATION
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // 🔥 USE CENTRAL AUTH SYSTEM
      await auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // clear draft
      localStorage.removeItem("registerForm");

      setSuccess("Account created successfully");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(getApiError(err, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[hsl(220,20%,12%)] border border-border rounded-lg px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow";

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-emerald-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            Account created 🎉
          </h2>

          <p className="text-sm text-slate-400 mb-2">
            {success}
          </p>

          <p className="text-xs text-slate-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-6 py-5">
      <div className="w-full max-w-sm">

        {/* LOGO */}
        <div className="flex items-center gap-2.5 mb-7">
          <img
            src="/image.png"
            alt="SalesFlow"
            className="h-9 w-9 rounded-xl object-cover"
          />

          <span className="text-xl font-bold text-white">
            SalesFlow
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white mb-1">
          Create account
        </h1>

        <p className="text-sm text-slate-400 mb-6">
          Start tracking your business revenue
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ERROR */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* NAME */}
          <input
            className={inputCls}
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* EMAIL */}
          <input
            type="email"
            className={inputCls}
            placeholder="Email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className={inputCls + " pr-10"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* CONFIRM */}
          <input
            type="password"
            className={inputCls}
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) =>
              setForm({ ...form, confirm: e.target.value })
            }
          />

          {/* BUTTON */}
          <button
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-linear-to-br from-cyan-400 to-emerald-500 text-black font-semibold hover:opacity-90 flex items-center justify-center"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
