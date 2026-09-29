import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = () => {
   return useQuery({
      queryKey : ["subscription"],
      queryFn : async () => {
         const {data } = await authClient.customer.state();

         return data;
      }
   })
}; // useSubscription is my custom hook

export const useHasActiveSubscription = () => {
   const { data : customerState, isLoading, ...rest} = useSubscription(); // ... rest means rest of the things

   const hasActiveSubscription =  customerState?.activeSubscriptions && customerState.activeSubscriptions.length > 0;

   return {
      hasActiveSubscription,
      subscription : customerState?.activeSubscriptions?.[0],
      isLoading,
      ...rest
   };
};