import { Button } from "@/components/ui/button";
import { LogOut, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();
  const [selectedMode, setSelectedMode] = useState<"client" | "agent">("client");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check localStorage for login state
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const name = localStorage.getItem("userName") || "User";
    
    setIsLoggedIn(loggedIn);
    setUserName(name);

    // Redirect to login if not authenticated
    if (!loggedIn) {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setLocation("/login");
  };

  const handleModeSelect = (mode: "client" | "agent") => {
    if (mode === "client") {
      setLocation("/client-dashboard");
    } else {
      setLocation("/agent-dashboard");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 p-4 md:p-6 flex justify-between items-center">
        <div className="text-white text-sm md:text-base">
          Welcome, <span className="text-cyan-300 font-semibold">{userName}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs md:text-sm"
        >
          <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Logout
        </Button>
      </div>

      {/* Mobile Toggle (visible only on mobile) */}
      <div className="md:hidden relative z-10 px-4 mb-6">
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
          <div className="relative flex">
            {/* Sliding background */}
            <div
              className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r ${
                selectedMode === "client"
                  ? "from-cyan-500/30 to-blue-500/30 left-0"
                  : "from-purple-500/30 to-pink-500/30 left-1/2"
              } rounded-xl transition-all duration-300 ease-out shadow-lg`}
              style={{
                boxShadow: selectedMode === "client" 
                  ? "0 0 20px rgba(6, 182, 212, 0.3)" 
                  : "0 0 20px rgba(168, 85, 247, 0.3)"
              }}
            />
            
            {/* Client button */}
            <button
              onClick={() => setSelectedMode("client")}
              className={`relative flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedMode === "client"
                  ? "text-white scale-105"
                  : "text-slate-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">👥</span>
                <span>CLIENTS</span>
              </div>
            </button>
            
            {/* Agent button */}
            <button
              onClick={() => setSelectedMode("agent")}
              className={`relative flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedMode === "agent"
                  ? "text-white scale-105"
                  : "text-slate-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm">👤</span>
                <span>AGENTS</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Split Screen (hidden on mobile, shown on desktop) */}
      <div className="hidden md:flex relative z-10 h-[calc(100vh-80px)]">
        {/* Left Side - Clients */}
        <div
          onClick={() => handleModeSelect("client")}
          className="flex-1 relative overflow-hidden cursor-pointer group transition-all duration-500 hover:flex-[1.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 group-hover:from-cyan-800/60 group-hover:to-blue-800/60 transition-all duration-500" />
          
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <img
              src="/logo-clients.png"
              alt="Clients Logo"
              className="w-48 h-48 object-contain mb-8 group-hover:scale-110 transition-transform duration-500"
            />
            
            <h2 className="text-7xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
              CLIENTS
            </h2>
            
            <p className="text-2xl text-cyan-200 mb-12">Agency Management</p>
            
            <div className="space-y-4 mb-12 text-left">
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-5 w-5 text-cyan-400" />
                <span className="text-lg">Manage All Agents</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-5 w-5 text-cyan-400" />
                <span className="text-lg">Track Performance</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-5 w-5 text-cyan-400" />
                <span className="text-lg">Send Communications</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-5 w-5 text-cyan-400" />
                <span className="text-lg">View Analytics</span>
              </div>
            </div>
            
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Enter Client Mode
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Center Divider */}
        <div className="w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        {/* Right Side - Agents */}
        <div
          onClick={() => handleModeSelect("agent")}
          className="flex-1 relative overflow-hidden cursor-pointer group transition-all duration-500 hover:flex-[1.1]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 group-hover:from-purple-800/60 group-hover:to-pink-800/60 transition-all duration-500" />
          
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
            <img
              src="/logo-agents.png"
              alt="Agents Logo"
              className="w-48 h-48 object-contain mb-8 group-hover:scale-110 transition-transform duration-500"
            />
            
            <h2 className="text-7xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
              AGENTS
            </h2>
            
            <p className="text-2xl text-purple-200 mb-12">Personal Dashboard</p>
            
            <div className="space-y-4 mb-12 text-left">
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-5 w-5 text-purple-400" />
                <span className="text-lg">View Your Stats</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-5 w-5 text-purple-400" />
                <span className="text-lg">Track Commission</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-5 w-5 text-purple-400" />
                <span className="text-lg">Manage Appointments</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-5 w-5 text-purple-400" />
                <span className="text-lg">Access Resources</span>
              </div>
            </div>
            
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300"
            >
              Enter Agent Mode
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Mode Content (visible only on mobile) */}
      <div className="md:hidden relative z-10 px-4 pb-8">
        {selectedMode === "client" ? (
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl">
            <img
              src="/logo-clients.png"
              alt="Clients Logo"
              className="w-32 h-32 object-contain mx-auto mb-6"
            />
            
            <h2 className="text-4xl font-bold text-white text-center mb-3">
              CLIENTS
            </h2>
            
            <p className="text-lg text-cyan-200 text-center mb-8">Agency Management</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-4 w-4 text-cyan-400" />
                <span>Manage All Agents</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-4 w-4 text-cyan-400" />
                <span>Track Performance</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-4 w-4 text-cyan-400" />
                <span>Send Communications</span>
              </div>
              <div className="flex items-center gap-3 text-cyan-100">
                <ChevronRight className="h-4 w-4 text-cyan-400" />
                <span>View Analytics</span>
              </div>
            </div>
            
            <Button
              onClick={() => handleModeSelect("client")}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg rounded-xl shadow-xl"
            >
              Enter Client Mode
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 shadow-2xl">
            <img
              src="/logo-agents.png"
              alt="Agents Logo"
              className="w-32 h-32 object-contain mx-auto mb-6"
            />
            
            <h2 className="text-4xl font-bold text-white text-center mb-3">
              AGENTS
            </h2>
            
            <p className="text-lg text-purple-200 text-center mb-8">Personal Dashboard</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-4 w-4 text-purple-400" />
                <span>View Your Stats</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-4 w-4 text-purple-400" />
                <span>Track Commission</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-4 w-4 text-purple-400" />
                <span>Manage Appointments</span>
              </div>
              <div className="flex items-center gap-3 text-purple-100">
                <ChevronRight className="h-4 w-4 text-purple-400" />
                <span>Access Resources</span>
              </div>
            </div>
            
            <Button
              onClick={() => handleModeSelect("agent")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-lg rounded-xl shadow-xl"
            >
              Enter Agent Mode
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center z-20">
        <div className="text-slate-400 text-xs md:text-sm">
          The Independent Life - Agent Management Platform
        </div>
      </div>
    </div>
  );
}

