import React, { createContext, useState, useContext, useEffect } from 'react';

interface MobileSidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSidebarContext = createContext<MobileSidebarContextType | undefined>(undefined);

export const MobileSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Restore collapse state from localStorage on load
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('mobileSidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);
  
  // Save collapse state to localStorage when changed
  useEffect(() => {
    localStorage.setItem('mobileSidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close sidebar when window is resized above 1000px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <MobileSidebarContext.Provider value={{ 
      isCollapsed, 
      toggleCollapse, 
      isOpen, 
      setIsOpen 
    }}>
      {children}
    </MobileSidebarContext.Provider>
  );
};

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (context === undefined) {
    throw new Error('useMobileSidebar must be used within a MobileSidebarProvider');
  }
  return context;
};