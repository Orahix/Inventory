import React, { useState } from 'react';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { AuthError } from '../hooks/useAuth';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  loading: boolean;
  error: AuthError | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            src="/cropped-azimut-logo-A-300x300-removebg-preview copy copy.png"
            alt="Azimut Logo"
            className="mx-auto h-20 w-20"
          />
          <h2 className="mt-6 text-3xl font-bold text-[#2E2E2E]">
            Azimut Inventar
          </h2>
          <p className="mt-2 text-sm text-[#5A5A5A]">
            Prijavite se na vaš nalog
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-300 rounded-[10px] p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-700 text-sm">
                <p className="font-medium">{error.message}</p>
                {error.code === 'INVALID_CREDENTIALS' && (
                  <p className="mt-1 text-xs text-red-600">
                    Ako ste zaboravili lozinku, kontaktirajte administratora.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="label-text">
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="vas.email@azimut.rs"
              />
            </div>

            <div>
              <label htmlFor="password" className="label-text">
                Lozinka
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Unesite vašu lozinku"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5A5A5A] hover:text-[#2E2E2E] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2E2E2E] border-t-transparent mr-2"></div>
                  Prijavljivanje...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Prijavite se
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#5A5A5A]">
              Samo ovlašćeni korisnici Azimut-a mogu pristupiti ovoj aplikaciji
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
