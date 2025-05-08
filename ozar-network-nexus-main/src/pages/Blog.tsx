import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

type Post = {
  id: string;
  title: string;
  short_content: string;
  full_content: string;
  created_at: string;
  author_name?: string;
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // If we have real data, use it
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          // Otherwise use sample data
          setPosts([
            {
              id: '1',
              title: 'Getting Started with CCNA Certification',
              short_content: 'Learn the key steps to begin your journey towards CCNA certification and set yourself up for success.',
              full_content: 'The Cisco Certified Network Associate (CCNA) certification is your first step into the world of professional networking. This comprehensive guide will walk you through everything you need to know to start preparing for this valuable credential. We\'ll cover study strategies, lab practice recommendations, and time management tips that have helped thousands of successful candidates.\n\nFirst, understand the exam objectives thoroughly. The CCNA covers a wide range of networking concepts including network fundamentals, access, IP connectivity, services, security fundamentals, and automation. Create a study schedule that allocates time for each topic area based on your current knowledge level.\n\nNext, secure proper study materials. Cisco Press books, video courses from respected trainers, and practice tests are essential. But perhaps most importantly, you need hands-on practice. The theoretical knowledge only takes you so far - you must be comfortable configuring actual network devices.\n\nOzar Network Labs offers comprehensive practice environments specifically designed for CCNA preparation. Our virtual labs allow you to practice configurations in a safe environment that mimics real-world scenarios you\'ll face in both the exam and your future career.\n\nRemember that consistency is key. Short, regular study sessions are more effective than occasional cramming. Set realistic goals and track your progress against them. Join study groups or online communities where you can discuss concepts with other learners.\n\nWith dedication and the right resources, you\'ll be well on your way to achieving your CCNA certification.',
              created_at: '2023-08-15T10:00:00Z',
              author_name: 'Michael Johnson'
            },
            {
              id: '2',
              title: 'Network Automation Fundamentals',
              short_content: 'Discover how network automation is transforming IT operations and learn the fundamental skills needed to get started.',
              full_content: 'Network automation is revolutionizing how organizations manage their infrastructure. This detailed guide covers the fundamentals you need to understand to begin implementing automation in your network environment.',
              created_at: '2023-09-05T14:30:00Z',
              author_name: 'Sarah Williams'
            },
            {
              id: '3',
              title: 'Understanding BGP Routing',
              short_content: 'An in-depth look at Border Gateway Protocol (BGP), the routing protocol that powers the internet.',
              full_content: 'Border Gateway Protocol (BGP) is often called the protocol that makes the internet work. This comprehensive exploration helps you understand how BGP functions and why it\'s so important for global connectivity.',
              created_at: '2023-09-25T09:15:00Z',
              author_name: 'David Chen'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleReadMore = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Latest news, guides, and insights from the ozar Network Labs team
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full flex flex-col">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-28" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="h-full flex flex-col transition-transform duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{post.short_content}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white"
                    onClick={() => handleReadMore(post)}
                  >
                    Read More <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Post Content Modal */}
      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPost?.title}</DialogTitle>
            {selectedPost && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Clock className="mr-1 h-4 w-4" />
                <span>{formatDate(selectedPost.created_at)}</span>
                {selectedPost.author_name && (
                  <span className="ml-2">by {selectedPost.author_name}</span>
                )}
              </div>
            )}
          </DialogHeader>
          <div className="mt-2 space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedPost?.full_content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setIsPostModalOpen(false)} 
              className="bg-ozar-red text-white hover:bg-ozar-red/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;
