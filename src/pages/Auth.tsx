import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Auth() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [userType, setUserType] = useState("admin"); // Add state for user type
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Check role and redirect accordingly
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (userData?.role === 'founder') {
          navigate('/founder-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Set the user's role as founder in the users table
      if (user) {
        await supabase.from('users').insert([{ 
          user_id: user.id,
          email, 
          role: 'founder' 
        }]);
      }

      toast({
        title: "Success",
        description: "Signup successful! Please check your email for confirmation.",
      });
      
      setIsSignup(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check user role in the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (userError) {
          throw userError;
        }

        // Redirect based on role
        if (userData?.role === 'founder') {
          navigate("/founder-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to log in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? "Founder Sign Up" : "Sign In"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Processing..." : (isSignup ? "Sign up" : "Sign in")}
            </Button>
          </div>

          {/* Add toggle button for signup/signin */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isSignup 
                ? "Already have an account? Sign in" 
                : "New founder? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
