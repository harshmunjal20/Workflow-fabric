// For settings icon of trigger node
"use client";
import z from "zod";

import { 
   Dialog, 
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogFooter
} from "@/components/ui/dialog";

import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

const formSchema = z.object({
   endpoint : z.string().url({ message : "Please enter a valid URL"}),  // error message inside
   method : z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
   body : z
      .string()
      .optional() // in case of get method, it is optional
      // .refine() TODO // going to accept a specific template language that we will implement later (JSON5)

});

export type FormType = z.infer<typeof formSchema>;

interface Props {
   open : boolean,
   onOpenChange : (open : boolean) => void,
   onSubmit : (values : FormType) => void,
   defaultEndpoint? : string,
   defaultMethod? : 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE',
   defaultBody? : string
};

export const HttpRequestDialog = ({open, onOpenChange, onSubmit, defaultEndpoint = "", defaultMethod = "GET", defaultBody = ""} : Props) => {
   const form = useForm<FormType>({
      resolver : zodResolver(formSchema),
      defaultValues : {
         endpoint : defaultEndpoint,
         method : defaultMethod,
         body : defaultBody
      }
   });

   // Reset form values when dialog opens with new defaults
   useEffect(() => {
      if (open) {
         form.reset({
            endpoint : defaultEndpoint,
            method : defaultMethod,
            body : defaultBody
         })
      }
   }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

   const watchMethod = form.watch("method"); // get the value of the method field
   const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

   const handleSubmit = (values : FormType) => {
      onSubmit(values);
      onOpenChange(false); //close the dialog
   }

   return (
      <Dialog open = {open} onOpenChange = {onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>HTTP Request</DialogTitle>
               <DialogDescription>
                  Configure settings for HTTP Request node.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit = {form.handleSubmit(handleSubmit)}
                  className = "space-y-8 mt-4"
               >
                  <FormField 
                     control = {form.control}
                     name = "method"
                     render = {({field}) => (
                        <FormItem>
                           <FormLabel>Method</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger className="w-full">
                                    <SelectValue placeholder = "Select a method"/>
                                 </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                 <SelectItem value = "GET">GET</SelectItem>
                                 <SelectItem value = "POST">POST</SelectItem>
                                 <SelectItem value = "PUT">PUT</SelectItem>
                                 <SelectItem value = "PATCH">PATCH</SelectItem>
                                 <SelectItem value = "DELETE">DELETE</SelectItem>
                              </SelectContent>
                           </Select>

                           <FormDescription>
                              The HTTP method to use for this request
                           </FormDescription>
                           {/* FormMessage will give an error for this specific field */}
                           <FormMessage/> 

                        </FormItem>
                     )}
                  />

                  <FormField 
                     control = {form.control}
                     name = "endpoint"
                     render = {({field}) => (
                        <FormItem>
                           <FormLabel>Endpoint URL</FormLabel>
                           <FormControl>
                              <Input 
                                 placeholder="https://example.com/users/{{httpResponse.data.id}}"
                                 {...field}
                              />
                           </FormControl>
                           <FormDescription>
                              Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                           </FormDescription>
                           {/* FormMessage will give an error for this specific field */}
                           <FormMessage/> 
                        </FormItem>
                     )}
                  />

                  {showBodyField && (
                     <FormField 
                        control = {form.control}
                        name = "body"
                        render = {({field}) => (
                           <FormItem>
                              <FormLabel>Request Body</FormLabel>
                              <FormControl>
                                 <Textarea 
                                    placeholder='{\n "userId": "{{httpResponse.data.id}}", \n
                                       "name" : "{{httpResponse.data.name}}, \n 
                                       "items" : "{{httpResponse.data.items}}"\n}'
                                    className= "min-h-[120px] font-mono text-sm"
                                 />
                              </FormControl>
                              <FormDescription>
                                 JSON with template variables. 
                                 Use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                              </FormDescription>
                              {/* FormMessage will give an error for this specific field */}
                              <FormMessage/> 
                           </FormItem>
                        )}
                     />
                  )}

                  <DialogFooter className = "mt-4">
                     <Button type = "submit">Save</Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}