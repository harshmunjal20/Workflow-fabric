"use client";

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image';
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

interface LoginFormDefaultValues {
   email: string;
   password: string;
}

interface SignInErrorContext {
   error: {
      message: string;
   };
}

const loginSchema = z.object({
   email : z.string().email("Please enter a valid email address"), // These are error messages if rules are broken
   password : z.string().min(1, "Password is required")
})

type LoginFormValues = z.infer<typeof loginSchema>; // means loginSchema is a type of loginForm

export function LoginForm() {
   const router = useRouter();
   const defaultValues: LoginFormDefaultValues = {
      email : "",
      password : ""
   };

   const form = useForm<LoginFormValues>({ // useForm type is LoginFormValues
      resolver : zodResolver(loginSchema),
      defaultValues
   });
   const onSubmit = async (values : LoginFormValues) => {
      await authClient.signIn.email({
         email : values.email,
         password : values.password,
         callbackURL : "/"
      }), {
         onSuccess : () => {
            router.push('/')
         },
         onError : (context: SignInErrorContext) => {
            toast.error(context.error.message);
         }
      }
   }

   const isPending = form.formState.isSubmitting;

   return (
      <div className = "flex flex-col gap-6">
         <Card>
            <CardHeader className='text-center '>
               <CardTitle>
                  Welcome Back
               </CardTitle>

               <CardDescription>
                  Login to continue
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

                           <Button type ="submit" className="w-full" disabled = {isPending}>
                              Login
                           </Button>
                        </div>

                        <div className="text-center text-sm">
                           Don&apos;t have an account?{" "}
                           <Link href="/signup" className="underline-offset-4">
                              Sign up
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

export default LoginForm;