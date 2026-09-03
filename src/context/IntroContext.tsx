import React, { createContext, useContext, useState, useEffect } from "react";
import { PlatformIntroModal } from "../components/ui/PlatformIntroModal";

interface IntroContextType {
  openIntro: () => void;
  closeIntro: () => void;
  isIntroOpen: boolean;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [isIntroOpen, setIsIntroOpen] = useState(false);

  const openIntro = () => setIsIntroOpen(true);
  const closeIntro = () => setIsIntroOpen(false);

  // Listen for custom window event if triggered from anywhere
  useEffect(() => {
    const handleOpenEvent = () => setIsIntroOpen(true);
    window.addEventListener("open-platform-intro", handleOpenEvent);
    return () => window.removeEventListener("open-platform-intro", handleOpenEvent);
  }, []);

  return (
    <IntroContext.Provider value={{ openIntro, closeIntro, isIntroOpen }}>
      {children}
      <PlatformIntroModal isOpen={isIntroOpen} onClose={closeIntro} />
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    return {
      openIntro: () => {
        window.dispatchEvent(new CustomEvent("open-platform-intro"));
      },
      closeIntro: () => {},
      isIntroOpen: false,
    };
  }
  return context;
}
