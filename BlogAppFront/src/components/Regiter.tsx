import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "../Utilities/Navbar";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface LoginForm {
  email: string;
  password: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    form: "register" | "login",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (form === "register") {
      setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    } else {
      setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (
    form: "register" | "login",
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const url = `http://localhost:3000/api/v1/${form}`;
    const payload = form === "register" ? registerForm : loginForm;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (form === "register") {
          setMessage({
            type: "success",
            text: "Account created successfully! Please login.",
          });
          setRegisterForm({ name: "", email: "", password: "" });
          setActiveTab("login");
        } else if (form === "login") {
          // Save user + token in context
          login(data.token, data.user);

          setMessage({
            type: "success",
            text: "Login successful! Redirecting...",
          });

          // Now hit the role-specific API
          setTimeout(async () => {
            try {
              const url2 =
                data.user.role === "admin"
                  ? "http://localhost:3000/api/v1/admin"
                  : "http://localhost:3000/api/v1/user";

              const res2 = await fetch(url2, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.token}`,
                },
              });

              const result = await res2.json();

              if (res2.ok) {
                console.log("Dashboard data:", result);

                // ✅ After API success → navigate to frontend route
                if (data.user.role === "admin") {
                  navigate("/admin");
                } else {
                  navigate("/user");
                }
              } else {
                console.error("API error:", result.message);
                setMessage({ type: "error", text: result.message });
              }
            } catch (err) {
              console.error("Fetch failed", err);
              setMessage({ type: "error", text: "API request failed." });
            }
          }, 1000);
        }
      } else {
        setMessage({ type: "error", text: data.message || `${form} failed` });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const switchTab = (tab: "register" | "login") => {
    setActiveTab(tab);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0f172a] flex flex-col">
      <div className="flex justify-center items-center flex-grow px-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md border border-cyan-400/30"
        >
          {/* Tabs */}
          <div className="flex mb-6 bg-slate-900/50 rounded-2xl p-1">
            {["register", "login"].map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab as "register" | "login")}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {tab === "register" ? "🚀 Register" : "🔐 Login"}
              </button>
            ))}
          </div>

          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`mb-4 p-3 rounded-xl text-center font-medium ${
                  message.type === "success"
                    ? "bg-green-600/20 text-green-300 border border-green-500/30"
                    : "bg-red-600/20 text-red-300 border border-red-500/30"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {activeTab === "register" && (
              <motion.form
                key="register"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 10 }}
                onSubmit={(e) => handleSubmit("register", e)}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-center mb-4 text-cyan-300">
                  Create Your Account
                </h2>
                {["name", "email", "password"].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={
                        field === "password"
                          ? "password"
                          : field === "email"
                          ? "email"
                          : "text"
                      }
                      name={field}
                      value={(registerForm as any)[field]}
                      onChange={(e) => handleChange("register", e)}
                      disabled={isLoading}
                      required
                      className="peer w-full px-4 py-3 rounded-xl border border-cyan-400/30 bg-slate-900/80 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      placeholder={field}
                    />
                    <label className="absolute left-4 -top-2 text-cyan-300 text-sm bg-slate-900 px-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-cyan-300 transition-all">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </motion.form>
            )}

            {activeTab === "login" && (
              <motion.form
                key="login"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 10 }}
                onSubmit={(e) => handleSubmit("login", e)}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-center mb-4 text-cyan-300">
                  Welcome Back
                </h2>
                {["email", "password"].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === "password" ? "password" : "email"}
                      name={field}
                      value={(loginForm as any)[field]}
                      onChange={(e) => handleChange("login", e)}
                      disabled={isLoading}
                      required
                      className="peer w-full px-4 py-3 rounded-xl border border-cyan-400/30 bg-slate-900/80 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                      placeholder={field}
                    />
                    <label className="absolute left-4 -top-2 text-cyan-300 text-sm bg-slate-900 px-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-cyan-300 transition-all">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
