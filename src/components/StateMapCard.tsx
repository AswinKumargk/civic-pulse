
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Maximize2, X, Loader2 } from 'lucide-react';
import { STATE_IMAGES, DEFAULT_STATE_IMAGE } from '../constants';
import { cn } from '../lib/utils';

interface StateMapCardProps {
  stateName: string;
  className?: string;
}

export const StateMapCard: React.FC<StateMapCardProps> = ({ stateName, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const imageUrl = imgError ? DEFAULT_STATE_IMAGE : (STATE_IMAGES[stateName] || DEFAULT_STATE_IMAGE);

  useEffect(() => {
    setIsLoading(true);
    setImgError(false);
  }, [stateName]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4", className)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 p-1.5 rounded-lg">
              <MapPin className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">📍 Complaint Location Map</h4>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">State: {stateName}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsZoomed(true)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
            title="Zoom Map"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div 
          className="relative group cursor-zoom-in overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 min-h-[192px] flex items-center justify-center"
          onClick={() => setIsZoomed(true)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}
          
          <motion.img
            src={imageUrl}
            alt={`${stateName} Map`}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setImgError(true);
              setIsLoading(false);
            }}
            className={cn(
              "w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            whileHover={{ scale: 1.05 }}
          />
          
          {!isLoading && (
            <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/5 transition-colors duration-300" />
          )}
          
          {/* Zoom Indicator */}
          {!isLoading && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <Maximize2 className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{stateName}</span>
          </div>
          <p className="text-[10px] text-slate-400 text-center italic">
            {imgError ? "Default Map (State map not available)" : `Visual representation of ${stateName} location.`}
          </p>
        </div>
      </motion.div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setIsZoomed(false)}
                  className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all text-slate-600 hover:text-rose-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 md:p-12 flex flex-col items-center">
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{stateName}</h3>
                  <p className="text-slate-500 text-sm">Complaint Location State Map</p>
                </div>
                
                <img
                  src={imageUrl}
                  alt={`${stateName} Map Zoomed`}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-full object-contain rounded-xl"
                />
                
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                    <MapPin className="w-4 h-4" />
                    {stateName}
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute inset-0 -z-10" onClick={() => setIsZoomed(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
