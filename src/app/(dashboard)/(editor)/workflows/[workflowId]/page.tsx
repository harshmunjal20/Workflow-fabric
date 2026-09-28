import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
   params : Promise<{
      workflowId : string
   }>
};

// http://localhost:3000/workflows/123

const page = async ({ params } : PageProps) => {
   const { workflowId } = await params;

   return (
      <p>
         Workflow Id : {workflowId}
      </p>
   )
}

export default page;