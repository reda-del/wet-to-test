import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, Server, Book, DownloadCloud, Users, AlertCircle, Plus,
  Trash2, Edit, Eye, EyeOff, Loader
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from '@/components/ui/sonner';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

// Service form schema with price field
const serviceSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  short_description: z.string().min(10, { message: "Short description must be at least 10 characters" }),
  full_description: z.string().min(20, { message: "Full description must be at least 20 characters" }),
  price: z.string().optional().transform(val => val ? parseFloat(val) : 0), // Optional price field
});

// Blog post form schema
const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  short_content: z.string().min(10, { message: "Short content must be at least 10 characters" }),
  full_content: z.string().min(20, { message: "Full content must be at least 20 characters" }),
});

// File upload form schema
const fileUploadSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  file: z.instanceof(FileList).refine(files => files.length > 0, "A file is required"),
  access: z.enum(['free', 'premium']).default('free'),
});

// Types for data
type ServiceType = {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  created_at: string;
  price?: number;
};

type BlogPostType = {
  id: string;
  title: string;
  short_content: string;
  full_content: string;
  created_at: string;
};

type FileType = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  created_at: string;
  access?: 'free' | 'premium';
};

type UserType = {
  id: string;
  created_at: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
};

const AdminDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Data state
  const [services, setServices] = useState<ServiceType[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
  // Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // State for tracking whether we're editing an existing service
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);

  // Loading states
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [isSubmittingFile, setIsSubmittingFile] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingBlogPosts, setIsLoadingBlogPosts] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  // Form instances
  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      price: 0,
    },
  });
  
  const blogForm = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      short_content: "",
      full_content: "",
    },
  });
  
  const fileForm = useForm<z.infer<typeof fileUploadSchema>>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      access: "free",
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data && data.role === 'admin') {
          setIsAdmin(true);
        } else {
          // If not admin, redirect to regular dashboard
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Error checking admin status:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, navigate]);
  
  // Fetch all data when admin status is confirmed
  useEffect(() => {
    if (isAdmin && !isLoading) {
      fetchServices();
      fetchBlogPosts();
      fetchFiles();
      fetchUsers();
    }
  }, [isAdmin, isLoading]);
  
  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoadingServices(false);
    }
  };
  
  const fetchBlogPosts = async () => {
    setIsLoadingBlogPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoadingBlogPosts(false);
    }
  };
  
  const fetchFiles = async () => {
    setIsLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoadingFiles(false);
    }
  };
  
  // Updated function to fetch all users properly
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Get all users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Make sure we have the correct data structure
        setUsers(data.map(user => ({
          id: user.id,
          created_at: user.created_at || '',
          email: user.email || '',
          role: user.role || 'user',
          first_name: user.first_name,
          last_name: user.last_name
        })));
        console.log('Fetched users:', data);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };
  
  // Handle opening the edit service modal
  const handleEditService = (service: ServiceType) => {
    setIsEditing(true);
    setCurrentServiceId(service.id);
    
    // Populate the form with service data
    serviceForm.reset({
      title: service.title,
      short_description: service.short_description,
      full_description: service.full_description,
      price: service.price != null ? Number(service.price) : 0,
    });
    
    setIsServiceModalOpen(true);
  };
  
  // Reset the service form when closing the modal
  const handleCloseServiceModal = () => {
    setIsServiceModalOpen(false);
    setIsEditing(false);
    setCurrentServiceId(null);
    
    // Reset the form
    serviceForm.reset({
      title: "",
      short_description: "",
      full_description: "",
      price: 0,
    });
  };
  
  const onServiceSubmit = async (values: z.infer<typeof serviceSchema>) => {
    setIsSubmittingService(true);
    
    try {
      if (isEditing && currentServiceId) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            title: values.title,
            short_description: values.short_description,
            full_description: values.full_description,
            price: values.price,
          })
          .eq('id', currentServiceId);
        
        if (error) throw error;
        
        toast.success('Service updated successfully!');
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert({
            title: values.title,
            short_description: values.short_description,
            full_description: values.full_description,
            created_by: user?.id,
            price: values.price,
          });
        
        if (error) throw error;
        
        toast.success('Service created successfully!');
      }
      
      // Reset the form and close the modal
      serviceForm.reset();
      setIsServiceModalOpen(false);
      setIsEditing(false);
      setCurrentServiceId(null);
      
      // Refresh the services list
      fetchServices();
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} service:`, error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} service: ${error.message}`);
    } finally {
      setIsSubmittingService(false);
    }
  };
  
  const onBlogPostSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    setIsSubmittingBlog(true);
    
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: values.title,
          short_content: values.short_content,
          full_content: values.full_content,
          author_id: user?.id,
        })
        .select();
      
      if (error) throw error;
      
      // Success handling
      toast.success('Blog post created successfully!');
      blogForm.reset();
      setIsBlogModalOpen(false);
      
      // Refresh the blog posts list
      fetchBlogPosts();
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast.error(`Failed to create blog post: ${error.message}`);
    } finally {
      setIsSubmittingBlog(false);
    }
  };
  
  // Updated function to handle file uploads with proper mime type detection and validation
  const onFileUploadSubmit = async (values: z.infer<typeof fileUploadSchema>) => {
    setIsSubmittingFile(true);
    
    try {
      const fileToUpload = values.file[0];
      
      // Check file type and validate
      const allowedMimeTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/gif',
        'text/plain',
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
      ];
      
      console.log('File MIME type:', fileToUpload.type);
      
      if (!allowedMimeTypes.includes(fileToUpload.type)) {
        throw new Error(`Unsupported file type: ${fileToUpload.type}. Allowed types are PDF, images, documents, spreadsheets, and zip files.`);
      }
      
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      // Add proper content type to file upload
      const fileOptions = {
        contentType: fileToUpload.type
      };
      
      console.log('Uploading file with options:', fileOptions);
      
      // Create a storage bucket if it doesn't exist (first ensure we have access to storage)
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw bucketsError;
      }
      
      const filesBucketExists = buckets.some(bucket => bucket.name === 'files');
      
      if (!filesBucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket('files', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
        
        console.log('Created files bucket');
      }
      
      // Upload file to Supabase Storage using the 'files' bucket
      const { data: fileData, error: fileError } = await supabase.storage
        .from('files')
        .upload(filePath, fileToUpload, fileOptions);
      
      if (fileError) {
        throw fileError;
      }
      
      // Get the public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);
      
      // Save file metadata to database
      const { data, error } = await supabase
        .from('files')
        .insert({
          file_name: values.title,
          description: values.description,
          file_path: publicUrlData.publicUrl,
          user_id: user?.id,
          access: values.access,
        })
        .select();
      
      if (error) throw error;
      
      // Success handling
      toast.success('File uploaded successfully!');
      fileForm.reset();
      setIsFileModalOpen(false);
      
      // Refresh the files list
      fetchFiles();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload file: ${error.message}`);
    } finally {
      setIsSubmittingFile(false);
    }
  };
  
  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error: any) {
        console.error('Error deleting service:', error);
        toast.error(`Failed to delete service: ${error.message}`);
      }
    }
  };
  
  const handleDeleteBlogPost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('Blog post deleted successfully');
        fetchBlogPosts();
      } catch (error: any) {
        console.error('Error deleting blog post:', error);
        toast.error(`Failed to delete blog post: ${error.message}`);
      }
    }
  };
  
  const handleDeleteFile = async (id: string, url?: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        // Delete file from storage if URL is provided
        if (url) {
          const filePath = url.split('/').pop();
          if (filePath) {
            const { error: storageError } = await supabase.storage
              .from('files')
              .remove([`uploads/${filePath}`]);
              
            if (storageError) {
              console.error('Error deleting file from storage:', storageError);
            }
          }
        }
        
        // Delete metadata from database
        const { error } = await supabase
          .from('files')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success('File deleted successfully');
        fetchFiles();
      } catch (error: any) {
        console.error('Error deleting file:', error);
        toast.error(`Failed to delete file: ${error.message}`);
      }
    }
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Check if item was added today
  const isAddedToday = (dateString: string) => {
    if (!dateString) return false;
    
    const itemDate = new Date(dateString);
    const today = new Date();
    
    return itemDate.toDateString() === today.toDateString();
  };

  // Filter users by role
  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role === roleFilter);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red"></div>
    </div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your website content and user accounts from here.
          </p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-8 flex overflow-x-auto space-x-2 pb-2">
            <TabsTrigger value="services" className="flex items-center">
              <Server className="h-4 w-4 mr-2" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              <span>Blog Posts</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center">
              <DownloadCloud className="h-4 w-4 mr-2" />
              <span>Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>Add, edit or remove services that appear on the services page</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6 pb-6">
                  {isLoadingServices ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader className="h-8 w-8 animate-spin text-ozar-red" />
                    </div>
                  ) : services.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {service.title}
                                {isAddedToday(service.created_at) && (
                                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {service.short_description}
                            </TableCell>
                            <TableCell>
                              {service.price === 0 ? 'Free' : `$${service.price?.toFixed(2)}`}
                            </TableCell>
                            <TableCell>{formatDate(service.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleEditService(service)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                                  onClick={() => handleDeleteService(service.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No services found. Add a new service using the button below.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-ozar-red hover:bg-ozar-red/90"
                  onClick={() => setIsServiceModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Service
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Blog Posts</CardTitle>
                <CardDescription>Create, edit or delete blog posts</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6 pb-6">
                  {isLoadingBlogPosts ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader className="h-8 w-8 animate-spin text-ozar-red" />
                    </div>
                  ) : blogPosts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Preview</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {post.title}
                                {isAddedToday(post.created_at) && (
                                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {post.short_content}
                            </TableCell>
                            <TableCell>{formatDate(post.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                                  onClick={() => handleDeleteBlogPost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No blog posts found. Create a new post using the button below.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-ozar-red hover:bg-ozar-red/90"
                  onClick={() => setIsBlogModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Blog Post
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="downloads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Downloads</CardTitle>
                <CardDescription>Upload, organize or delete downloadable resources</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6 pb-6">
                  {isLoadingFiles ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader className="h-8 w-8 animate-spin text-ozar-red" />
                    </div>
                  ) : files.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Access Level</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {files.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {file.title}
                                {isAddedToday(file.created_at) && (
                                  <Badge className="bg-green-500 hover:bg-green-600">New</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {file.description}
                            </TableCell>
                            <TableCell>
                              {file.access === 'premium' ? (
                                <Badge variant="default" className="bg-ozar-red">Premium</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500">Free</Badge>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(file.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => window.open(file.file_url, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600" 
                                  onClick={() => handleDeleteFile(file.id, file.file_url)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No files found. Upload a new file using the button below.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-ozar-red hover:bg-ozar-red/90"
                  onClick={() => setIsFileModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload New File
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Updated users tab content to properly display all users */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-x-2">
                      <Button 
                        variant={roleFilter === 'all' ? 'default' : 'outline'} 
                        onClick={() => setRoleFilter('all')}
                        className={roleFilter === 'all' ? 'bg-ozar-red hover:bg-ozar-red/90' : ''}
                        size="sm"
                      >
                        All
                      </Button>
                      <Button 
                        variant={roleFilter === 'admin' ? 'default' : 'outline'} 
                        onClick={() => setRoleFilter('admin')}
                        className={roleFilter === 'admin' ? 'bg-ozar-red hover:bg-ozar-red/90' : ''}
                        size="sm"
                      >
                        Admins
                      </Button>
                      <Button 
                        variant={roleFilter === 'user' ? 'default' : 'outline'} 
                        onClick={() => setRoleFilter('user')}
                        className={roleFilter === 'user' ? 'bg-ozar-red hover:bg-ozar-red/90' : ''}
                        size="sm"
                      >
                        Users
                      </Button>
                      <Button 
                        variant={roleFilter === 'student' ? 'default' : 'outline'} 
                        onClick={() => setRoleFilter('student')}
                        className={roleFilter === 'student' ? 'bg-ozar-red hover:bg-ozar-red/90' : ''}
                        size="sm"
                      >
                        Students
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fetchUsers()}
                      size="sm"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </Button>
                  </div>
                </div>
                
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader className="h-8 w-8 animate-spin text-ozar-red" />
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Not provided'}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className={
                                user.role === 'admin' 
                                  ? 'bg-ozar-red' 
                                  : user.role === 'student' 
                                    ? 'bg-green-500' 
                                    : 'bg-blue-500'
                              }>
                                {user.role || 'user'}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    {roleFilter === 'all' ? 'No users found.' : `No users with role "${roleFilter}" found.`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      
      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={handleCloseServiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the details of this service.' : 'Create a new service that will appear on the services page.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4">
              <FormField
                control={serviceForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Service title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description for service card (150 chars or less)"
                        {...field}
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="full_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the service"
                        {...field}
                        className="resize-none"
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseServiceModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-ozar-red hover:bg-ozar-red/90"
                  disabled={isSubmittingService}
                >
                  {isSubmittingService && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Update Service' : 'Create Service'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Blog Post Modal */}
      <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write a new blog post for your website.
            </DialogDescription>
          </DialogHeader>
          <Form {...blogForm}>
            <form onSubmit={blogForm.handleSubmit(onBlogPostSubmit)} className="space-y-4">
              <FormField
                control={blogForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="short_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preview</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief preview of the blog post"
                        {...field}
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={blogForm.control}
                name="full_content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Full blog post content"
                        {...field}
                        className="resize-none"
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsBlogModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-ozar-red hover:bg-ozar-red/90"
                  disabled={isSubmittingBlog}
                >
                  {isSubmittingBlog && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Publish Post
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* File Upload Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New File</DialogTitle>
            <DialogDescription>
              Upload a file for users to download. Supported formats include PDF, text, spreadsheets, documents, and ZIP files.
            </DialogDescription>
          </DialogHeader>
          <Form {...fileForm}>
            <form onSubmit={fileForm.handleSubmit(onFileUploadSubmit)} className="space-y-4">
              <FormField
                control={fileForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="File title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={fileForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the file"
                        {...field}
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={fileForm.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        onChange={(e) => onChange(e.target.files)}
                        accept=".pdf,.png,.gif,.txt,.csv,.doc,.docx,.zip,.pkt,.pka"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: PDF, PKT, text, spreadsheets, documents, and ZIP files.
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={fileForm.control}
                name="access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Level</FormLabel>
                    <FormControl>
                      <select
                        className="w-full p-2 border rounded"
                        {...field}
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsFileModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-ozar-red hover:bg-ozar-red/90"
                  disabled={isSubmittingFile}
                >
                  {isSubmittingFile && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload File
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
