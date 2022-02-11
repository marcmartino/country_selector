import { CaretDownFill, Search } from "grommet-icons";
import {
  createRef,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import style from "./Select.module.scss";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import { useKeyboardControls } from "./useKeyboardControls";
import { Portal } from "react-portal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useRect } from "../../hooks/useRect";

interface Option {
  label: string;
  value: string;
  filterValue?: string;
}

type Props<T extends Option> = {
  options: T[];
  value: T | undefined;
  onChange: (option: T) => void;
  className?: string;
  placeholder?: string;
  emptySearchMessage?: string;
} & (
  | {
      renderRow: (option: T) => JSX.Element;
      optionHeight: number;
    }
  | {}
);

export const Select = <T extends Option>({
  options,
  value,
  onChange,
  className,
  placeholder = "Select...",
  emptySearchMessage = "No matching items",
  ...props
}: Props<T>) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [searchText, setSearchText] = useState("");
  const preppedSearchText = searchText.trim().toLowerCase();
  const scrollListRef = createRef() as LegacyRef<FixedSizeList<any>>;
  const dropdownListRef = useRef(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const selectButtonRect = useRect(selectButtonRef);

  const closeDropdown = useMemo(() => () => setDropdownActive(false), []);

  useOnClickOutside([dropdownListRef, selectButtonRef], closeDropdown);

  const filteredOptions = searchText.length
    ? options.filter((c) =>
        (c.filterValue || c.value).includes(preppedSearchText)
      )
    : options;

  const { hoveredOptionIndex, setHoveredOptionIndex } = useKeyboardControls({
    optionsLength: filteredOptions.length,
    active: dropdownActive,
    onEnter: useCallback(
      (i) => {
        onChange(filteredOptions[i]);
        setDropdownActive(false);
      },
      [filteredOptions, onChange]
    ),
    onEsc: closeDropdown,
    dropdownScrollRef: scrollListRef,
  });

  const { renderRow, optionHeight } = {
    renderRow: ({ label }: T) => <div style={{ height: 24 }}>{label}</div>,
    optionHeight: 24,
    ...props,
  };

  useEffect(() => {
    if (!dropdownActive) {
      setSearchText("");
      setHoveredOptionIndex(undefined);
    }
  }, [dropdownActive, setHoveredOptionIndex]);

  const Row = useCallback(
    ({ index, style: rowStyle }: { index: number; style: any }) => (
      <div style={rowStyle}>
        <button
          tabIndex={-1}
          className={[
            style.rowButton,
            hoveredOptionIndex === index && style.hoveredRow,
          ].join(" ")}
          onClick={() => {
            onChange(filteredOptions[index]);
            setDropdownActive(false);
          }}
          onMouseEnter={() => setHoveredOptionIndex(index)}
        >
          {renderRow(filteredOptions[index])}
        </button>
      </div>
    ),
    [
      filteredOptions,
      hoveredOptionIndex,
      onChange,
      renderRow,
      setHoveredOptionIndex,
    ]
  );

  return (
    <div className={className}>
      <div style={{ display: "flex", flexGrow: 0 }}>
        <button
          ref={selectButtonRef}
          className={style.valueDropdown}
          onClick={(e) => {
            e.currentTarget.blur();
            return setDropdownActive((a) => !a);
          }}
        >
          {value?.label ? (
            <span>{value.label}</span>
          ) : (
            <span className={style.placeholder}>{placeholder}</span>
          )}
          <CaretDownFill className={style.dropdownIcon} />
        </button>
      </div>
      {dropdownActive && (
        <Portal>
          <div
            style={{
              top: (selectButtonRect?.bottom || 0) + 3,
              left: selectButtonRect?.left || 0,
            }}
            ref={dropdownListRef}
            className={style.dropdownMenu}
          >
            <div className={style.dropdownSearchRow}>
              <Search color="#333" size="12.47" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className={style.searchInput}
                placeholder="Search"
              />
            </div>
            {filteredOptions.length === 0 && options.length > 0 ? (
              <div className={style.emptySearch}>{emptySearchMessage}</div>
            ) : (
              <List
                ref={scrollListRef}
                height={Math.min(163, filteredOptions.length * optionHeight)}
                itemCount={filteredOptions.length}
                itemSize={optionHeight}
                width={230}
              >
                {Row}
              </List>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
};
