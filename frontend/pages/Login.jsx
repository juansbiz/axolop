import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Chrome, AlertCircle, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";

const logo = "/LOGO/transparent-logo.webp";

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithOAuth, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.error) {
        setError(result.error.message);
      } else {
        navigate("/app");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithOAuth("google");
    } catch (err) {
      setError("Google sign in failed");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In - Axolop" />
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img src={logo} alt="Axolop" className="h-10" />
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600 mb-8">Sign in to your account</p>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-600 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-500 hover:text-yellow-500"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || authLoading}
                className="w-full h-11 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
              className="w-full h-11 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Chrome className="h-5 w-5" />
              Google
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-yellow-500 hover:text-yellow-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 to-pink-600 p-8">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Grow your brand with Axolop</h2>
              <p className="text-yellow-500 text-lg">The all-in-one platform for modern brands</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
