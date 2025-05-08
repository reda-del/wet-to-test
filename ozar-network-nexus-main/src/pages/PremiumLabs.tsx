
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from '@/components/ui/sonner';

interface LabType {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  popular: boolean;
  instructions?: string;
  price?: number;
}

interface ServiceType {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  created_at: string;
  created_by: string;
  price?: number;
}

const PremiumLabs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [premiumLabs, setPremiumLabs] = useState<LabType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState<LabType | null>(null);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [labLaunched, setLabLaunched] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      // Fetch services from the database
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform services to LabType format
      const labsData = data.map((service: ServiceType) => ({
        id: service.id,
        title: service.title,
        description: service.short_description,
        // Map difficulty based on price or other factors
        difficulty: service.price && service.price > 50 ? "Expert" : 
                  service.price && service.price > 20 ? "Advanced" : "Intermediate",
        duration: "4-6 hours", // Default duration
        popular: Math.random() > 0.5, // Randomly set popular flag
        instructions: service.full_description,
        price: service.price || 0,
      }));

      setPremiumLabs(labsData.length > 0 ? labsData : [
        {
          id: "1",
          title: "Enterprise Network Design",
          description: "Create and configure a complex enterprise network with multiple sites, routing protocols, and security features.",
          difficulty: "Advanced",
          duration: "8-10 hours",
          popular: true,
          instructions: "This is a sample lab instruction. In a real implementation, this would contain detailed steps for the lab."
        },
        {
          id: "2",
          title: "SD-WAN Implementation",
          description: "Learn how to deploy and manage Software-Defined Wide Area Networks with hands-on exercises.",
          difficulty: "Expert",
          duration: "6-8 hours",
          popular: false,
          instructions: "This is a sample lab instruction for SD-WAN implementation. Follow these steps to complete the lab."
        },
        // ... other sample labs
      ]);
    } catch (error: any) {
      console.error('Error fetching labs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabAccess = (lab: LabType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Open lab instructions modal
    setSelectedLab(lab);
    setIsLabModalOpen(true);
    setLabLaunched(false);
    
    // Log lab session
    logLabSession(lab.id);
  };
  
  const logLabSession = async (labId: string) => {
    if (!user) return;
    
    try {
      // Check if we have a lab_sessions table in the database
      const { error } = await supabase
        .from('lab_sessions')
        .insert({
          user_id: user.id,
          lab_id: labId,
          start_timestamp: new Date().toISOString()
        });
      
      if (error && error.code !== '42P01') { // Ignore if table doesn't exist
        console.error('Error logging lab session:', error);
      }
    } catch (error) {
      console.error('Error logging lab session:', error);
    }
  };
  
  const handleLaunchLab = async () => {
    if (!selectedLab) return;
    
    setIsLaunching(true);
    
    try {
      // Simulate lab environment launching
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setLabLaunched(true);
      toast.success("Lab environment launched successfully!");
      
      // In a real implementation, this would launch the actual lab environment
      // Example: open an iframe, connect to a VM, etc.
    } catch (error) {
      toast.error("Failed to launch lab environment. Please try again.");
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-16 lg:py-20 bg-ozar-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Premium Network Labs</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Advanced hands-on labs designed for networking professionals who want to master complex scenarios and cutting-edge technologies.
              </p>
              {!user && (
                <div className="flex items-center mt-4 p-3 bg-ozar-red/20 rounded-md text-white">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p className="text-sm">Sign in to access our premium labs and save your progress</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumLabs.map((lab) => (
                  <Card key={lab.id} className="flex flex-col border-2 hover:border-ozar-red transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="bg-ozar-red/10 text-ozar-red border-ozar-red">
                          {lab.difficulty}
                        </Badge>
                        {lab.popular && (
                          <Badge className="bg-ozar-red">Popular</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{lab.title}</CardTitle>
                      <CardDescription>{lab.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">Estimated duration: {lab.duration}</p>
                        {lab.price !== undefined && (
                          <p className="text-sm font-medium">
                            Price: {lab.price === 0 ? 'Free' : `$${lab.price.toFixed(2)}`}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Button 
                        onClick={() => handleLabAccess(lab)} 
                        className="w-full bg-ozar-red hover:bg-ozar-red/90"
                      >
                        {user ? 'Start Lab' : 'Sign In to Access'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Lab Instructions Modal */}
      <Dialog open={isLabModalOpen} onOpenChange={setIsLabModalOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedLab?.title}</DialogTitle>
            <DialogDescription>
              Follow the instructions below to complete this lab
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <h3 className="font-medium mb-2">Lab Overview</h3>
              <p className="text-sm text-muted-foreground">{selectedLab?.description}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Lab Instructions</h3>
              <div className="p-4 border rounded-md max-h-64 overflow-y-auto">
                <p className="whitespace-pre-line">{selectedLab?.instructions || 'No instructions available.'}</p>
              </div>
            </div>
            
            {!labLaunched ? (
              <Button 
                onClick={handleLaunchLab} 
                className="w-full bg-ozar-red hover:bg-ozar-red/90"
                disabled={isLaunching}
              >
                {isLaunching ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Launching Lab Environment...
                  </>
                ) : 'Launch Lab Environment'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 dark:bg-green-800/20 text-green-800 dark:text-green-300 p-4 rounded-md">
                  <p className="font-medium">Lab environment launched successfully!</p>
                </div>
                
                <div className="border rounded-md p-4 h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <p className="mb-2">Lab environment is running</p>
                    <p className="text-sm text-muted-foreground">
                      In a real implementation, this would contain an iframe or connection to your virtual lab environment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumLabs;
