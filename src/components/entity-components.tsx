import { AlertTriangleIcon, Loader2Icon, PackageOpenIcon, PlusIcon, SearchIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { ReactNode } from "react";
// entity refers to credentials, workflows, executions
import {
   Empty,
   EmptyContent,
   EmptyDescription,
   EmptyHeader,
   EmptyMedia,
   EmptyTitle
} from "./ui/empty";

import { 
   Card,
   CardContent,
   CardDescription,
   CardTitle
} from "./ui/card";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from "./ui/dropdown-menu";

import { cn } from "@/lib/utils";
type EntityHeaderProps = { // shared props
   title : string,
   description? : string, // optional
   newButtonLabel : string,
   disabled? : boolean,
   isCreating? : boolean 
} & ( // rules about how "New" button works
   | {onNew : () => void; newButtonHref? : never} // never means no value is allowed
   | {newButtonHref : string; onNew? : never}
   | {onNew? : never; newButtonHref? : never} // | means one of these alternatives
);

export const EntityHeader = ({title, description, onNew, newButtonHref, newButtonLabel, disabled, isCreating} : EntityHeaderProps) => {
   return (
      <div className= 'flex flex-row items-center justify-between gap-x-4'>
         <div className = 'flex flex-col'>
            <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
            {description && 
               <p className= "text:xs md:text-sm text-muted-foreground">  
                  {description}
               </p>}
         </div>

         {onNew && !newButtonHref &&
            <Button disabled= {isCreating || disabled} size="sm" onClick = {onNew}>
               <PlusIcon className="size-4 "/>
               {newButtonLabel} 
            </Button>
         }

         {newButtonHref && !onNew &&
            <Button size="sm" asChild>
               <Link href = {newButtonHref} prefetch>
                  <PlusIcon className="size-4 "/>
                  {newButtonLabel} 
               </Link>
            </Button>
         }
      </div>
   );
};

type EntityContainerProps = {
   children : React.ReactNode,
   header? : React.ReactNode,
   search? : React.ReactNode,
   pagination? : React.ReactNode,
};

export const EntityContainer = ({
   children, header, search, pagination
} : EntityContainerProps) => {
   return (
      <div className= "p-4 md:px-10 md:py-6 h-full"> 
         <div className= "mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full ">
            {header}

            <div className="flex flex-col gap-y-4 h-full">
               {search}
               {children} {/* children is the content of the component */}
            </div>

            {pagination}
         </div>
      </div>
   );
};

interface EntitySearchProps {
   value : string,
   onChange : (value : string) => void,
   placeholder? : string
}; // interface is a type that can be used to define the shape of an object. It is similar to a type alias, but it can be extended and implemented by other interfaces and classes.

export const EntitySearch = ({value, onChange, placeholder = "Search"} : EntitySearchProps) => {
   return (
      <div className = "relative ml-auto">
         <SearchIcon className= "size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
         <Input 
            className="max-w-[200px] bg-background shadow-none border-border pl-8"
            placeholder = {placeholder}
            value = {value}
            onChange = {(e) => onChange(e.target.value)} // target is the input element, value is the current value of the input element, e is the event object that is passed to the onChange handler when the input value changes
         />
      </div>
   )
};

interface EntityPaginationProps {
   page : number,
   totalPages : number,
   onPageChange : (page: number) => void,
   disabled? : boolean
};

export const EntityPagination = ({page, totalPages, onPageChange, disabled}: EntityPaginationProps) => {
   return (
      <div className= "flex items-center justify-between gap-x-2 w-full">
         <div className= "flex-1 text-sm text-muted-foreground">
            Page {page} of { totalPages || 1} {/* if totalPages is undefined, then show 1 */}
         </div>

         <div className = "flex items-center justify-end space-x-2 py-4">
            <Button
               disabled = {page === 1 || disabled}
               variant = "outline"
               size = "sm"
               onClick = {() => onPageChange(Math.max(1, page - 1))}
            >
               Previous
            </Button>

            <Button
               disabled = {page == totalPages || totalPages == 0 || disabled}
               variant = "outline"
               size = "sm"
               onClick = {() => onPageChange(Math.min(totalPages, page + 1))}
            >
               Next
            </Button>
         </div>
      </div>
   )
} 

interface StateViewProps {
   message? : string, // message to display
};

export const LoadingView = ({
   message
} : StateViewProps) => {
   return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
         <Loader2Icon className="size-6 animate-spin text-primary" />
         {!!message &&  // !! added to convert the message to a boolean
            <p className="text-sm text-muted-foreground">
               {message}
            </p>
         } 
      </div>
   )
}

