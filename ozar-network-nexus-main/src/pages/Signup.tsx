
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Server } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Signup: React.FC = () => {
  const { signUp, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signUp(values.email, values.password, values.firstName, values.lastName);
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-ozar-black" />
          <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
            <Server className="h-6 w-6 text-ozar-red" />
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-ozar-red">ozar</span> Network Labs
            </Link>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Join our community of networking professionals and take your skills to the next level with our virtual labs and resources.&rdquo;
              </p>
              <footer className="text-sm">The ozar Network Labs Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:p-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline text-ozar-red hover:text-ozar-red/90">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
