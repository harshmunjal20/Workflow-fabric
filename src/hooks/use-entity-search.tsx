import { useState, useEffect } from "react";
import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProps<T extends {
   search : string,
   page : number, // extends matlab can contain other
}> {
   params : T;
   setParams : (params : T) => void;
   debounceMs? : number; // it specify how many milliseconds to wait before updating the search after typing stops
}

export function useEntitySearch<T extends {
   search : string,
   page : number
}> ({params, setParams, debounceMs = 500} : UseEntitySearchProps<T>) {

   const [localSearch, setLocalSearch] = useState(params.search);
   useEffect(() => {
      if (localSearch === "" && params.search !== "") {
         setParams ({
            ...params, // to preserve other properties like pagination etc
            search : "",
            page : PAGINATION.DEFAULT_PAGE
         })
         return;
      } // means user has cleared the search input, so we need to reset the page to 1 and update the search parameter in the URL

      const timer = setTimeout(() => {
         if (localSearch !== params.search) { 
            setParams({
               ...params,
               search : localSearch,
               page : PAGINATION.DEFAULT_PAGE
            })
         }
      }, debounceMs)

      return () => clearTimeout(timer);
   }, [localSearch, params, setParams, debounceMs] );// use this to create debounce effect

   useEffect(() => {
      setLocalSearch(params.search);
   }, [params.search]);

   return {
      searchValue : localSearch,
      onSearchChange : setLocalSearch
   }
}
