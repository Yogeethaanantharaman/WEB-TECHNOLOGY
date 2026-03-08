import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Welcome back! 🎉");
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Check your email to confirm. 📧");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-3xl gradient-primary flex items-center justify-center shadow-card mx-auto mb-4"
          >
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold">DeadlineHero</h1>
          <p className="text-muted-foreground mt-1">Never miss a deadline again ⚡</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl shadow-card border p-8">
          <h2 className="font-display text-xl font-semibold text-center mb-6">
            {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label className="font-display font-medium text-sm">Display Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="pl-10 rounded-xl bg-muted border-border"
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="font-display font-medium text-sm">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  className="pl-10 rounded-xl bg-muted border-border"
                />
              </div>
            </div>
            <div>
              <Label className="font-display font-medium text-sm">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pl-10 rounded-xl bg-muted border-border"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-primary font-display font-semibold rounded-xl h-11 text-base">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isLogin ? "Sign In 🚀" : "Create Account 🎯"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span className="font-semibold text-primary">{isLogin ? "Sign up" : "Sign in"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
