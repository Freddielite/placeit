"use client";

import React from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed  mx-auto inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className=" w-[90%] max-w-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
