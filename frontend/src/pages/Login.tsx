import { useState } from "react";
import { Briefcase, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/auth.context";
import { toast } from "sonner";

export default function Login() {
  const [form, setForm] = useState({
    email: "test@gmail.com",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
    } catch (err) {
      toast.error("Invalid Creadentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" />
            </div>
            <h1 className="text-xl font-semibold">GigFlow</h1>
          </div>

          <h2 className="text-3xl font-bold mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">
            Enter your credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-black/20 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/20 px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              {loading ? "Logging in..." : "Login"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center">
        <div className="max-w-md text-center px-8">
          <div className="mx-auto mb-6 h-20 w-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Briefcase className="text-indigo-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Find the perfect talent for your project
          </h2>
          <p className="text-gray-600">
            Connect with skilled freelancers, post gigs, and get your projects
            done efficiently.
          </p>
        </div>
      </div>
    </div>
  );
}
