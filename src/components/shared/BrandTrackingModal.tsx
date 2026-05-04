'use client'
import React from 'react';
import { X } from 'lucide-react';

interface BrandTrackingModalProps {
  isOpen: boolean;
  onStartTracking: () => void;
  onClose: () => void;
  brandName?: string;
}

export default function BrandTrackingModal({ 
  isOpen, 
  onStartTracking, 
  onClose, 
  brandName 
}: BrandTrackingModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-black border border-white/10 max-w-md w-full p-8 relative">
        {/* Close button */}
        <button
                onClick={() => {
            console.log('🧹 Clearing localStorage selectedBrandId');
            localStorage.removeItem('selectedBrandId');
            window.location.reload();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            
            <h3 className="text-xl  font-bold text-white mb-3">
              Heads up!
            </h3>
            
            <p className="text-white/60 text-sm leading-relaxed">
              Looks like the product {brandName && (
                <span className="font-bold text-white">"{brandName}"</span>
              )} is flying under our radar. We don't have historical data yet, but we'll start monitoring it from today.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={onStartTracking}
              className="w-full bg-primary text-black  font-bold py-4 px-6 hover:bg-white transition-all duration-300"
            >
              Great, Start Tracking!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 


