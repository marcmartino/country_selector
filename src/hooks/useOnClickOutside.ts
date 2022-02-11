import { RefObject, useEffect } from "react";

// https://usehooks.com/useOnClickOutside/
export const useOnClickOutside = (
  refs: RefObject<any>[],
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (refs.some((r) => !r.current || r.current.contains(event.target))) {
        return;
      }

      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
};
