// This code creates a function that reads url query params on the server using our existing wokflows params
import { createLoader } from "nuqs/server"; // Imports a helper that creates a parsing function.
import { workflowsParams } from "../params";

export const workflowsParamsLoader = createLoader(workflowsParams); // This line creates a parsing function that reads the query params from the URL and parses them according to rules defined in workflowsParams. The result is a function that can be called to get the parsed parameters. This loader doesn't fetch wotkflows or updates the browser url, it gives you parsed values you can pass to your database query.