export const ErrorView = ({
   message
} : StateViewProps) => {
   return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
         <AlertTriangleIcon className="size-6 text-primary" />
         {!!message &&  // !! added to convert the message to a boolean
            <p className="text-sm text-muted-foreground">
               {message}
            </p>
         } 
      </div>
   )
}

interface EmptyViewProps extends StateViewProps {
   onNew? : () => void;
};

export const EmptyView = ({message, onNew} : EmptyViewProps) => {
   return (
      <Empty className= "border border-dashed bg-white ">
         <EmptyHeader>
            <EmptyMedia variant = "icon">
               <PackageOpenIcon />
            </EmptyMedia>
         </EmptyHeader>

         <EmptyTitle>
            No items
         </EmptyTitle>


         {!!message && (
            <EmptyDescription>
               {message}
            </EmptyDescription>  
         )}

         {!!onNew && (
            <EmptyContent>
               <Button onClick = {onNew} >
                  Add Item
               </Button>
            </EmptyContent>
         )}
      </Empty>
   );
}

interface EntityListProps<T> {
   items : T[],
   renderItem : (item : T, index : number) => ReactNode;
   getKey? : (item : T, index : number) => string | number;
   emptyView? : ReactNode;
   className? : string;
};

export function EntityList<T>({items, renderItem, getKey, emptyView, className} : EntityListProps<T>) {
   if (items.length === 0 && emptyView) { // array contains no items and emptyView is truthy
      return (
         <div className="flex flex-1 justify-center items-center">
            <div className = "max-w-sm mx-auto">
               {emptyView}
            </div>
         </div>
      )
   }
   return (
      <div className={cn("flex flex-col gap-y-4", className)}>
         {items.map((item, index) => (
            <div key = {getKey ? getKey(item, index) : index}>
               {renderItem(item, index)}
            </div>
         ))}
      </div>
   )
}  

interface EntityItemProps {
   href : string;
   title : string;
   subtitle? : ReactNode;
   image? : ReactNode;
   actions? : ReactNode;
   onRemove? : () => void | Promise<void>;
   isRemoving? : boolean;
   className? : string;
}

export const EntityItem = ({href, title, subtitle, image, actions, onRemove, isRemoving, className} : EntityItemProps) => {
   const handleRemove = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isRemoving) {
         return; // why are we trying to remove something that is already being removed
      }

      if (onRemove) {
         await onRemove();
      }
   }
   
   return (
      <Link href={href} prefetch>
         <Card
            className= {cn(
               "p-4 shadow-none hover:shadow cursor:pointer", isRemoving && "opacity-50 cursor-not-allowed", className)}
         >
            <CardContent className= "flex flex-row items-center justify-between p-0">
               <div className = "flex items-center gap-3">
                  {image}
                  <div>
                     <CardTitle className= "text-base font-medium ">
                        {title}
                     </CardTitle>
                     {!!subtitle && ( // first ! negates its truthiness; the second flips it back.
                        <CardDescription className="text-xs">
                           {subtitle}
                        </CardDescription>
                     )}
                  </div>
               </div>

               {(actions || onRemove) && (
                  <div className = "flex gap-x-4 items-center">
                     {actions}
                     {onRemove && 
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button 
                                 size = "icon"
                                 onClick = {(e) => e.stopPropagation()} // so that it don't go to above href in Link element
                                 variant = "ghost"
                              >
                                 <MoreVerticalIcon className= "size-4" />
                              </Button>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent
                              align ="end"
                              onClick ={(e) => e.stopPropagation()}
                           >
                              <DropdownMenuItem onClick = {handleRemove}>
                                 <TrashIcon className = "size-4 "/>
                                 Delete
                              </DropdownMenuItem>
                              
                           </DropdownMenuContent>
                        </DropdownMenu>}
                  </div>
               )}
            </CardContent>
         </Card>
      </Link> 
      // {/* added so that by clicking to this link , you will be redirected to that item component */}
   );
};