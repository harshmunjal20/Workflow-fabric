import  { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const Layout = ({children} : {children : React.ReactNode}) => {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset className = "bg-accent/20"> {/* bg- accent with 20 % opacity */}
            {children}
         </SidebarInset>
      </SidebarProvider>
   );
};

export default Layout;