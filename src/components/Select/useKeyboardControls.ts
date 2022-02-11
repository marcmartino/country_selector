import { useEffect, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";

type KeyboardControlParams = {
  optionsLength: number;
  active: boolean;
  onEnter: (newIndex: number) => void;
  onEsc: () => void;
  dropdownScrollRef: any;
};

export const useKeyboardControls = ({
  optionsLength,
  active,
  onEnter,
  onEsc,
  dropdownScrollRef,
}: KeyboardControlParams) => {
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number>();
  const upPressed = useKeyPress("ArrowUp");
  const downPressed = useKeyPress("ArrowDown");
  const enterPressed = useKeyPress("Enter");
  const escPressed = useKeyPress("Escape");

  useEffect(() => {
    active &&
      upPressed &&
      setHoveredOptionIndex((i) => {
        const newIndex = i !== undefined && i > 0 ? i - 1 : optionsLength - 1;

        if (dropdownScrollRef.current) {
          dropdownScrollRef.current.scrollToItem(newIndex, "smart");
        }
        return newIndex;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upPressed, optionsLength, active]);

  useEffect(() => {
    active &&
      downPressed &&
      setHoveredOptionIndex((i) => {
        const newIndex = i !== undefined && i < optionsLength - 1 ? i + 1 : 0;

        if (dropdownScrollRef.current) {
          dropdownScrollRef.current.scrollToItem(newIndex, "smart");
        }
        return newIndex;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downPressed, optionsLength, active]);

  useEffect(() => {
    active && enterPressed && hoveredOptionIndex && onEnter(hoveredOptionIndex);
  }, [active, enterPressed, hoveredOptionIndex, onEnter]);

  useEffect(() => {
    active && escPressed && onEsc();
  }, [active, escPressed, onEsc]);

  return { hoveredOptionIndex, setHoveredOptionIndex };
};
