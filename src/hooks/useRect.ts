import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useRect = <T extends Element>(
  ref: MutableRefObject<T | null>
): DOMRect | undefined => {
  const [rect, setRect] = useState<DOMRect>();

  const set = useCallback(
    () => setRect(ref.current?.getBoundingClientRect()),
    [ref]
  );
  useEffect(set, [set]);

  useEffect(() => {
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [set]);

  return rect;
};
