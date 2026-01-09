import { SearchIcon } from "../../assets/icons/SearchIcon";
import { CloseIcon } from "../../assets/icons/CloseIcon";
import "./styles.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Buscar cliente...",
  label = "Buscar",
}: SearchInputProps) {
  return (
    <div className="search-input-container">
      {label && <label className="search-input-label">{label}</label>}
      <div className="search-input-wrapper">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="search-input-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="search-clear-button"
            onClick={onClear}
            aria-label="Limpar busca"
            title="Limpar busca"
          >
            <CloseIcon className="search-clear-icon" />
          </button>
        )}
      </div>
    </div>
  );
}
