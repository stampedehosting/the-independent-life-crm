import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import PasswordLogin from "./pages/PasswordLogin";
import SimpleLogin from "./pages/SimpleLogin";
import AgentDashboard from "./pages/AgentDashboard";
import ClientDashboard from "./pages/ClientDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={SimpleLogin} />
      <Route path={"/login"} component={SimpleLogin} />
      <Route path={"/mode-select"} component={Login} />
        <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/agent-dashboard" component={AgentDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
