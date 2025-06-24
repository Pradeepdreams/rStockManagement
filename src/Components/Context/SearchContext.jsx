import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => {
    return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] =
        useState("");
    const [Flag, setFlag] = useState("");

    return (
        <SearchContext.Provider
            value={{
                searchTerm,
          
                setSearchTerm,
                Flag,
                setFlag,
              
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
