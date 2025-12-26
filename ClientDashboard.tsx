import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Search, Users, FileText, UserPlus, Calendar, Shield, Building2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  insuranceType: "Medicare" | "ACA" | "Both";
  medicareLevel?: string;
  lis?: "Yes" | "No";
  policyNumber?: string;
  effectiveDate?: string;
  assignedAgent: string;
};

type Appointment = {
  id: number;
  clientId: number;
  date: string;
  type: "Initial Consultation" | "Annual Review" | "Policy Change" | "Claim Assistance" | "Follow-up";
  notes: string;
  agent: string;
  status: "Completed" | "Scheduled" | "Cancelled";
};

// Sample client data
const SAMPLE_CLIENTS: Client[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "330-555-0101",
    dateOfBirth: "1955-03-15",
    maritalStatus: "Married",
    address: "123 Main St",
    city: "Cleveland",
    state: "OH",
    zipCode: "44101",
    insuranceType: "Medicare",
    policyNumber: "MED-2024-001",
    effectiveDate: "2024-01-01",
    assignedAgent: "Andrew Barber",
  },
  {
    id: 2,
    firstName: "Mary",
    lastName: "Johnson",
    email: "mary.j@email.com",
    phone: "216-555-0202",
    dateOfBirth: "1948-07-22",
    maritalStatus: "Widowed",
    address: "456 Oak Ave",
    city: "Akron",
    state: "OH",
    zipCode: "44301",
    insuranceType: "Medicare",
    policyNumber: "MED-2024-002",
    effectiveDate: "2024-02-01",
    assignedAgent: "Jerry Christopher",
  },
  {
    id: 3,
    firstName: "Robert",
    lastName: "Williams",
    email: "r.williams@email.com",
    phone: "419-555-0303",
    dateOfBirth: "1982-11-08",
    maritalStatus: "Single",
    address: "789 Elm St",
    city: "Toledo",
    state: "OH",
    zipCode: "43601",
    insuranceType: "ACA",
    policyNumber: "ACA-2024-001",
    effectiveDate: "2024-01-15",
    assignedAgent: "Ronda Cobb",
  },
];

