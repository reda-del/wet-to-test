
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { DownloadCloud, Book, FileText, Rocket } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Define the lab type
type Lab = {
  id: string;
  name: string;
  type: 'Free' | 'Premium';
};

type Download = {
  id: string;
  title: string;
  category: string;
};

type RecentActivity = {
  id: string;
  description: string;
  date: string;
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        // Simulating fetch - in a real app this would fetch from Supabase
        // Example fetch from a real database table could look like:
        // const { data: labsData } = await supabase.from('labs').select('*').eq('user_id', user.id);
        
        setLabs([
          { id: '1', name: 'CCNA Lab 1', type: 'Free' },
          { id: '2', name: 'CCNP Enterprise Core', type: 'Premium' },
          { id: '3', name: 'Network Automation', type: 'Premium' },
        ]);
        
        setDownloads([
          { id: '1', title: 'Packet Tracer Files', category: 'Files' },
          { id: '2', title: 'Lab Guides', category: 'Guides' },
          { id: '3', title: 'Study Materials', category: 'Documents' },
        ]);
        
        setActivities([
          { id: '1', description: 'Completed CCNA Lab 1', date: 'Yesterday at 2:30 PM' },
          { id: '2', description: 'Downloaded OSPF Configuration Guide', date: 'May 5, 2025 at 10:15 AM' },
          { id: '3', description: 'Account Created', date: 'May 4, 2025 at 9:00 AM' },
        ]);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);
  
  const handleLaunchLab = (lab: Lab) => {
    if (lab.type === 'Premium' && profile?.role !== 'premium') {
      setPremiumModalOpen(true);
    } else {
      toast.success(`Launching ${lab.name}`);
      // Here you would redirect to the lab environment or open it
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container px-4 py-8 md:py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard{profile?.first_name ? `, ${profile.first_name}` : ''}</h1>
            <p className="text-muted-foreground">
              Access your labs, downloads, and account information.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-ozar-red" />
                  My Labs
                </CardTitle>
                <CardDescription>Access your virtual lab environments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {labs.map(lab => (
                    <div key={lab.id} className="flex items-center justify-between">
                      <span>{lab.name}</span>
                      <Badge variant={lab.type === 'Free' ? 'default' : 'outline'}>
                        {lab.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                  onClick={() => handleLaunchLab(labs[0])}
                >
                  Launch Labs
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DownloadCloud className="mr-2 h-5 w-5 text-ozar-red" />
                  Downloads
                </CardTitle>
                <CardDescription>Access your downloads and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {downloads.map(download => (
                    <div key={download.id} className="flex items-center justify-between">
                      <span>{download.title}</span>
                      <Badge>{download.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
                  <Link to="/downloads">View All Downloads</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 h-5 w-5 text-ozar-red" />
                  Subscription
                </CardTitle>
                <CardDescription>Your current plan and benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Badge className="mb-3 text-md px-3 py-1">
                    {profile?.role === 'premium' ? 'Premium Plan' : 'Free Plan'}
                  </Badge>
                  <p className="text-muted-foreground mb-4">
                    {profile?.role === 'premium' 
                      ? 'Access to all premium labs and resources' 
                      : 'Access to basic labs and resources'}
                  </p>
                  <ul className="text-sm space-y-2 text-left">
                    <li>✓ {profile?.role === 'premium' ? 'All Lab Environments' : '3 Basic Lab Environments'}</li>
                    <li>✓ {profile?.role === 'premium' ? 'Priority Support' : 'Community Support'}</li>
                    <li>✓ {profile?.role === 'premium' ? 'Advanced Study Materials' : 'Basic Study Materials'}</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild={profile?.role !== 'premium'} 
                  className="w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                  onClick={() => profile?.role === 'premium' ? null : setPremiumModalOpen(true)}
                >
                  {profile?.role === 'premium' ? (
                    <span>Premium Active</span>
                  ) : (
                    <Link to="/pricing">Upgrade Plan</Link>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions with ozar Network Labs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="border-b pb-2">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      
      {/* Premium Benefits Modal */}
      <Dialog open={isPremiumModalOpen} onOpenChange={setPremiumModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-ozar-red" /> 
              Premium Benefits
            </DialogTitle>
            <DialogDescription>
              Unlock the full potential of ozar Network Labs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-medium">With Premium Access, you'll get:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access to all 20+ professional lab environments</li>
                <li>Unlimited downloads of all training materials</li>
                <li>Priority customer support</li>
                <li>Monthly new lab additions</li>
                <li>Certification preparation resources</li>
                <li>Advanced networking challenges</li>
              </ul>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-center font-semibold text-lg">$19.99/month</p>
              <p className="text-center text-sm text-muted-foreground">Cancel anytime</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPremiumModalOpen(false)}>
              Maybe Later
            </Button>
            <Button 
              asChild 
              className="bg-ozar-red text-white hover:bg-ozar-red/90"
            >
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
