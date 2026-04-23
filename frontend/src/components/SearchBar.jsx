import { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // Debounce the search query to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="search-bar-container fade-in-up">
      <div className="search-bar">
        <IoSearchOutline className="search-icon" />
        <input
          type="text"
          placeholder="Search by city, title, or amenities (e.g., 'Miami', 'Pool', 'Villa')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
