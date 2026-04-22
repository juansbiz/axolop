import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal } from 'lucide-react';

const DraggablePanel = ({ children, isOpen, onClose, title = "Add Element", defaultPosition = 'bottom' }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Initialize position based on default
  useEffect(() => {
    if (panelRef.current && isOpen) {
      const panelRect = panelRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (defaultPosition === 'bottom') {
        setPosition({
          x: (viewportWidth - panelRect.width) / 2,
          y: viewportHeight - panelRect.height - 32
        });
      } else if (defaultPosition === 'center') {
        setPosition({
          x: (viewportWidth - panelRect.width) / 2,
          y: (viewportHeight - panelRect.height) / 2
        });
      }
    }
  }, [isOpen, defaultPosition]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      const panelRect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - panelRect.left,
        y: e.clientY - panelRect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && panelRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const panelRect = panelRef.current.getBoundingClientRect();
      const maxX = window.innerWidth - panelRect.width;
      const maxY = window.innerHeight - panelRect.height;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bg-white/95 dark:bg-[#1a1d24]/95 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50 max-w-4xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Drag Handle */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-5 w-5 text-gray-400" />
          <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;
