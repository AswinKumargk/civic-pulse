import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Home, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Info,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowRight,
  ShieldAlert,
  Zap,
  Eye,
  ChevronRight,
  Droplets,
  Trash2,
  Lightbulb,
  Milestone as Road,
  Search,
  History,
  Building2,
  Calendar,
  Copy,
  Filter,
  X,
  ExternalLink,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Complaint, Category, Priority, Status } from './types';
import { INITIAL_COMPLAINTS, DEPARTMENT_MAPPING } from './constants';
import { calculatePriority } from './services/priorityEngine';
import { cn } from './lib/utils';
import { INDIA_LOCATIONS } from './data/indiaLocations';
import { IndiaMap } from './components/IndiaMap';
import { StateMapCard } from './components/StateMapCard';

// --- Components ---

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Medium: 'bg-orange-100 text-orange-700 border-orange-200',
    High: 'bg-rose-100 text-rose-700 border-rose-200',
    Critical: 'bg-rose-200 text-rose-800 border-rose-300',
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", colors[priority])}>
      {priority === 'Critical' ? '🔴 Critical' : 
       priority === 'High' ? '🔴 High' : 
       priority === 'Medium' ? '🟠 Medium' : '🟢 Low'}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
  const colors = {
    'Submitted': 'bg-blue-100 text-blue-600',
    'Under Review': 'bg-orange-100 text-orange-600',
    'In Progress': 'bg-purple-100 text-purple-600',
    'Resolved': 'bg-green-100 text-green-600',
  };

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", colors[status])}>
      {status}
    </span>
  );
};

const DepartmentBadge = ({ category }: { category: Category }) => {
  const mapping = DEPARTMENT_MAPPING[category];
  const Icon = category === 'Road' ? Road : 
               category === 'Garbage' ? Trash2 : 
               category === 'Water' ? Droplets : 
               category === 'Streetlight' ? Lightbulb : 
               category === 'Flood' ? ShieldAlert : Building2;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 font-bold text-xs">
      <Icon className="w-4 h-4" />
      {mapping.name}
    </div>
  );
};

const StatusTracker = ({ currentStatus }: { currentStatus: Status }) => {
  const steps: Status[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="py-6">
      <div className="relative flex justify-between">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-100 -z-10" />
        {/* Progress Bar Active */}
        <div 
          className="absolute top-5 left-0 h-1 bg-indigo-500 transition-all duration-500 -z-10" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                isCompleted ? "bg-indigo-600 border-indigo-100 text-white" : "bg-white border-slate-100 text-slate-300"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isActive ? "text-indigo-600" : isCompleted ? "text-slate-600" : "text-slate-400"
              )}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RecommendationModule = ({ complaint }: { complaint: Complaint }) => {
  const recommendations = complaint.recommendations || [];
  
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-6 space-y-4">
      <div className="flex items-center gap-2 text-indigo-700">
        <Zap className="w-5 h-5" />
        <h4 className="font-bold">AI Recommended Actions</h4>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-indigo-100/50 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-sm text-slate-700 font-medium">{rec}</span>
          </div>
        ))}
      </div>
      <div className="pt-2">
        <p className="text-xs text-indigo-600 font-medium italic">
          "AI Suggestion: {recommendations[0]} is recommended for immediate resolution."
        </p>
      </div>
    </div>
  );
};

