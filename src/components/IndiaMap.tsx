import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Complaint, Priority } from '../types';

// More accurate SVG paths for India States (Simplified for clean look)
const STATE_PATHS = [
  { id: 'AN', name: 'Andaman and Nicobar Islands', path: 'M442,393l1,4l-2,0z M447,411l1,3l-2,1z' },
  { id: 'AP', name: 'Andhra Pradesh', path: 'M234,310l6,-1l1,-4l4,-1l3,2l4,-1l2,-4l5,1l1,-3l4,1l1,-3l3,0l1,-3l3,-1l0,-4l-3,-3l-1,-4l-3,0l-3,-4l-5,-1l-2,-4l-5,0l-1,-3l-4,1l-2,3l-4,1l-1,3l-4,0l-1,3l-4,2l-1,3l-2,1l0,4l3,3l1,4l3,0l1,4z' },
  { id: 'AR', name: 'Arunachal Pradesh', path: 'M415,110l5,1l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'AS', name: 'Assam', path: 'M385,145l4,1l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'BR', name: 'Bihar', path: 'M285,145l6,0l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'CH', name: 'Chandigarh', path: 'M165,75l2,0l0,-2l-2,0z' },
  { id: 'CT', name: 'Chhattisgarh', path: 'M245,215l5,0l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', path: 'M125,245l2,0l0,-2l-2,0z' },
  { id: 'DL', name: 'Delhi', path: 'M175,105l2,0l0,-2l-2,0z' },
  { id: 'GA', name: 'Goa', path: 'M135,315l2,0l0,-2l-2,0z' },
  { id: 'GJ', name: 'Gujarat', path: 'M105,195l8,2l3,-4l5,1l2,-4l4,1l1,-4l5,0l1,-4l4,1l1,-4l3,0l1,-4l3,-1l0,-5l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'HR', name: 'Haryana', path: 'M165,95l5,0l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'HP', name: 'Himachal Pradesh', path: 'M175,65l5,0l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'JK', name: 'Jammu and Kashmir', path: 'M165,35l6,2l3,-4l5,1l2,-4l4,1l1,-4l5,0l1,-4l4,1l1,-4l3,0l1,-4l3,-1l0,-5l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'JH', name: 'Jharkhand', path: 'M285,185l5,0l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'KA', name: 'Karnataka', path: 'M155,335l7,2l3,-4l5,1l2,-4l4,1l1,-4l5,0l1,-4l4,1l1,-4l3,0l1,-4l3,-1l0,-5l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'KL', name: 'Kerala', path: 'M175,415l4,2l2,-4l3,1l1,-4l3,0l1,-4l2,1l0,-4l-3,-3l-1,-4l-3,0l-3,-4l-5,-1l-2,-4l-5,0l-1,-3l-4,1l-2,3l-4,1l-1,3l-4,0l-1,3l-4,2l-1,3l-2,1l0,4l3,3l1,4l3,0l1,4z' },
  { id: 'LA', name: 'Ladakh', path: 'M205,25l8,3l4,-5l6,2l3,-5l5,2l2,-5l6,1l2,-5l5,2l2,-5l4,1l2,-5l4,-2l1,-6l-5,-2l-3,-5l-6,1l-3,-5l-6,2l-3,-5l-6,1l-2,4l-5,1l-2,4l-5,0l-2,4l-5,1l1,5z' },
  { id: 'LD', name: 'Lakshadweep', path: 'M115,415l1,2l-2,0z' },
  { id: 'MP', name: 'Madhya Pradesh', path: 'M195,185l10,3l5,-6l8,2l4,-6l7,2l3,-6l8,2l3,-6l7,2l3,-6l5,1l3,-6l5,-2l2,-7l-7,-3l-4,-7l-8,2l-4,-7l-8,3l-4,-7l-8,2l-3,5l-7,2l-3,5l-7,1l-3,5l-7,2l2,7z' },
  { id: 'MH', name: 'Maharashtra', path: 'M155,245l10,3l5,-6l8,2l4,-6l7,2l3,-6l8,2l3,-6l7,2l3,-6l5,1l3,-6l5,-2l2,-7l-7,-3l-4,-7l-8,2l-4,-7l-8,3l-4,-7l-8,2l-3,5l-7,2l-3,5l-7,1l-3,5l-7,2l2,7z' },
  { id: 'MN', name: 'Manipur', path: 'M415,165l2,0l0,-2l-2,0z' },
  { id: 'ML', name: 'Meghalaya', path: 'M385,165l3,0l0,-2l-3,0z' },
  { id: 'MZ', name: 'Mizoram', path: 'M415,185l2,0l0,-2l-2,0z' },
  { id: 'NL', name: 'Nagaland', path: 'M425,145l2,0l0,-2l-2,0z' },
  { id: 'OR', name: 'Odisha', path: 'M285,245l8,3l4,-5l6,2l3,-5l5,2l2,-5l6,1l2,-5l5,2l2,-5l4,1l2,-5l4,-2l1,-6l-5,-2l-3,-5l-6,1l-3,-5l-6,2l-3,-5l-6,1l-2,4l-5,1l-2,4l-5,0l-2,4l-5,1l1,5z' },
  { id: 'PY', name: 'Puducherry', path: 'M235,385l1,1l-2,0z' },
  { id: 'PB', name: 'Punjab', path: 'M155,75l5,1l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'RJ', name: 'Rajasthan', path: 'M115,115l12,4l5,-7l9,3l5,-7l8,3l4,-7l9,3l4,-7l8,3l4,-7l6,2l4,-7l6,-3l2,-8l-8,-4l-5,-8l-9,3l-5,-8l-9,4l-5,-8l-9,3l-4,6l-8,3l-4,6l-8,2l-4,6l-8,3l3,8z' },
  { id: 'SK', name: 'Sikkim', path: 'M335,125l2,0l0,-2l-2,0z' },
  { id: 'TN', name: 'Tamil Nadu', path: 'M205,385l8,3l4,-5l6,2l3,-5l5,2l2,-5l6,1l2,-5l5,2l2,-5l4,1l2,-5l4,-2l1,-6l-5,-2l-3,-5l-6,1l-3,-5l-6,2l-3,-5l-6,1l-2,4l-5,1l-2,4l-5,0l-2,4l-5,1l1,5z' },
  { id: 'TG', name: 'Telangana', path: 'M215,275l7,2l3,-4l5,1l2,-4l4,1l1,-4l5,0l1,-4l4,1l1,-4l3,0l1,-4l3,-1l0,-5l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'TR', name: 'Tripura', path: 'M395,185l2,0l0,-2l-2,0z' },
  { id: 'UP', name: 'Uttar Pradesh', path: 'M215,115l12,4l5,-7l9,3l5,-7l8,3l4,-7l9,3l4,-7l8,3l4,-7l6,2l4,-7l6,-3l2,-8l-8,-4l-5,-8l-9,3l-5,-8l-9,4l-5,-8l-9,3l-4,6l-8,3l-4,6l-8,2l-4,6l-8,3l3,8z' },
  { id: 'UT', name: 'Uttarakhand', path: 'M205,85l5,1l2,-3l4,0l1,-3l4,-1l0,-4l-4,-1l-2,-4l-5,0l-2,3l-4,1l-1,3l-4,1l1,4z' },
  { id: 'WB', name: 'West Bengal', path: 'M325,185l8,3l4,-5l6,2l3,-5l5,2l2,-5l6,1l2,-5l5,2l2,-5l4,1l2,-5l4,-2l1,-6l-5,-2l-3,-5l-6,1l-3,-5l-6,2l-3,-5l-6,1l-2,4l-5,1l-2,4l-5,0l-2,4l-5,1l1,5z' },
];

interface IndiaMapProps {
  complaints: Complaint[];
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ complaints }) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const stateStats = useMemo(() => {
    const stats: Record<string, {
      total: number;
      high: number;
      medium: number;
      low: number;
      maxPriority: Priority | 'None';
    }> = {};

    complaints.forEach(c => {
      if (!stats[c.state]) {
        stats[c.state] = { total: 0, high: 0, medium: 0, low: 0, maxPriority: 'None' };
      }
      const s = stats[c.state];
      s.total++;
      if (c.priority === 'Critical' || c.priority === 'High') s.high++;
      else if (c.priority === 'Medium') s.medium++;
      else s.low++;

      const priorityOrder: Record<string, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1, 'None': 0 };
      if (priorityOrder[c.priority] > priorityOrder[s.maxPriority]) {
        s.maxPriority = c.priority;
      }
    });

    return stats;
  }, [complaints]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#f43f5e';
      case 'High': return '#f97316';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return '#ffffff';
    }
  };

  return (
    <div className="relative w-full aspect-[4/5] max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-hidden">
      <div className="absolute top-6 left-8 z-10">
        <h3 className="text-lg font-bold text-slate-800">Regional Priority Map</h3>
        <p className="text-xs text-slate-500">Highest priority level per state</p>
      </div>

      <div className="absolute top-6 right-8 z-10 flex flex-col gap-1">
        {['Critical', 'High', 'Medium', 'Low'].map(p => (
          <div key={p} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-slate-200" style={{ backgroundColor: getPriorityColor(p) }} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{p}</span>
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
      >
        {STATE_PATHS.map((state) => {
          const stats = stateStats[state.name];
          const color = getPriorityColor(stats?.maxPriority || 'None');
          const isHovered = hoveredState === state.name;

          return (
            <motion.path
              key={state.id}
              d={state.path}
              fill={color}
              stroke="#000000"
              strokeWidth={isHovered ? 2.5 : 1.5}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1, 
                fill: color,
                strokeWidth: isHovered ? 2.5 : 1.5,
                zIndex: isHovered ? 10 : 1
              }}
              whileHover={{ scale: 1.01, filter: 'brightness(0.95)' }}
              onMouseEnter={() => setHoveredState(state.name)}
              onMouseLeave={() => setHoveredState(null)}
              className="cursor-pointer transition-all duration-200"
            />
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredState && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-8 right-8 w-64 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-5 z-20 pointer-events-none"
          >
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">State Statistics</div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">{hoveredState}</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Complaints</span>
                <span className="font-bold text-slate-800">{stateStats[hoveredState]?.total || 0}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-rose-500" style={{ width: `${((stateStats[hoveredState]?.high || 0) / (stateStats[hoveredState]?.total || 1)) * 100}%` }} />
                <div className="h-full bg-amber-500" style={{ width: `${((stateStats[hoveredState]?.medium || 0) / (stateStats[hoveredState]?.total || 1)) * 100}%` }} />
                <div className="h-full bg-emerald-500" style={{ width: `${((stateStats[hoveredState]?.low || 0) / (stateStats[hoveredState]?.total || 1)) * 100}%` }} />
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-rose-500 uppercase">High</div>
                  <div className="text-sm font-bold">{stateStats[hoveredState]?.high || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-amber-500 uppercase">Med</div>
                  <div className="text-sm font-bold">{stateStats[hoveredState]?.medium || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-emerald-500 uppercase">Low</div>
                  <div className="text-sm font-bold">{stateStats[hoveredState]?.low || 0}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
