import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
   params : Promise<{
      credentialId: string; // route params changed from plain synchronous to aycnhronous promises
   }> 
};

// http://localhost:3000/credentials/123
const page = async ({params} : PageProps) => {
   await requireAuth();
   const { credentialId } = await params;

   return (
      <p>
         Credential id : {credentialId}
      </p>
   )
}

export default page;