import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PasswordLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.loginWithPassword.useMutation({
    onSuccess: (data: { success: boolean; message?: string; user?: any }) => {
      if (data.success) {
        toast.success("Login successful!");
        // Redirect to mode selection
        window.location.href = "/mode-select";
      } else {
        toast.error(data.message || "Invalid credentials");
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setIsLoading(true);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-900/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-dark.png" 
              alt="The Independent Life" 
              className="h-32 w-32 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            The Independent Life
          </CardTitle>
          <CardDescription className="text-cyan-300 text-lg">
            Agent Management Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <p className="mb-2">Demo Credentials:</p>
            <p className="font-mono text-cyan-300">Username: admin</p>
            <p className="font-mono text-cyan-300">Password: demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

