import  { requireAuth }  from "@/lib/auth-utils"; 

interface PageProps {
   params : Promise<{
      executionId : string
   }>
};

// http://localhost:3000/executions/123

const page = async ({ params } : PageProps) => {
   await requireAuth();
   
   const { executionId } = await params;

   return (
      <p>
         Execution Id : {executionId}
      </p>
   )
}

export default page;