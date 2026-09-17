"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';

import { 
   Card, 
   CardContent, 
   CardDescription,
   CardHeader,
   CardTitle
}
from "@/components/ui/card";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

// Now this schema will be having email and password so i am creating its schema

const RegisterSchema = z.object({
   email : z.string().email("Please enter a valid email address"), // These are error messages if rules are broken
   password : z.string().min(8, "Password must be at least 8 characters long"),
   confirmPassword : z.string()
})
.refine((data) => 
   data.password === data.confirmPassword, {
      message : "Passwords do not match",
      path : ["confirmPassword"]
   } // if password don't match then the next line with parenthesis will be executed
)

// .refine(  IS_THIS_OK?  ,  WHAT_TO_SAY_IF_NOT_OK  )
         //    ↑ true = let in , ↑ false = reject with the message

type RegisterFormValues = z.infer<typeof RegisterSchema>; // means loginSchema is a type of loginForm

export function RegisterForm() {
   const router = useRouter();
   const form = useForm<RegisterFormValues>({ // useForm type is RegisterFormValues
      resolver : zodResolver(RegisterSchema),
      defaultValues : {
         email : "",
         password : "",
         confirmPassword : ""
      }
   });

   const onSubmit = async (values : RegisterFormValues) => {
      await authClient.signUp.email({
         name : values.email,
         email : values.email,
         password : values.password,
         callbackURL : "/",
      },
      {
         onSuccess : () => {
            router.push("/");
         },
         onError : (context) => {
            toast.error(context.error.message);
         } 
      })
   }

   const isPending = form.formState.isSubmitting;

   return (
      <div className = "flex flex-col gap-6">
         <Card>
            <CardHeader className='text-center '>
               <CardTitle>
                  Get Started
               </CardTitle>

               <CardDescription>
                  Create your account to get started
               </CardDescription>
            </CardHeader>

            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <div className='grid gap-6'>
                        <div className='flex flex-col gap-4'>
                           <Button variant = 'outline' 
                           className= "w-full"
                           type = 'button' 
                           disabled = {isPending}
                           > {/* type is button not submit so it does not accidently trigger the submit action*/}
                              Continue With Github
                           </Button>

                           <Button variant = 'outline' 
                           className= "w-full"
                           type = 'button' 
                           disabled = {isPending}
                           > {/* type is button not submit so it does not accidently trigger the submit action*/}
                              Continue With Google
                           </Button>
                        </div>
                        <div className='grid gap-6 '>
                           <FormField
                              control = {form.control}
                              name = "email"
                              render = {({ field }) => (
                              <FormItem>
                                 <FormLabel> Email </FormLabel>
                                 <FormControl>
                                    <Input 
                                       type = "email"
                                       placeholder="harsh@example.com"
                                       {...field}
                                    />
                                 </FormControl>

                                 <FormMessage />

                              </FormItem>
                              )
                           }/>

                           <FormField
                              control = {form.control}
                              name = "password"
                              render = {({ field }) => (
                              <FormItem>
                                 <FormLabel> Password </FormLabel>
                                 <FormControl>
                                    <Input 
                                       type = "password"
                                       placeholder="********"
                                       {...field}
                                    />
                                 </FormControl>

                                 <FormMessage />
                                 
                              </FormItem>
                              )
                           }/>

                           <FormField
                              control = {form.control}
                              name = "confirmPassword"
                              render = {({ field }) => (
                              <FormItem>
                                 <FormLabel> Confirm password </FormLabel>
                                 <FormControl>
                                    <Input 
                                       type = "password"
                                       placeholder="********"
                                       {...field}
                                    />
                                 </FormControl>

                                 <FormMessage />
                                 
                              </FormItem>
                              )
                           }/>

                           <Button type ="submit" className="w-full" disabled = {isPending}>
                              Signup
                           </Button>
                        </div>

                        <div className="text-center text-sm">
                           Already have an account?{" "}
                           <Link href="/login" className="underline-offset-4">
                              Login
                           </Link>
                        </div>
                     </div>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </div>
   )
};

export default RegisterForm;