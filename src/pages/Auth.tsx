import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"founder" | "investor">("founder");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Special handling for admin login
        if (isAdminLogin) {
          if (email === "admin@fundmystartup.com" && password === "1234567") {
            // First check if admin exists in profiles table
            const { data: adminProfiles, error: profileError } = await supabase
              .from("profiles")
              .select("id")
              .eq("email", "admin@fundmystartup.com");

            if (profileError) throw profileError;

            // If admin doesn't exist in profiles, we need to create it
            if (!adminProfiles || adminProfiles.length === 0) {
              // Create admin account
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  data: {
                    full_name: "Admin",
                    user_type: "admin",
                  },
                },
              });

              if (signUpError) throw signUpError;

              // Wait for the trigger to create the profile
              await new Promise(resolve => setTimeout(resolve, 2000));

              // Create admin role if user was created
              if (signUpData.user) {
                const { error: adminRoleError } = await supabase
                  .from("admin_roles")
                  .insert([{ 
                    user_id: signUpData.user.id,
                    role: "admin"
                  }]);

                if (adminRoleError) throw adminRoleError;
              }
            }

            // Now try to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (signInError) throw signInError;

            navigate("/admin");
            toast({
              title: "Welcome Admin",
              description: "You have successfully logged in.",
            });
          } else {
            throw new Error("Invalid admin credentials");
          }
        } else {
          // Regular user login
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          navigate("/dashboard");
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
        }
      } else {
        // Regular user signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-white p-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? (isAdminLogin ? "Admin Login" : "Welcome Back") : "Create Account"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>I am a</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value: "founder" | "investor") =>
                    setUserType(value)
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="founder" id="founder" disabled={loading} />
                    <Label htmlFor="founder">Startup Founder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="investor" id="investor" disabled={loading} />
                    <Label htmlFor="investor">Investor</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : isLogin ? (
              isAdminLogin ? "Admin Sign In" : "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button
            variant="link"
            className="p-0"
            onClick={() => {
              setIsLogin(!isLogin);
              setIsAdminLogin(false);
            }}
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </Button>
        </p>
      </Card>
    </div>
  );
};

export default Auth;