const AIDecisionAnalysis = ({ complaint }: { complaint: Complaint }) => {
  const { 
    aiScore = 0, 
    aiConfidence = 0, 
    riskLevel = 'Low', 
    scoreBreakdown = { keyword: 0, category: 0, location: 0, time: 0 }, 
    decisionFactors = [], 
    priority = 'Low', 
    explanation = [], 
    recommendations = [] 
  } = complaint;

  return (
    <div className="space-y-6">
      {/* Main Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-1 bg-indigo-600 rounded-full" />
        <h2 className="text-xl font-black text-slate-800 tracking-tight">AI Priority Score Breakdown</h2>
      </div>

      {/* Header with Priority and Score */}
      <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="relative z-10">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 text-left">Final Priority</div>
          <div className="flex items-center gap-3">
            <h3 className={cn(
              "text-3xl font-black tracking-tight",
              priority === 'Critical' ? "text-rose-400" :
              priority === 'High' ? "text-orange-400" :
              priority === 'Medium' ? "text-amber-400" : "text-emerald-400"
            )}>
              {(priority || 'Low').toUpperCase()}
            </h3>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Score</div>
          <div className="text-4xl font-black text-white">
            {aiScore}<span className="text-lg text-slate-500 font-medium">/100</span>
          </div>
        </div>
      </div>

      {/* Risk Factors and Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Risk Factors
          </div>
          <div className="space-y-3">
            {(decisionFactors || []).length > 0 ? (decisionFactors || []).map((factor, i) => {
              const FactorIcon = factor.icon === 'AlertTriangle' ? AlertTriangle : 
                                 factor.icon === 'ShieldAlert' ? ShieldAlert :
                                 factor.icon === 'MapPin' ? MapPin :
                                 factor.icon === 'Droplets' ? Droplets : Info;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <FactorIcon className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-xs text-slate-700 font-semibold">{factor.label}</span>
                  </div>
                  {factor.points && (
                    <span className="text-xs font-bold text-rose-600">+{factor.points}</span>
                  )}
                </div>
              );
            }) : (
              <div className="text-xs text-slate-400 italic py-4 text-center">No specific risk factors identified</div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Priority Score Breakdown
          </div>
          <div className="space-y-4">
            {[
              { label: 'Keyword Risk Score', value: scoreBreakdown?.keyword || 0, max: 40, color: 'bg-rose-500' },
              { label: 'Category Importance', value: scoreBreakdown?.category || 0, max: 25, color: 'bg-indigo-500' },
              { label: 'Location Sensitivity', value: scoreBreakdown?.location || 0, max: 20, color: 'bg-emerald-500' },
              { label: 'Time Urgency', value: scoreBreakdown?.time || 0, max: 15, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>{item.label}</span>
                  <span className="text-slate-900">+{item.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence and Risk */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">AI Confidence</div>
            <div className="text-xl font-black text-indigo-700">{aiConfidence}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center bg-indigo-100">
            <Zap className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className={cn(
          "p-4 rounded-2xl border flex items-center justify-between",
          riskLevel === 'Critical' ? "bg-rose-50 border-rose-100 text-rose-700" :
          riskLevel === 'High' ? "bg-orange-50 border-orange-100 text-orange-700" :
          "bg-emerald-50 border-emerald-100 text-emerald-700"
        )}>
          <div>
            <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider mb-1">Risk Level</div>
            <div className="text-xl font-black uppercase">{riskLevel || 'Low'}</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center bg-opacity-20 bg-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Explanation Text */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-400" />
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">AI Decision Explanation</div>
        </div>
        <div className="space-y-2">
          {(explanation || []).length > 0 ? (explanation || []).map((point, i) => (
            <div key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed italic font-medium text-left">
              <span className="text-indigo-400 font-bold">•</span>
              <p>"{point}"</p>
            </div>
          )) : (
            <p className="text-sm text-slate-400 italic">No explanation available for this assessment.</p>
          )}
        </div>
      </div>

      {/* Score Legend */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 text-left">Score Legend</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { range: '80-100', label: 'Critical', color: 'bg-rose-500' },
            { range: '60-79', label: 'High', color: 'bg-orange-500' },
            { range: '40-59', label: 'Medium', color: 'bg-amber-500' },
            { range: '0-39', label: 'Low', color: 'bg-emerald-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", item.color)} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                <span className="text-[8px] text-slate-400">{item.range} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 space-y-3">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          AI Recommendations
        </div>
        <div className="flex flex-wrap gap-2">
          {(recommendations || []).length > 0 ? (recommendations || []).map((rec, i) => (
            <span key={i} className="px-3 py-1 bg-white text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 shadow-sm">
              {rec}
            </span>
          )) : (
            <p className="text-sm text-emerald-600 italic">No recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryIcon = ({ category, className }: { category: Category, className?: string }) => {
  switch (category) {
    case 'Road': return <Road className={className} />;
    case 'Water': return <Droplets className={className} />;
    case 'Garbage': return <Trash2 className={className} />;
    case 'Streetlight': return <Lightbulb className={className} />;
  }
};

const SuccessModal = ({ isOpen, onClose, complaintId, emailError, department }: { isOpen: boolean, onClose: () => void, complaintId: string, emailError?: string | null, department: string }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-8 text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Complaint Submitted Successfully</h3>
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-500">
                  ID: #{complaintId}
                </div>
                <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase border border-indigo-100">
                  Routed to: {department}
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-4">
                Your complaint submission is successful. The information will be forwarded to the responsible team and appropriate action will be taken shortly.
              </p>

              {emailError && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium">
                  {emailError}
                </div>
              )}
              
              <button
                onClick={onClose}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                OK
              </button>
            </div>
            
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="h-1.5 bg-emerald-500"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'submit' | 'dashboard' | 'track'>('home');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('civic_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');
  const [lastSubmittedDept, setLastSubmittedDept] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Tracking State
  const [trackId, setTrackId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState<Complaint | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('civic_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Dashboard Filter State
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [dashboardPriority, setDashboardPriority] = useState<Priority | 'All'>('All');
  const [dashboardCategory, setDashboardCategory] = useState<Category | 'All'>('All');

  useEffect(() => {
    localStorage.setItem('civic_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('civic_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const processedComplaints = useMemo(() => {
    const now = new Date();
    return complaints.map(c => {
      const submissionDate = new Date(c.date);
      const diffTime = now.getTime() - submissionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 14 && c.status !== 'Resolved') {
        return { ...c, status: 'Resolved' as Status };
      }
      return c;
    });
  }, [complaints]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Road' as Category,
    state: '',
    district: '',
    city: '',
    landmark: '',
    date: new Date().toISOString().split('T')[0]
  });

  const availableDistricts = useMemo(() => {
    return INDIA_LOCATIONS.find(s => s.name === formData.state)?.districts || [];
  }, [formData.state]);

  const availableCities = useMemo(() => {
    return availableDistricts.find(d => d.name === formData.district)?.cities || [];
  }, [formData.district, availableDistricts]);

  const stats = useMemo(() => {
    const total = processedComplaints.length;
    const resolved = processedComplaints.filter(c => c.status === 'Resolved').length;
    return {
      total,
      resolved,
      pending: total - resolved,
      highPriority: processedComplaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length,
    };
  }, [processedComplaints]);

  const chartData = useMemo(() => {
    const categories = ['Road', 'Water', 'Garbage', 'Streetlight'];
    const categoryData = categories.map(cat => ({
      name: cat,
      count: processedComplaints.filter(c => c.category === cat).length
    }));

    const priorityData = [
      { name: 'Low', value: processedComplaints.filter(c => c.priority === 'Low').length, color: '#10b981' },
      { name: 'Medium', value: processedComplaints.filter(c => c.priority === 'Medium').length, color: '#f59e0b' },
      { name: 'High', value: processedComplaints.filter(c => c.priority === 'High').length, color: '#f97316' },
      { name: 'Critical', value: processedComplaints.filter(c => c.priority === 'Critical').length, color: '#f43f5e' },
    ].filter(d => d.value > 0);

    return { categoryData, priorityData };
  }, [processedComplaints]);

  const filteredComplaints = useMemo(() => {
    return processedComplaints
      .filter(c => {
        const matchesSearch = c.id.toLowerCase().includes(dashboardSearch.toLowerCase()) || 
                            c.title.toLowerCase().includes(dashboardSearch.toLowerCase());
        const matchesPriority = dashboardPriority === 'All' || c.priority === dashboardPriority;
        const matchesCategory = dashboardCategory === 'All' || c.category === dashboardCategory;
        return matchesSearch && matchesPriority && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [processedComplaints, dashboardSearch, dashboardPriority, dashboardCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEmailError(null);

    const { 
      priority, 
      explanation, 
      recommendations, 
      department, 
      departmentEmail, 
      estimatedResolution,
      aiScore,
      aiConfidence,
      riskLevel,
      scoreBreakdown,
      decisionFactors
    } = calculatePriority(formData.title, formData.description, formData.category);
    
    const locationDisplay = `${formData.city}, ${formData.district}, ${formData.state}`;
    const id = `CMP${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint: Complaint = {
      id,
      ...formData,
      location: locationDisplay,
      priority,
      status: 'Submitted',
      explanation,
      daysOpen: 0,
      recommendations,
      department,
      departmentEmail,
      estimatedResolution,
      aiScore,
      aiConfidence,
      riskLevel,
      scoreBreakdown,
      decisionFactors
    };

    try {
      // Initialize EmailJS
      emailjs.init("pMfhj0_LUg7rnJyng");

      const templateParams = {
        complaint_id: id,
        complaint_title: formData.title,
        category: formData.category,
        department_name: department,
        department_email: departmentEmail,
        state: formData.state,
        district: formData.district,
        area: formData.city,
        landmark: formData.landmark || 'N/A',
        complaint_desc: formData.description,
        date: formData.date,
        priority: priority,
        explanation: explanation?.[0] || 'Priority assessment completed.'
      };

      await emailjs.send(
        "service_wqqjazk",
        "template_jlm8dc4",
        templateParams
      );
    } catch (error) {
      console.error("EmailJS Error:", error);
      setEmailError("Complaint saved but email notification failed.");
    }

    setComplaints([newComplaint, ...complaints]);
    setLastSubmittedId(id);
    setLastSubmittedDept(department);
    setShowSuccessModal(true);
    setIsSubmitting(false);
    
    // Clear form
    setFormData({
      title: '',
      description: '',
      category: 'Road' as Category,
      state: '',
      district: '',
      city: '',
      landmark: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleTrack = (id: string = trackId) => {
    const found = processedComplaints.find(c => c.id.toLowerCase() === id.toLowerCase());
    setTrackedComplaint(found || null);
    if (found && !searchHistory.includes(found.id)) {
      setSearchHistory([found.id, ...searchHistory].slice(0, 5));
    }
    if (!found) {
      alert("Complaint ID not found. Please check and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">CivicPulse</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'submit', label: 'Submit Complaint', icon: PlusCircle },
                { id: 'track', label: 'Track Complaint', icon: Search },
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setActiveTab('submit')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              Report Issue
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <section className="relative py-12 md:py-24 overflow-hidden rounded-3xl bg-indigo-900 text-white">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_70%)]" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-xs font-bold uppercase tracking-widest mb-6"
                  >
                    <Zap className="w-3 h-3" /> Smart City Governance
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    AI-Driven Smart Civic <br />
                    <span className="text-indigo-300">Complaint Prioritization</span>
                  </h1>
                  <p className="text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Revolutionizing urban management with Explainable AI and Dynamic Urgency Modeling. 
                    Ensuring critical issues get the attention they deserve, instantly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setActiveTab('submit')}
                      className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 group"
                    >
                      Submit Complaint <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="bg-indigo-800 text-white border border-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all"
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "AI Prioritization",
                    desc: "Intelligent rule-based engine that analyzes keywords and context to rank urgency.",
                    icon: Activity,
                    color: "indigo"
                  },
                  {
                    title: "Explainable AI",
                    desc: "Transparent reasoning for every decision, building trust between citizens and government.",
                    icon: Eye,
                    color: "emerald"
                  },
                  {
                    title: "Dynamic Urgency",
                    desc: "Time-based escalation ensures long-standing issues are never forgotten.",
                    icon: Clock,
                    color: "amber"
                  },
                  {
                    title: "Transparency",
                    desc: "Real-time dashboard providing a clear view of city-wide complaint status.",
                    icon: BarChart3,
                    color: "rose"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", 
                      feature.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                      feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                      feature.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                    )}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </section>
            </motion.div>
          )}

          {activeTab === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-indigo-600 px-8 py-6 text-white">
                  <h2 className="text-2xl font-bold">Report a Civic Issue</h2>
                  <p className="text-indigo-100/80">Our AI will automatically prioritize your request based on urgency.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Complaint Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., Massive pothole on Main St"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Category</label>
                      <select
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as Category})}
                      >
                        <option value="Road">Road</option>
                        <option value="Water">Water</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Streetlight">Streetlight</option>
                        <option value="Flood">Flood</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Assigned Department</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-sm">
                        <Building2 className="w-4 h-4" />
                        {DEPARTMENT_MAPPING[formData.category].name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">State</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <select
                          required
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={formData.state}
                          onChange={e => setFormData({...formData, state: e.target.value, district: '', city: ''})}
                        >
                          <option value="">Select State</option>
                          {INDIA_LOCATIONS.map(s => (
                            <option key={s.name} value={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">District</label>
                      <select
                        required
                        disabled={!formData.state}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                        value={formData.district}
                        onChange={e => setFormData({...formData, district: e.target.value, city: ''})}
                      >
                        <option value="">Select District</option>
                        {availableDistricts.map(d => (
                          <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">City / Area</label>
                      <select
                        required
                        disabled={!formData.district}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                      >
                        <option value="">Select City/Area</option>
                        {availableCities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Near City Hospital"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.landmark}
                      onChange={e => setFormData({...formData, landmark: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Provide details about the issue. Mention if it's near sensitive areas like hospitals or schools."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Submit & Analyze Priority <Zap className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-indigo-600 px-8 py-10 text-white text-center">
                  <h2 className="text-3xl font-bold mb-2">Track Your Complaint</h2>
                  <p className="text-indigo-100/80">Enter your Complaint ID to check real-time progress and AI recommendations.</p>
                  
                  <div className="mt-8 max-w-md mx-auto relative">
                    <input
                      type="text"
                      placeholder="Enter Complaint ID (e.g. CMP1001)"
                      className="w-full pl-12 pr-32 py-4 rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-indigo-400/30 outline-none shadow-lg"
                      value={trackId}
                      onChange={e => setTrackId(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleTrack()}
                    />
                    <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400" />
                    <button 
                      onClick={() => handleTrack()}
                      className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                    >
                      Track
                    </button>
                  </div>

                  {searchHistory.length > 0 && (
                    <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                      <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Recent:</span>
                      {searchHistory.map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            setTrackId(id);
                            handleTrack(id);
                          }}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold transition-colors"
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {trackedComplaint ? (
                  <div className="p-8 space-y-10">
                    {/* Status Tracker - Centered and Full Width */}
                    <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-800 mb-8 uppercase tracking-widest text-center">Live Status Progress</h4>
                      <div className="max-w-3xl mx-auto">
                        <StatusTracker currentStatus={trackedComplaint.status} />
                      </div>
                    </div>

                    {/* Resolution Progress Section */}
                    <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Resolution Progress</h4>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            trackedComplaint.status === 'Resolved' ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                          )}>
                            {trackedComplaint.status === 'Resolved' ? 'Resolved' : `${Math.floor((new Date().getTime() - new Date(trackedComplaint.date).getTime()) / (1000 * 60 * 60 * 24))} Days Passed`}
                          </span>
                        </div>
                      </div>
                      
                      {(() => {
                        const now = new Date();
                        const submissionDate = new Date(trackedComplaint.date);
                        const diffTime = now.getTime() - submissionDate.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        const remainingDays = Math.max(0, 14 - diffDays);
                        const progress = Math.min(100, (diffDays / 14) * 100);
                        const expectedDate = new Date(submissionDate);
                        expectedDate.setDate(expectedDate.getDate() + 14);
                        
                        return (
                          <div className="space-y-4">
                            <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  progress >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                                <div className={cn("text-sm font-bold", progress >= 100 ? "text-emerald-600" : "text-indigo-600")}>
                                  {progress >= 100 ? "Resolved" : "In Progress"}
                                </div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Remaining</div>
                                <div className="text-sm font-bold text-slate-700">
                                  {progress >= 100 ? "0 Days" : `${remainingDays} Days Left`}
                                </div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Date</div>
                                <div className="text-sm font-bold text-slate-700">
                                  {expectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                              </div>
                            </div>

                            {progress >= 100 && (
                              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-emerald-800">Automatic Resolution Complete</p>
                                  <p className="text-xs text-emerald-600 mt-1">
                                    This complaint was automatically marked as resolved after the standard 14-day resolution period.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-10">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Complaint Info */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">
                                  {trackedComplaint.id}
                                </span>
                                <PriorityBadge priority={trackedComplaint.priority} />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-800">{trackedComplaint.title}</h3>
                              <div className="mt-2">
                                <DepartmentBadge category={trackedComplaint.category} />
                              </div>
                              <p className="text-slate-500 mt-3 leading-relaxed">{trackedComplaint.description}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center min-w-[100px]">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                              <StatusBadge status={trackedComplaint.status} />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <MapPin className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location Details</div>
                                <div className="text-xs font-bold text-slate-700 flex flex-wrap gap-x-2">
                                  <span className="text-indigo-600">State:</span> {trackedComplaint.state}
                                  <span className="text-indigo-600 ml-1">District:</span> {trackedComplaint.district}
                                  <span className="text-indigo-600 ml-1">Area:</span> {trackedComplaint.city}
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department Email</div>
                                <div className="text-sm font-bold text-slate-700 truncate">{trackedComplaint.departmentEmail}</div>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted On</div>
                                <div className="text-sm font-bold text-slate-700">{trackedComplaint.date}</div>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Clock className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Resolution</div>
                                <div className="text-sm font-bold text-slate-700">{trackedComplaint.estimatedResolution}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="space-y-6">
                          <StateMapCard stateName={trackedComplaint.state} />

                          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
                            <div className="relative z-10">
                              <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4">AI Priority Score</div>
                              <div className="flex items-end gap-1">
                                <span className="text-4xl font-black">{trackedComplaint.aiScore}</span>
                                <span className="text-sm font-bold text-indigo-200 mb-1">/100</span>
                              </div>
                              <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${trackedComplaint.aiScore}%` }}
                                  className="h-full bg-white rounded-full"
                                />
                              </div>
                              <p className="mt-4 text-xs font-medium text-indigo-100">
                                {trackedComplaint.aiConfidence}% AI Confidence in this assessment.
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                              <ShieldAlert className="w-5 h-5 text-indigo-600" />
                              <h4 className="font-bold text-slate-800">Risk Assessment</h4>
                            </div>
                            <div className={cn(
                              "px-4 py-3 rounded-xl font-black text-center uppercase tracking-widest text-sm",
                              trackedComplaint.riskLevel === 'Critical' ? "bg-rose-100 text-rose-700" :
                              trackedComplaint.riskLevel === 'High' ? "bg-orange-100 text-orange-700" :
                              "bg-emerald-100 text-emerald-700"
                            )}>
                              {trackedComplaint.riskLevel} Risk
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Decision Analysis Section */}
                      <div className="pt-10 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-800">AI Decision Analysis</h3>
                            <p className="text-sm text-slate-500">Deep dive into how our AI prioritized this complaint</p>
                          </div>
                        </div>
                        <AIDecisionAnalysis complaint={trackedComplaint} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">No Complaint Tracked Yet</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">Enter your ID above to see the real-time status of your civic complaint.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: "Total Complaints", value: stats.total, icon: Activity, color: "indigo" },
                  { label: "Resolved Complaints", value: stats.resolved, icon: CheckCircle2, color: "emerald" },
                  { label: "Pending Complaints", value: stats.pending, icon: Clock, color: "orange" },
                  { label: "High Priority", value: stats.highPriority, icon: ShieldAlert, color: "rose" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-2 rounded-lg", 
                        stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                        stat.color === 'rose' ? 'bg-rose-50 text-rose-600' :
                        stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                        'bg-amber-50 text-amber-600'
                      )}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* India Map Visualization */}
              <div className="w-full">
                <IndiaMap complaints={complaints} />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" /> Complaints by Category
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.categoryData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-indigo-600" /> Priority Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.priorityData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Complaints Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">Recent Complaints</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage and track all submitted civic issues.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search ID or Title..."
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-48"
                        value={dashboardSearch}
                        onChange={e => setDashboardSearch(e.target.value)}
                      />
                    </div>
                    
                    <select 
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={dashboardPriority}
                      onChange={e => setDashboardPriority(e.target.value as any)}
                    >
                      <option value="All">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>

                    <select 
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={dashboardCategory}
                      onChange={e => setDashboardCategory(e.target.value as any)}
                    >
                      <option value="All">All Categories</option>
                      <option value="Road">Road</option>
                      <option value="Water">Water</option>
                      <option value="Garbage">Garbage</option>
                      <option value="Streetlight">Streetlight</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Complaint</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredComplaints.length > 0 ? filteredComplaints.map((complaint) => (
                        <tr key={complaint.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setTrackId(complaint.id);
                                  handleTrack(complaint.id);
                                  setActiveTab('track');
                                }}
                                className="font-mono text-xs font-bold text-indigo-600 hover:underline"
                              >
                                {complaint.id}
                              </button>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(complaint.id);
                                }}
                                className="p-1 text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"
                                title="Copy ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="font-bold text-slate-800">{complaint.title}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {complaint.state}, {complaint.district}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <DepartmentBadge category={complaint.category} />
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <PriorityBadge priority={complaint.priority} />
                          </td>
                          <td className="px-8 py-5">
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td className="px-8 py-5">
                            <div className="text-sm text-slate-600 font-medium">
                              {new Date(complaint.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <button 
                              onClick={() => setSelectedComplaint(complaint)}
                              className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              Details <ExternalLink className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={7} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                              <Search className="w-8 h-8 opacity-20" />
                              <p className="font-medium">No complaints found matching your filters.</p>
                              <button 
                                onClick={() => {
                                  setDashboardSearch('');
                                  setDashboardPriority('All');
                                  setDashboardCategory('All');
                                }}
                                className="text-indigo-600 text-sm font-bold hover:underline mt-2"
                              >
                                Clear all filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          setActiveTab('dashboard');
        }} 
        complaintId={lastSubmittedId} 
        emailError={emailError}
        department={lastSubmittedDept}
      />

      {/* AI Explanation Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComplaint(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 z-10 bg-indigo-600 px-8 py-6 text-white flex justify-between items-center shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">AI Decision Analysis</h3>
                    <p className="text-xs text-indigo-100/80">Automated Priority Assessment & Reasoning</p>
                  </div>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="text-indigo-100 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Basic Info Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-widest">
                        {selectedComplaint.id}
                      </span>
                      <StatusBadge status={selectedComplaint.status} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800">{selectedComplaint.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {selectedComplaint.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <DepartmentBadge category={selectedComplaint.category} />
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Submitted: {selectedComplaint.date}
                    </div>
                  </div>
                </div>

                {/* AI Decision Analysis Component */}
                <AIDecisionAnalysis complaint={selectedComplaint} />

                {/* Footer Action */}
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Close Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold tracking-tight text-slate-800">CivicPulse</span>
          </div>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            A smart governance initiative powered by Explainable AI and Dynamic Urgency Modeling.
          </p>
          <div className="mt-8 pt-8 border-t border-slate-100 text-slate-400 text-xs font-medium uppercase tracking-widest">
            © 2024 Smart City Governance Project
          </div>
        </div>
      </footer>
    </div>
  );
}
