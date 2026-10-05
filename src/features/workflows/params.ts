import { parseAsInteger, parseAsString } from "nuqs/server"; // // Import from nuqs/server so these parsers can be shared by client and server code. importing from "nuqs/server" makes these parsers usable in both server and client code, because that entry point has no "use client" directive

import { PAGINATION } from "@/config/constants";

export const workflowsParams = {
   page : parseAsInteger
      .withDefault(PAGINATION.DEFAULT_PAGE)
      .withOptions({ clearOnDefault : true }) // when you update the page through nuqs to its default value (1), nuqs remove the page parameter to keep the url clean 
      ,
   pageSize : parseAsInteger
      .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
      .withOptions({ clearOnDefault : true }),

   search : parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault : true })
};
// Creating this object doesn't parse a URL yet. Other code uses it to perform the parsing.