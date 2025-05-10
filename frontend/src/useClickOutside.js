import { useEffect } from "react";

export function useClickOutside({
  isActive,
  onOutsideClick,
  ignoreSelectors = [],
}) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isIgnored = ignoreSelectors.some((selector) => {
        const el = event.target.closest(selector);
        return !!el;
      });

      if (isActive && !isIgnored) {
        onOutsideClick();
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isActive, ignoreSelectors, onOutsideClick]);
}
