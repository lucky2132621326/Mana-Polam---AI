"use client"

import { 
  Info, 
  Sprout, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Mail, 
  Github,
  Award
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl text-green-700 mb-4">
          <Sprout className="h-10 w-10" />
        </div>
        <h1 className="text-5xl font-black text-[#1a2e1d] tracking-tight">
          Mana Polam <span className="text-green-600">AI</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Pioneering the future of sustainable agriculture through 
          computer vision and real-time disease detection.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Mana Polam (meaning "Our Farm" in Telugu) was founded with a single goal: 
            to empower farmers with enterprise-grade AI technology. 
            We bridge the gap between traditional farming wisdom and modern data science.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-green-50 rounded-2xl shadow-sm">
              <Zap className="text-yellow-500 mb-2 h-5 w-5" />
              <p className="font-bold text-slate-800">Fast Detection</p>
              <p className="text-xs text-slate-500">Real-time GPU accelerated analysis</p>
            </div>
            <div className="p-4 bg-white border border-green-50 rounded-2xl shadow-sm">
              <ShieldCheck className="text-blue-500 mb-2 h-5 w-5" />
              <p className="font-bold text-slate-800">Secure Data</p>
              <p className="text-xs text-slate-500">Privacy-first farm management</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 aspect-video rounded-[3rem] border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" 
             alt="Smart Farm"
             className="w-full h-full object-cover opacity-80"
           />
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-slate-800">Platform Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Early Blight Analysis",
              desc: "Deep learning models trained on 50k+ agricultural leaf samples.",
              icon: Info
            },
            {
              title: "Precision Spraying",
              desc: "Automated hardware integration to reduce pesticide waste by up to 40%.",
              icon: Zap
            },
            {
              title: "Multi-Zone Tracking",
              desc: "Map-based visualization of your entire farm with heat signatures.",
              icon: Globe
            }
          ].map((f, i) => (
            <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <f.icon className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Connect */}
      <div className="bg-[#1a2e1d] rounded-[3rem] p-12 text-white text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Globe className="scale-[3] -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 space-y-4">
          <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Ready to modernize your farm?</h2>
          <p className="text-green-100/60 max-w-lg mx-auto">
            Mana Polam is an open-source initiative dedicated to the global agricultural community.
          </p>
          <div className="flex justify-center gap-6 pt-4">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full transition-colors font-bold">
              <Mail className="h-4 w-4" />
              Contact Support
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full transition-colors font-bold">
              <Github className="h-4 w-4" />
              View Source
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