// Sample appointment history (10-year retention)
const SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    clientId: 1,
    date: "2024-01-05",
    type: "Initial Consultation",
    notes: "Discussed Medicare Advantage options. Client interested in Plan G.",
    agent: "Andrew Barber",
    status: "Completed",
  },
  {
    id: 2,
    clientId: 1,
    date: "2024-06-15",
    type: "Annual Review",
    notes: "Reviewed current coverage. Client satisfied with current plan.",
    agent: "Andrew Barber",
    status: "Completed",
  },
  {
    id: 3,
    clientId: 1,
    date: "2024-11-01",
    type: "Follow-up",
    notes: "Open enrollment discussion. No changes needed.",
    agent: "Andrew Barber",
    status: "Completed",
  },
  {
    id: 4,
    clientId: 2,
    date: "2024-02-10",
    type: "Initial Consultation",
    notes: "New Medicare enrollment. Selected Medicare Supplement Plan F.",
    agent: "Jerry Christopher",
    status: "Completed",
  },
  {
    id: 5,
    clientId: 3,
    date: "2024-01-20",
    type: "Initial Consultation",
    notes: "ACA marketplace enrollment. Selected Silver plan with HSA.",
    agent: "Ronda Cobb",
    status: "Completed",
  },
];

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showSopDialog, setShowSopDialog] = useState(false);
  const [clients, setClients] = useState<Client[]>(SAMPLE_CLIENTS);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    maritalStatus: "Single",
    insuranceType: "Medicare",
    medicareLevel: "Plan G",
    lis: "No",
    state: "OH",
    assignedAgent: "Andrew Barber"
  });

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setLocation("/login");
  };

  const handleEnrollClient = () => {
    if (!newClient.firstName || !newClient.lastName || !newClient.email || !newClient.phone || !newClient.dateOfBirth) {
      toast.error("Please fill in all required fields");
      return;
    }

    const client: Client = {
      id: clients.length + 1,
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      email: newClient.email,
      phone: newClient.phone,
      dateOfBirth: newClient.dateOfBirth,
      maritalStatus: (newClient.maritalStatus || "Single") as Client["maritalStatus"],
      address: newClient.address || "",
      city: newClient.city || "",
      state: newClient.state || "OH",
      zipCode: newClient.zipCode || "",
      insuranceType: (newClient.insuranceType || "Medicare") as Client["insuranceType"],
      policyNumber: `${newClient.insuranceType === "Medicare" ? "MED" : "ACA"}-2024-${String(clients.length + 1).padStart(3, "0")}`,
      effectiveDate: new Date().toISOString().split("T")[0],
      assignedAgent: newClient.assignedAgent || "Andrew Barber"
    };

    setClients([...clients, client]);
    toast.success(`${client.firstName} ${client.lastName} enrolled successfully!`);
    setShowEnrollDialog(false);
    setNewClient({
      maritalStatus: "Single",
      insuranceType: "Medicare",
      medicareLevel: "Plan G",
      lis: "No",
      state: "OH",
      assignedAgent: "Andrew Barber"
    });
  };

  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  );

  const getClientAppointments = (clientId: number) => {
    return SAMPLE_APPOINTMENTS.filter((apt) => apt.clientId === clientId).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-cyan-500/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <img 
                src="/logo-clients.png" 
                alt="The Independent Life" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">The Independent Life</h1>
                <p className="text-xs sm:text-sm text-cyan-300 truncate">Client Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end flex-wrap">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline">HIPAA Compliant</span>
                <span className="sm:hidden">HIPAA</span>
              </Badge>
              <span className="text-white text-sm sm:text-base hidden md:inline">Welcome, Demo Admin</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* FMO Information Banner */}
        <Card className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">Field Marketing Organization (FMO)</h3>
                  <p className="text-cyan-200">The Brokerage Inc. - Medicare & ACA Services</p>
                </div>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-sm px-4 py-2">
                Active Partnership
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-900/50 to-slate-900/50 border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{clients.length}</div>
              <p className="text-xs text-cyan-300 mt-1">Active policies</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Medicare Clients</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {SAMPLE_CLIENTS.filter((c) => c.insuranceType === "Medicare" || c.insuranceType === "Both").length}
              </div>
              <p className="text-xs text-blue-300 mt-1">Active Medicare</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/50 to-slate-900/50 border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">ACA Clients</CardTitle>
              <FileText className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {SAMPLE_CLIENTS.filter((c) => c.insuranceType === "ACA" || c.insuranceType === "Both").length}
              </div>
              <p className="text-xs text-cyan-300 mt-1">Active ACA</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-slate-900/50 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Appointments (10yr)</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{SAMPLE_APPOINTMENTS.length}</div>
              <p className="text-xs text-blue-300 mt-1">Total records</p>
            </CardContent>
          </Card>
        </div>

        {/* SOP Section */}
        <Card className="bg-slate-900/50 border-cyan-500/30 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <CardTitle className="text-white">Standard Operating Procedures (SOP)</CardTitle>
              </div>
              <Button 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={() => setShowSopDialog(true)}
              >
                View Full SOP
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <h4 className="font-semibold text-cyan-200 mb-2">Client Enrollment</h4>
                <p className="text-sm text-cyan-300">Complete intake form, verify eligibility, submit application within 24 hours</p>
              </div>
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <h4 className="font-semibold text-cyan-200 mb-2">Annual Reviews</h4>
                <p className="text-sm text-cyan-300">Contact clients 60 days before renewal, review coverage options, document decisions</p>
              </div>
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <h4 className="font-semibold text-cyan-200 mb-2">Record Retention</h4>
                <p className="text-sm text-cyan-300">Maintain all client records and appointments for minimum 10 years per HIPAA compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Enroll */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
            <Input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-cyan-300/50"
            />
          </div>
          <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Enroll New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-cyan-300">New Client Enrollment</DialogTitle>
                <DialogDescription className="text-cyan-200">
                  Complete the form below to enroll a new client. All fields are required for HIPAA compliance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <Label className="text-cyan-200">First Name *</Label>
                  <Input 
                    className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" 
                    value={newClient.firstName || ""}
                    onChange={(e) => setNewClient({...newClient, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-cyan-200">Last Name *</Label>
                  <Input 
                    className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" 
                    value={newClient.lastName || ""}
                    onChange={(e) => setNewClient({...newClient, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-cyan-200">Date of Birth *</Label>
                  <Input 
                    type="date" 
                    className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" 
                    value={newClient.dateOfBirth || ""}
                    onChange={(e) => setNewClient({...newClient, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-cyan-200">Marital Status *</Label>
                  <Select value={newClient.maritalStatus} onValueChange={(value) => setNewClient({...newClient, maritalStatus: value as Client["maritalStatus"]})}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                      <SelectItem value="Single" className="text-white">Single</SelectItem>
                      <SelectItem value="Married" className="text-white">Married</SelectItem>
                      <SelectItem value="Divorced" className="text-white">Divorced</SelectItem>
                      <SelectItem value="Widowed" className="text-white">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-cyan-200">Email Address *</Label>
                  <Input 
                    type="email" 
                    className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" 
                    value={newClient.email || ""}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-cyan-200">Phone Number *</Label>
                  <Input 
                    className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" 
                    value={newClient.phone || ""}
                    onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                    placeholder="330-555-0000"
                  />
                </div>
                <div>
                  <Label className="text-cyan-200">Insurance Type *</Label>
                  <Select value={newClient.insuranceType} onValueChange={(value) => setNewClient({...newClient, insuranceType: value as Client["insuranceType"]})}>
                    <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-cyan-500/30">
                      <SelectItem value="Medicare" className="text-white">Medicare</SelectItem>
                      <SelectItem value="ACA" className="text-white">ACA</SelectItem>
                      <SelectItem value="Both" className="text-white">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newClient.insuranceType === "Medicare" && (
                  <>
                    <div>
                      <Label className="text-cyan-200">Medicare Level *</Label>
                      <Select value={newClient.medicareLevel} onValueChange={(value) => setNewClient({...newClient, medicareLevel: value})}>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white mt-1">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-cyan-500/30">
                          <SelectItem value="Plan A" className="text-white">Plan A</SelectItem>
                          <SelectItem value="Plan B" className="text-white">Plan B</SelectItem>
                          <SelectItem value="Plan C" className="text-white">Plan C</SelectItem>
                          <SelectItem value="Plan D" className="text-white">Plan D</SelectItem>
                          <SelectItem value="Plan F" className="text-white">Plan F</SelectItem>
                          <SelectItem value="Plan G" className="text-white">Plan G</SelectItem>
                          <SelectItem value="Plan K" className="text-white">Plan K</SelectItem>
                          <SelectItem value="Plan L" className="text-white">Plan L</SelectItem>
                          <SelectItem value="Plan M" className="text-white">Plan M</SelectItem>
                          <SelectItem value="Plan N" className="text-white">Plan N</SelectItem>
                          <SelectItem value="Medicare Advantage" className="text-white">Medicare Advantage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-cyan-200">LIS (Low Income Subsidy) *</Label>
                      <Select value={newClient.lis} onValueChange={(value) => setNewClient({...newClient, lis: value as "Yes" | "No"})}>
                        <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white mt-1">
                          <SelectValue placeholder="Select LIS status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-cyan-500/30">
                          <SelectItem value="Yes" className="text-white">Yes</SelectItem>
                          <SelectItem value="No" className="text-white">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowEnrollDialog(false)} className="border-cyan-500/30 text-cyan-300">
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={handleEnrollClient}
                >
                  Enroll Client
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clients Table */}
        <Card className="bg-slate-900/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">Client Records</CardTitle>
            <CardDescription className="text-cyan-300">
              Click on a client to view detailed information and 10-year appointment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-500/20 hover:bg-cyan-500/5">
                  <TableHead className="text-cyan-300">Name</TableHead>
                  <TableHead className="text-cyan-300">DOB / Age</TableHead>
                  <TableHead className="text-cyan-300">Contact</TableHead>
                  <TableHead className="text-cyan-300">Marital Status</TableHead>
                  <TableHead className="text-cyan-300">Insurance Type</TableHead>
                  <TableHead className="text-cyan-300">Policy #</TableHead>
                  <TableHead className="text-cyan-300">Assigned Agent</TableHead>
                  <TableHead className="text-cyan-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="border-cyan-500/20 hover:bg-cyan-500/5 cursor-pointer"
                    onClick={() => setSelectedClient(client)}
                  >
                    <TableCell className="text-white font-medium">
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell className="text-cyan-200">
                      {client.dateOfBirth} ({calculateAge(client.dateOfBirth)} yrs)
                    </TableCell>
                    <TableCell className="text-cyan-200">
                      <div className="text-sm">{client.email}</div>
                      <div className="text-xs text-cyan-300">{client.phone}</div>
                    </TableCell>
                    <TableCell className="text-cyan-200">{client.maritalStatus}</TableCell>
                    <TableCell>
                      <Badge className={
                        client.insuranceType === "Medicare" 
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          : client.insuranceType === "ACA"
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      }>
                        {client.insuranceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-cyan-200 text-sm">{client.policyNumber}</TableCell>
                    <TableCell className="text-cyan-200">{client.assignedAgent}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Client Detail Dialog */}
        {selectedClient && (
          <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
            <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-cyan-300 text-2xl">
                  {selectedClient.firstName} {selectedClient.lastName}
                </DialogTitle>
                <DialogDescription className="text-cyan-200">
                  Client ID: {selectedClient.id} | Policy: {selectedClient.policyNumber}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                  <TabsTrigger value="info" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                    Client Information
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">
                    Appointment History (10 Years)
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-cyan-200">Full Name</Label>
                      <Input value={`${selectedClient.firstName} ${selectedClient.lastName}`} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Date of Birth (Age)</Label>
                      <Input value={`${selectedClient.dateOfBirth} (${calculateAge(selectedClient.dateOfBirth)} years)`} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Email Address</Label>
                      <Input value={selectedClient.email} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Phone Number</Label>
                      <Input value={selectedClient.phone} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Marital Status</Label>
                      <Input value={selectedClient.maritalStatus} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Insurance Type</Label>
                      <Input value={selectedClient.insuranceType} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-cyan-200">Full Address</Label>
                      <Input value={`${selectedClient.address}, ${selectedClient.city}, ${selectedClient.state} ${selectedClient.zipCode}`} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Policy Number</Label>
                      <Input value={selectedClient.policyNumber} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div>
                      <Label className="text-cyan-200">Effective Date</Label>
                      <Input value={selectedClient.effectiveDate} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-cyan-200">Assigned Agent</Label>
                      <Input value={selectedClient.assignedAgent} readOnly className="bg-slate-800/50 border-cyan-500/30 text-white mt-1" />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="appointments" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-cyan-300 text-sm">
                        <Shield className="inline h-4 w-4 mr-1" />
                        Records retained for 10 years per HIPAA compliance requirements
                      </p>
                      <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule New
                      </Button>
                    </div>
                    {getClientAppointments(selectedClient.id).map((apt) => (
                      <Card key={apt.id} className="bg-slate-800/50 border-cyan-500/20">
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={
                                  apt.status === "Completed" 
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : apt.status === "Scheduled"
                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                    : "bg-red-500/20 text-red-300 border-red-500/30"
                                }>
                                  {apt.status}
                                </Badge>
                                <span className="text-cyan-200 font-semibold">{apt.type}</span>
                              </div>
                              <div className="text-sm text-cyan-300 mb-2">
                                <Calendar className="inline h-3 w-3 mr-1" />
                                {new Date(apt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <p className="text-cyan-200 text-sm mb-2">{apt.notes}</p>
                              <p className="text-xs text-cyan-300">Agent: {apt.agent}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {getClientAppointments(selectedClient.id).length === 0 && (
                      <div className="text-center py-8 text-cyan-300">
                        No appointment history found for this client
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}

        {/* SOP Dialog */}
        <Dialog open={showSopDialog} onOpenChange={setShowSopDialog}>
          <DialogContent className="bg-slate-900 border-cyan-500/30 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-cyan-300 flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Standard Operating Procedures (SOP)
              </DialogTitle>
              <DialogDescription className="text-cyan-200">
                Complete guidelines for client enrollment and compliance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    48-Hour Waiting Period Requirement
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-2">
                  <p className="font-semibold text-yellow-300">⚠️ CRITICAL: You must wait 48 hours after SOP before seeing the client</p>
                  <p>This waiting period is mandated by CMS (Centers for Medicare & Medicaid Services) to ensure clients have adequate time to review materials and make informed decisions without pressure.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Initial contact and SOP delivery must be documented</li>
                    <li>No sales presentations allowed during 48-hour period</li>
                    <li>Client may waive waiting period in writing (rare exceptions only)</li>
                    <li>Violation can result in contract termination and CMS sanctions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300">1. Client Enrollment Process</CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-3">
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-2">Step 1: Initial Contact & Qualification</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Verify client eligibility (age 65+ for Medicare or qualifying event for ACA)</li>
                      <li>Collect basic information: name, DOB, contact details, current coverage</li>
                      <li>Schedule initial consultation (must be at least 48 hours after SOP delivery)</li>
                      <li>Send welcome packet and disclosure documents</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-2">Step 2: Needs Assessment</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Review current health status and medications</li>
                      <li>Assess preferred doctors and hospitals</li>
                      <li>Determine budget and coverage preferences</li>
                      <li>Check for LIS (Low Income Subsidy) eligibility</li>
                      <li>Identify Special Enrollment Period (SEP) if applicable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-2">Step 3: Plan Presentation</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Present 2-3 suitable plan options with side-by-side comparison</li>
                      <li>Explain benefits, limitations, and costs clearly</li>
                      <li>Provide Summary of Benefits (SB) and Evidence of Coverage (EOC)</li>
                      <li>Document all materials provided to client</li>
                      <li>Allow time for questions and clarification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-2">Step 4: Enrollment & Documentation</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Complete enrollment application accurately</li>
                      <li>Obtain client signature and date on all required forms</li>
                      <li>Verify Scope of Appointment (SOA) is signed and dated</li>
                      <li>Submit application within 24 hours of signature</li>
                      <li>Provide confirmation number and expected effective date</li>
                      <li>Enter all information into this CRM system immediately</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cyan-200 mb-2">Step 5: Follow-up & Confirmation</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Send thank you email/letter within 24 hours</li>
                      <li>Confirm enrollment acceptance from carrier (3-5 business days)</li>
                      <li>Schedule welcome call for first day of coverage</li>
                      <li>Provide ID card timeline and member services contact info</li>
                      <li>Set annual review reminder (11 months from effective date)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300">2. Annual Reviews (AEP/OEP)</CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-2">
                  <p className="text-sm"><strong>Timeline:</strong> Contact clients 60 days before renewal, review coverage options, document decisions</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Review current plan performance and satisfaction</li>
                    <li>Check for formulary changes affecting medications</li>
                    <li>Compare current plan to new options for upcoming year</li>
                    <li>Document client decision to keep or change coverage</li>
                    <li>Submit changes during Annual Enrollment Period (Oct 15 - Dec 7)</li>
                    <li>Confirm new coverage effective January 1st</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    3. Record Retention (10-Year Requirement)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-2">
                  <p className="font-semibold text-yellow-300">⚠️ HIPAA & CMS Compliance: All client records must be retained for minimum 10 years</p>
                  <p className="text-sm"><strong>Required Documents:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Scope of Appointment (SOA) - signed and dated</li>
                    <li>Enrollment applications and confirmation numbers</li>
                    <li>All client communications (emails, letters, notes)</li>
                    <li>Needs assessment and plan comparison worksheets</li>
                    <li>Annual review documentation</li>
                    <li>Beneficiary contact verification forms</li>
                    <li>Any complaints or grievances filed</li>
                    <li>Termination or disenrollment requests</li>
                  </ul>
                  <p className="text-sm mt-3"><strong>Storage:</strong> This CRM system automatically maintains all appointment history and client interactions for 10+ years. Ensure all client contacts are logged in the system.</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300">4. FMO Partnership - The Brokerage Inc.</CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-2">
                  <p className="text-sm">All Medicare and ACA business is written through our FMO partner:</p>
                  <div className="bg-cyan-500/10 p-4 rounded-lg border border-cyan-500/30 mt-2">
                    <p className="font-semibold text-cyan-200">The Brokerage Inc.</p>
                    <p className="text-sm">Medicare & ACA Services</p>
                    <p className="text-sm mt-2">Contact for contracting, commission questions, or carrier support</p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm mt-3">
                    <li>All agent appointments processed through The Brokerage Inc.</li>
                    <li>Commission statements available monthly</li>
                    <li>Compliance training and certification support provided</li>
                    <li>Direct carrier escalation for enrollment issues</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300">5. Compliance & Ethics</CardTitle>
                </CardHeader>
                <CardContent className="text-cyan-100 space-y-2">
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li><strong>Never</strong> pressure clients or use high-pressure sales tactics</li>
                    <li><strong>Always</strong> act in the client's best interest, not highest commission</li>
                    <li><strong>Disclose</strong> all plan limitations, costs, and restrictions clearly</li>
                    <li><strong>Respect</strong> the 48-hour waiting period after SOP delivery</li>
                    <li><strong>Document</strong> every client interaction in this CRM system</li>
                    <li><strong>Maintain</strong> HIPAA compliance - protect client privacy at all times</li>
                    <li><strong>Report</strong> any compliance concerns to management immediately</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowSopDialog(false)} className="bg-gradient-to-r from-cyan-500 to-blue-600">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

