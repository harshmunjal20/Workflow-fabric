"use client"; // because it will often be rendered in server components

import {
   CreditCardIcon,
   FolderOpen,
   FolderOpenIcon,
   HistoryIcon,
   KeyIcon,
   LogOutIcon,
   StarIcon
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarFooter,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
   SidebarMenuButton
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription"; 

const menuItems = [
   {
      title: "workflows",
      items : [
         {
            title : "Workflows",
            icon : FolderOpenIcon,
            url : "/workflows"
         },
         {
            title: "Credentials",
            icon: KeyIcon,
            url: "/credentials"
         },
         {
            title: "Executions",
            icon: HistoryIcon,
            url : "/executions"
         }
      ] // array of routes
   }
]; // array of objects, each object will be defintion of a route

export const AppSidebar = () => {
   const router = useRouter();
   const pathname = usePathname();
   const { hasActiveSubscription , isLoading } = useHasActiveSubscription();

   return (// collapsible is a type of icon
      <Sidebar collapsible = "icon"> 
         <SidebarHeader>
            <SidebarMenuItem>
               <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                  <Link href= "/" prefetch>
                     <Image src = "/logos/logo.svg" alt = "workflow-fabric" width = {30} height = {30}/>
                     <span className="font-semibold text-sm ">Workflow Fabric</span>
                  </Link>
               </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarHeader>

         <SidebarContent>
            {menuItems.map(group => (
               <SidebarGroup key = {group.title}>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        {group.items.map((item) => (
                           <SidebarMenuItem key = {item.title}>
                              <SidebarMenuButton // sidebarMenuButton is link because it is not valid to have a href element inside a button
                                 tooltip = {item.title} // tooltip is the name of the route
                                 isActive = {item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                                 asChild // this element becomes whatever we put as a first child inside
                                 className="gap-x-4 h-10 px-4 "
                              >
                                 <Link href={item.url} prefetch>
                                    <item.icon className="size-4" />
                                    <span>
                                       {item.title}
                                    </span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}
         </SidebarContent>

         <SidebarFooter>
            <SidebarMenu>
               {!hasActiveSubscription && !isLoading && (
                  <SidebarMenuItem>
                     <SidebarMenuButton
                        tooltip = "Upgrade to Pro"
                        className = "gap-x-4 h-10 px-4"
                        onClick = {() => authClient.checkout({
                           slug : "pro",
                        })}
                     >
                        <StarIcon className="h-4 w-4"/>
                        <span>Upgrade to Pro</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               )}

               <SidebarMenuItem>
                  <SidebarMenuButton
                     tooltip = "Billing Portal"
                     className = "gap-x-4 h-10 px-4"
                     onClick = {() => authClient.customer.portal()}
                  >
                     <CreditCardIcon className="h-4 w-4"/>
                     <span>Billing Portal</span>
                  </SidebarMenuButton>
               </SidebarMenuItem>

               <SidebarMenuItem>
                  <SidebarMenuButton
                     tooltip = "Sign out"
                     className = "gap-x-4 h-10 px-4"
                     onClick = {() => {
                        authClient.signOut({
                           fetchOptions : {
                              onSuccess : () => {
                                 router.push("/login");
                              }
                           }
                        }); // opening an object inside
                     }}
                  >
                     <LogOutIcon className="h-4 w-4"/>
                     <span>Sign out</span>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   )
}