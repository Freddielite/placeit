import { useEffect, useState } from "react";

const useIsResponsive = () => {
  // Initialize with false to avoid hydration mismatch, update in useEffect
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  //   (()=>()())

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      setIsTablet(width >= 768 && width < 1024);
      if (mobile) setCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { collapsed, isMobile, setCollapsed, setIsMobile, isTablet };
};

export default useIsResponsive;
