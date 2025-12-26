import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, User, DollarSign, TrendingUp, Calendar, Mail, Phone, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Agent = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  state?: string;
  appointments?: string[];
  totalSales?: number;
  commissionRate?: number;
  monthlyGoal?: number;
};

// All 13 agents from the database
const ALL_AGENTS: Agent[] = [
  {
    id: 1,
    firstName: "Andrew",
    lastName: "Barber",
    email: "Abarber@farmersagent.com",
    phone: "330-449-6722",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare", "Cigna"],
    totalSales: 45000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 2,
    firstName: "Jerry",
    lastName: "Christopher",
    email: "jerrydonut@me.com",
    phone: "504-259-6138",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare"],
    totalSales: 38000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 3,
    firstName: "Ronda",
    lastName: "Cobb",
    email: "roncobb747@msn.com",
    phone: "419-442-1935",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "Cigna"],
    totalSales: 52000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 4,
    firstName: "Audrie",
    lastName: "Housley",
    email: "audrie@aokinsurance.group",
    phone: "216-299-9074",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare", "Cigna"],
    totalSales: 61000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 5,
    firstName: "Martha",
    lastName: "Huffman",
    email: "Huffmanwillardohio@gmail.com",
    phone: "419-744-4025",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare"],
    totalSales: 29000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 6,
    firstName: "Lisa",
    lastName: "Janowski",
    email: "ljinsuranceservices@outlook.com",
    phone: "440-596-7011",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare", "Cigna"],
    totalSales: 47000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 7,
    firstName: "Katrina",
    lastName: "Kanis",
    email: "kanis.katerina@gmail.com",
    phone: "216-215-9683",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "Cigna"],
    totalSales: 33000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 8,
    firstName: "Elena",
    lastName: "Lubenets",
    email: "myagentelena@gmail.com",
    phone: "614-432-1516",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare"],
    totalSales: 41000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 9,
    firstName: "Sean",
    lastName: "McLaughlin",
    email: "insurancebysean96@gmail.com",
    phone: "440-263-4266",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare", "Cigna"],
    totalSales: 55000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 10,
    firstName: "Christopher",
    lastName: "Moley",
    email: "cmmoley@gmail.com",
    phone: "216-346-7731",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare"],
    totalSales: 36000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 11,
    firstName: "Tricia",
    lastName: "Peacey",
    email: "tpeacey@farmersagent.com",
    phone: "440-476-8463",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "Cigna"],
    totalSales: 44000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 12,
    firstName: "Jeremy",
    lastName: "Schlueter",
    email: "jschlueter@farmersagent.com",
    phone: "330-941-7045",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare", "Cigna"],
    totalSales: 58000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
  {
    id: 13,
    firstName: "Gregory",
    lastName: "Vetrick",
    email: "gvetrick@yahoo.com",
    phone: "330-310-4599",
    status: "active",
    state: "OH",
    appointments: ["Aetna", "UnitedHealthcare"],
    totalSales: 49000,
    commissionRate: 15,
    monthlyGoal: 5000,
  },
];

export default function AgentDashboard() {
  const [, setLocation] = useLocation();
  const [selectedAgentId, setSelectedAgentId] = useState<string>("1");
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the selected agent
    const selectedAgent = ALL_AGENTS.find(a => a.id === parseInt(selectedAgentId));
    if (selectedAgent) {
      setAgent(selectedAgent);
    }
    setIsLoading(false);
  }, [selectedAgentId]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setLocation("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Agent not found</div>
      </div>
    );
  }

  const commissionEarned = ((agent.totalSales || 0) * (agent.commissionRate || 0)) / 100;
  const goalProgress = ((agent.totalSales || 0) / (agent.monthlyGoal || 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-purple-500/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/logo-agents.png" 
              alt="The Independent Life" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-white">The Independent Life</h1>
              <p className="text-sm text-purple-300">Agent Mode - Personal Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {agent.firstName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Agent Selector */}
        <Card className="bg-slate-900/50 border-purple-500/30 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-purple-400" />
              <div className="flex-1">
                <CardTitle className="text-white">Select Agent</CardTitle>
                <CardDescription className="text-purple-300">
                  View data for any agent in the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
              <SelectTrigger className="w-full bg-slate-800/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {ALL_AGENTS.map((a) => (
                  <SelectItem 
                    key={a.id} 
                    value={a.id.toString()}
                    className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
                  >
                    {a.firstName} {a.lastName} - {a.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${(agent.totalSales || 0).toLocaleString()}
              </div>
              <p className="text-xs text-purple-300 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/50 to-slate-900/50 border-pink-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Commission Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${commissionEarned.toLocaleString()}
              </div>
              <p className="text-xs text-pink-300 mt-1">At {agent.commissionRate}% rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-slate-900/50 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Monthly Goal</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${(agent.monthlyGoal || 0).toLocaleString()}
              </div>
              <div className="mt-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-purple-300 mt-1">{goalProgress.toFixed(0)}% achieved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/50 to-slate-900/50 border-pink-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-200">Status</CardTitle>
              <User className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-lg px-4 py-1">
                {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </Badge>
              <p className="text-xs text-pink-300 mt-2">Account status</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Personal Information</CardTitle>
              </div>
              <CardDescription className="text-purple-300">
                Your contact details and account info
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-200 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={`${agent.firstName} ${agent.lastName}`}
                  readOnly
                  className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-purple-200 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={agent.email}
                  readOnly
                  className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-purple-200 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={agent.phone}
                  readOnly
                  className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-purple-200 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  State
                </Label>
                <Input
                  id="state"
                  value={agent.state || ""}
                  readOnly
                  className="bg-slate-800/50 border-purple-500/30 text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Insurance Appointments */}
          <Card className="bg-slate-900/50 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white">Insurance Appointments</CardTitle>
              </div>
              <CardDescription className="text-purple-300">
                Providers you're appointed with
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {agent.appointments && agent.appointments.length > 0 ? (
                agent.appointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 border border-purple-500/20 rounded-lg"
                  >
                    <span className="text-white font-medium">{appointment}</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-purple-300 text-sm">No appointments yet</p>
              )}
              <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-200 text-sm">
                  Need to add or update appointments? Contact your agency manager.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GHL Calendar Integration Placeholder */}
        <Card className="bg-slate-900/50 border-purple-500/30 mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Master Calendar (GHL Integration)</CardTitle>
            </div>
            <CardDescription className="text-purple-300">
              View and manage your appointments via GoHighLevel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-8 text-center">
              <Calendar className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                GoHighLevel Calendar Integration
              </h3>
              <p className="text-purple-300 mb-4">
                Connect your GHL master calendar to view all appointments in one place
              </p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                <Calendar className="h-4 w-4 mr-2" />
                Connect GHL Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-purple-300">
              Common tasks and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-auto py-4"
                onClick={() => toast.info("Calendar feature coming soon!")}
              >
                <Calendar className="h-5 w-5 mr-2" />
                View Calendar
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-auto py-4"
                onClick={() => toast.info("Training resources coming soon!")}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Training Resources
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-auto py-4"
                onClick={() => toast.info("Support contact coming soon!")}
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

