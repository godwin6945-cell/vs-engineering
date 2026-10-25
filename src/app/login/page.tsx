"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [gstin, setGstin] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
          phone,
          state,
          gstin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-steel-50 dark:bg-navy-950 blueprint-pattern">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-navy-900 dark:bg-orange-500 text-white flex items-center justify-center font-display font-black text-2xl shadow-lg border border-navy-700 dark:border-orange-600">
              VS
            </div>
          </Link>
          <h2 className="text-2xl font-display font-black tracking-tight text-navy-900 dark:text-steel-100">
            {isRegister ? "Create Customer Account" : "Sign In to VS Engineering"}
          </h2>
          <p className="text-xs text-steel-500 dark:text-steel-400">
            {isRegister
              ? "Register to track custom fabrication orders, quotes & tax invoices"
              : "Sign in with your email to access quotes, live production lifecycle & admin desk"}
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white dark:bg-navy-900 p-8 rounded-xl border border-steel-200 dark:border-steel-800 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRegister ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name / Representative"
                required
                placeholder="e.g. Anand Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Company Name"
                placeholder="e.g. Apex Industrial Solutions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Work Email"
                  type="email"
                  required
                  placeholder="anand@company.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Phone / Mobile"
                  placeholder="+91 93458 04547"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Indian State"
                  placeholder="e.g. Tamil Nadu"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Input
                  label="GSTIN (Optional)"
                  placeholder="e.g. 33AAAAA0000A1Z5"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="orange"
                size="lg"
                className="w-full justify-center"
                isLoading={loading}
              >
                Create Account & Access Portal
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="you@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="orange"
                size="lg"
                className="w-full justify-center"
                isLoading={loading}
              >
                Sign In to Portal
              </Button>
            </form>
          )}

          {/* Switcher link */}
          <div className="pt-2 text-center text-xs text-steel-500 border-t border-steel-100 dark:border-steel-800">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                First time customer?{" "}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center font-mono text-sm text-steel-500">
        Loading engineering portal authentication...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

