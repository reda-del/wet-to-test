
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LogOut, Save, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  phoneNumber: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Profile: React.FC = () => {
  const { user, profile, profileLoading, updateProfile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !profileLoading) {
      navigate('/login');
      return;
    }

    // Update form with profile data when available
    if (profile) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phoneNumber: profile.phone_number || "",
        email: user?.email || "",
      });
    }
  }, [user, profile, navigate, form, profileLoading]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await updateProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
      });
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          first_name: values.firstName,
          last_name: values.lastName
        }
      });
      
      if (updateError) throw updateError;
      
      // Toast notification happens in updateProfile function
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordChange = async (values: z.infer<typeof passwordSchema>) => {
    setIsPasswordLoading(true);
    setPasswordError(null);
    
    try {
      // Update password
      const { error } = await supabase.auth.updateUser({ 
        password: values.newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error updating password:', error);
      setPasswordError(error.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  // Show loading indicator while profile is loading
  if (profileLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red mx-auto mb-4"></div>
            <p className="text-lg">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={`${profile?.first_name || 'User'}'s avatar`} />
              ) : (
                <AvatarFallback className="bg-ozar-red text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
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
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-ozar-red hover:bg-ozar-red/90"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordChange)}>
                    <CardContent className="space-y-4">
                      {passwordError && (
                        <Alert variant="destructive">
                          <AlertDescription>{passwordError}</AlertDescription>
                        </Alert>
                      )}
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-ozar-red hover:bg-ozar-red/90"
                        disabled={isPasswordLoading}
                      >
                        {isPasswordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleSignOut}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
