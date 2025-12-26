import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function SimpleLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple client-side validation
    if (username === "admin" && password === "demo123") {
      // Store login state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", "Demo Admin");
      
      toast.success("Login successful!");
      
      // Redirect to mode selection
      setTimeout(() => {
        window.location.href = "/mode-select";
      }, 500);
    } else {
      toast.error("Invalid username or password");
      setIsLoading(false);
    }
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
                autoComplete="username"
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
                autoComplete="current-password"
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

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <p className="text-center text-sm text-cyan-300 mb-3 font-semibold">Demo Login Credentials</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Username:</span>
                <span className="font-mono text-cyan-300 font-semibold">admin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Password:</span>
                <span className="font-mono text-cyan-300 font-semibold">demo123</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3">Use these credentials to access the client dashboard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

