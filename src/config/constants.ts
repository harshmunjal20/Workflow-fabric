export const PAGINATION = {
   DEFAULT_PAGE : 1,
   DEFAULT_PAGE_SIZE : 1, // show 10 items per page by default
   MAX_PAGE_SIZE : 10, // allow at most 10 items per page
   MIN_PAGE_SIZE : 1 // allow at most 1 item per page
}; // exports a set of pagination settings

// Pagination splits a long list of results into smaller pages.
// These values don't enforce pagination by themselves -- other code must use them to apply defaults and validate requests