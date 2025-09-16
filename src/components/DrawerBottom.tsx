"use client";
import React, { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: ReactNode;
  widthClass?: string;     
  maxHeightClass?: string; 
  closeOnBackdropClick?: boolean;
};

export default function DrawerBottom({
  open,
  onOpenChange,
  children,
  title,
  widthClass = "max-w-3xl",
  maxHeightClass = "max-h-[85vh]",
  closeOnBackdropClick = true,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => closeOnBackdropClick && onOpenChange(false)}
      />

      {/* Panel wrapper */}
      <div
        className={`relative w-full ${widthClass} mx-4 sm:mx-auto transform transition-all duration-300 ease-out z-10`}
        style={{ WebkitBackdropFilter: "none", backdropFilter: "none" }}
      >
        <div className={`rounded-t-2xl sm:rounded-2xl bg-black text-white border border-gray-800 shadow-2xl overflow-hidden ${maxHeightClass} animate-drawer-up`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="min-w-0">
              {typeof title === "string" ? (
                <h3 className="text-lg font-extrabold text-yellow-400 truncate">{title}</h3>
              ) : (title)}
            </div>

            <button aria-label="Close" onClick={() => onOpenChange(false)} className="ml-3 inline-flex items-center justify-center rounded-md p-2 bg-gray-900/40 hover:bg-gray-900 transition">
              <X className="h-5 w-5 text-gray-200" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            <div className="backdrop-blur-none filter-none">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
