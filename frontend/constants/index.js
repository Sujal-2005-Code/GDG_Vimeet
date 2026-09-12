import { useMediaQuery } from "react-responsive";

export const useMaskSettings = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  if (isMobile) {
    return {
      // Center the mask and start extremely zoomed-in for a crisp reveal
      initialMaskPos: "80% 50%",
      initialMaskSize: "6000% 6000%",
      // Slightly higher vertical anchor to account for safe area/toolbars on mobile
      maskPos: "50% 45%",
      // End a bit larger on mobile so glyphs remain legible
      maskSize: "66% 66%",
    };
  }

  if (isTablet) {
    return {
      initialMaskPos: "50% 50%",
      initialMaskSize: "5500% 5500%",
      maskPos: "50% 40%",
      maskSize: "40% 40%",
    };
  }

  return {
    initialMaskPos: "50% 20%",
    initialMaskSize: "5000% 5000%",
    maskPos: "50% 45%",
    maskSize: "24% 24%", // slightly larger for smoother end size
  };
};