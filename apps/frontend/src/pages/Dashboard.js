import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle, Sparkles, ArrowRight, Compass, Activity, Zap, Shield, BarChart3 } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--g4g-purple))] via-[hsl(var(--g4g-green))] to-[hsl(var(--g4g-bright-green))] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      <div className="glass border border-white/20 rounded-3xl p-6 md:p-12 max-w-6xl text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[hsl(var(--g4g-bright-green))] to-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-in zoom-in duration-500">
          <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-white animate-in zoom-in duration-700" strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{animationDelay: '200ms'}}>
          Welcome to AEGIS HUB
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{animationDelay: '300ms'}}>
          Your AI-Powered EV Charging Command Center
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10 animate-in fade-in duration-700" style={{animationDelay: '400ms'}}>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs md:text-sm">Live Monitoring</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs md:text-sm">AI Powered</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs md:text-sm">Secure</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
            <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white/60 text-xs md:text-sm">Analytics</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Dashboard Features */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 text-left hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-in fade-in slide-in-from-left duration-700" style={{animationDelay: '500ms'}}>
            <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Dashboard Features
            </h3>
            <ul className="space-y-2.5 text-sm md:text-base text-white/80">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--g4g-bright-green))] animate-pulse"></span>
                Real-time station monitoring
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--g4g-bright-green))] animate-pulse" style={{animationDelay: '0.2s'}}></span>
                AI infrastructure management
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--g4g-bright-green))] animate-pulse" style={{animationDelay: '0.4s'}}></span>
                Enterprise fleet operations
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--g4g-bright-green))] animate-pulse" style={{animationDelay: '0.6s'}}></span>
                Advanced diagnostics
              </li>
            </ul>
          </div>

          {/* KAILASH AI Card */}
          <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-5 md:p-6 text-left border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 animate-in fade-in slide-in-from-bottom duration-700" style={{animationDelay: '600ms'}}
               onClick={() => navigate("/kailash")}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white">KAILASH AI System</h3>
            </div>
            <p className="text-white/80 text-xs md:text-sm mb-4 leading-relaxed">
              AI-powered organizational management with GANESHA executive assistant and 20 AI departments.
            </p>
            <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all text-sm md:text-base">
              <span>Launch KAILASH</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* GANESHA Orchestrator Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-5 md:p-6 text-left border-2 border-white/30 hover:border-white/60 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 animate-in fade-in slide-in-from-right duration-700" style={{animationDelay: '700ms'}}
               onClick={() => navigate("/ganesha-orchestrator")}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white">GANESHA Orchestrator</h3>
            </div>
            <p className="text-white/80 text-xs md:text-sm mb-4 leading-relaxed">
              AI development orchestrator coordinating code agents efficiently. Save 80%+ on credits!
            </p>
            <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all text-sm md:text-base">
              <span>Launch Orchestrator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-700" style={{animationDelay: '800ms'}}>
          <Button
            onClick={() => navigate("/")}
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50 font-semibold px-6 md:px-8 py-5 md:py-6 text-base md:text-lg rounded-xl transition-all hover:scale-105 w-full sm:w-auto"
          >
            Back to Login
          </Button>
        </div>
        
        {/* Footer Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in duration-700" style={{animationDelay: '900ms'}}>
          <p className="text-white/60 text-xs md:text-sm flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Made with ❤️ for India's EV Revolution 🇮🇳⚡
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;