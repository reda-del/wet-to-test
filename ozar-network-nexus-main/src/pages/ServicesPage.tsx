
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Server, Laptop, Clock, Users, Headphones, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';

interface Service {
  id: string;
  icon?: React.ReactNode;
  title: string;
  short_description: string;
  full_description: string;
  price?: string;
  created_at: string;
}

const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default services if none are found in the database
  const defaultServices: Service[] = [
    {
      id: "1",
      icon: <Network className="h-12 w-12 text-ozar-red" />,
      title: "Network Configuration Labs",
      short_description: "Hands-on experience with real-world network configurations including routing, switching, and security implementations.",
      price: "From $29.99/month",
      full_description: "Our Network Configuration Labs provide comprehensive hands-on experience with real-world network environments. You'll work with the latest routing protocols, switching technologies, and security implementations in a safe, sandboxed environment. These labs are perfect for both beginners learning the fundamentals and experienced professionals preparing for certifications or keeping their skills sharp. Each lab includes step-by-step guides, troubleshooting scenarios, and best practice recommendations.",
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      icon: <Server className="h-12 w-12 text-ozar-red" />,
      title: "Advanced Cisco Environments",
      short_description: "Practice with advanced Cisco environments designed for CCNA, CCNP, and CCIE certification preparation.",
      price: "From $49.99/month",
      full_description: "Our Advanced Cisco Environments are meticulously designed to match the requirements for CCNA, CCNP, and CCIE certification exams. These labs feature authentic Cisco IOS environments, allowing you to practice on the same systems you'll encounter in the real world. We provide scenarios that closely mimic actual exam questions and enterprise networking challenges. With our detailed guides and expert support, you'll be fully prepared to ace your certification exams and apply your knowledge in professional settings.",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      icon: <Laptop className="h-12 w-12 text-ozar-red" />,
      title: "Cloud Networking Solutions",
      short_description: "Learn how to deploy and manage network infrastructure in cloud environments including AWS, Azure, and GCP.",
      price: "From $39.99/month",
      full_description: "Our Cloud Networking Solutions provide comprehensive training and practical experience for deploying and managing modern network infrastructure across major cloud providers including AWS, Azure, and Google Cloud Platform. Learn essential skills such as virtual network configuration, security group management, load balancing, VPN setup, and hybrid cloud connectivity. These labs bridge the gap between traditional networking knowledge and cloud-native approaches, preparing you for the demands of today's multi-cloud enterprise environments.",
      created_at: new Date().toISOString()
    },
    {
      id: "4",
      icon: <Clock className="h-12 w-12 text-ozar-red" />,
      title: "24/7 Lab Access",
      short_description: "Full access to all lab environments at any time of day, with unlimited usage and save states.",
      price: "From $59.99/month",
      full_description: "With our 24/7 Lab Access subscription, you get unrestricted access to our complete library of network laboratories whenever inspiration strikes. Work at your own pace with no time limits or scheduling constraints. Our platform features powerful save states functionality, allowing you to pause your work and return to it later, exactly where you left off. This flexibility makes it perfect for busy professionals who need to fit their learning around existing commitments, or for those who prefer to deep dive into complex topics during off-hours.",
      created_at: new Date().toISOString()
    },
    {
      id: "5",
      icon: <Users className="h-12 w-12 text-ozar-red" />,
      title: "Team Collaboration Labs",
      short_description: "Multi-user environments designed for team training and collaborative learning experiences.",
      price: "From $99.99/month",
      full_description: "Our Team Collaboration Labs create shared networking environments where multiple users can work together simultaneously on complex infrastructure projects. Perfect for corporate training, academic classes, or study groups preparing for certifications together. These labs feature real-time collaboration tools, shared access controls, and instructor monitoring capabilities. Team members can see each other's changes in real-time, troubleshoot together, and learn from each other's approaches. The perfect solution for organizations looking to upskill their entire networking team at once.",
      created_at: new Date().toISOString()
    },
    {
      id: "6",
      icon: <Headphones className="h-12 w-12 text-ozar-red" />,
      title: "Premium Support Package",
      short_description: "Get dedicated technical support, personalized learning plans, and expert guidance throughout your learning journey.",
      price: "From $79.99/month",
      full_description: "Our Premium Support Package gives you personalized attention from our team of certified network engineers and instructors. Receive one-on-one guidance, have your lab work reviewed by experts, and get personalized feedback to accelerate your learning. We'll create customized learning paths based on your goals, whether you're preparing for a specific certification or developing skills for a new role. Premium support members also get priority access to our help desk, extended lab sessions, and exclusive webinars covering advanced networking topics and industry trends.",
      created_at: new Date().toISOString()
    },
  ];

  // Map icons to services based on title keywords
  const getIconForService = (title: string) => {
    const title_lower = title.toLowerCase();
    if (title_lower.includes('network')) return <Network className="h-12 w-12 text-ozar-red" />;
    if (title_lower.includes('cisco') || title_lower.includes('server')) return <Server className="h-12 w-12 text-ozar-red" />;
    if (title_lower.includes('cloud')) return <Laptop className="h-12 w-12 text-ozar-red" />;
    if (title_lower.includes('access') || title_lower.includes('24/7')) return <Clock className="h-12 w-12 text-ozar-red" />;
    if (title_lower.includes('team') || title_lower.includes('collab')) return <Users className="h-12 w-12 text-ozar-red" />;
    if (title_lower.includes('support')) return <Headphones className="h-12 w-12 text-ozar-red" />;
    
    // Default icon
    return <Server className="h-12 w-12 text-ozar-red" />;
  };

  // Check if service was added today
  const isAddedToday = (dateString: string) => {
    if (!dateString) return false;
    
    const serviceDate = new Date(dateString);
    const today = new Date();
    
    return serviceDate.toDateString() === today.toDateString();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return '';
    }
  };

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Process the services data
          const processedServices = data.map(service => ({
            ...service,
            icon: getIconForService(service.title),
            price: "From $29.99/month" // Default price if needed
          }));
          
          setServices(processedServices);
        } else {
          // Use default services if none in database
          setServices(defaultServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to load services');
        // Fallback to default services on error
        setServices(defaultServices);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  const handleLearnMore = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-16 lg:py-20 bg-ozar-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Network Lab Services</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Comprehensive networking lab environments designed for IT professionals and students at all levels.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader className="h-12 w-12 animate-spin text-ozar-red" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="flex flex-col border-2 hover:border-ozar-red transition-colors">
                    <CardHeader>
                      <div className="mb-4">{service.icon}</div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {service.title}
                        {isAddedToday(service.created_at) && (
                          <Badge className="bg-green-500 hover:bg-green-600 ml-2">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{service.short_description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto">
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base font-medium text-ozar-red">{service.price || 'Contact for pricing'}</p>
                        <Button 
                          className="bg-ozar-red hover:bg-ozar-red/90"
                          onClick={() => handleLearnMore(service)}
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedService && selectedService.icon && React.cloneElement(selectedService.icon as React.ReactElement, { className: "h-6 w-6 mr-2 text-ozar-red" })}
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedService?.price}
              {selectedService?.created_at && (
                <div className="mt-1 text-xs">
                  Added on {formatDate(selectedService.created_at)}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>{selectedService?.full_description}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-ozar-red hover:bg-ozar-red/90"
              onClick={() => setDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
