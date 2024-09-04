import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className='flex justify-center'>
      <div className="mb-4 h-16 flex items-center bg-white rounded-full shadow-sm px-7 pt-2">
        <SearchIcon className="text-gray-500 mb-2" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          className="border-none outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;