
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader, Server, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from '@/components/ui/sonner';

// Define the lab type
type Lab = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'available' | 'maintenance' | 'coming_soon';
  estimated_time: number; // in minutes
};

// Define the lab session type
type LabSession = {
  id: string;
  user_id: string;
  lab_id: string;
  started_at: string;
  completed_at: string | null;
};

const PremiumLabs: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [startingLab, setStartingLab] = useState<string | null>(null);

  useEffect(() => {
    fetchLabs();
    if (user) {
      fetchUserSessions();
    }
  }, [user]);

  const fetchLabs = async () => {
    setIsLoading(true);
    try {
      // This is just demo data since we don't have a labs table yet
      // In a real app, you would fetch this from Supabase
      const demoLabs: Lab[] = [
        {
          id: 'lab1',
          title: 'Introduction to Network Analysis',
          description: 'Learn the fundamentals of network analysis and packet inspection.',
          difficulty: 'beginner',
          status: 'available',
          estimated_time: 60,
        },
        {
          id: 'lab2',
          title: 'Advanced Vulnerability Scanning',
          description: 'Discover and analyze network vulnerabilities through hands-on exercises.',
          difficulty: 'intermediate',
          status: 'available',
          estimated_time: 90,
        },
        {
          id: 'lab3',
          title: 'Wireless Network Security',
          description: 'Practical approach to securing wireless networks against common attacks.',
          difficulty: 'intermediate',
          status: 'available',
          estimated_time: 120,
        },
        {
          id: 'lab4',
          title: 'Penetration Testing Methodology',
          description: 'Step-by-step approach to conducting thorough penetration tests.',
          difficulty: 'advanced',
          status: 'coming_soon',
          estimated_time: 150,
        },
        {
          id: 'lab5',
          title: 'Incident Response Simulation',
          description: 'Real-world scenarios for practicing incident response procedures.',
          difficulty: 'advanced',
          status: 'maintenance',
          estimated_time: 180,
        },
      ];
      
      setLabs(demoLabs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching labs:', error);
      toast.error('Failed to load labs');
      setIsLoading(false);
    }
  };

  const fetchUserSessions = async () => {
    try {
      // Again, this is demo data since we don't have a lab_sessions table yet
      // We'll simulate some active and completed sessions
      const demoSessions: LabSession[] = [
        {
          id: 'session1',
          user_id: user?.id || '',
          lab_id: 'lab1',
          started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          completed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        },
        {
          id: 'session2',
          user_id: user?.id || '',
          lab_id: 'lab2',
          started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          completed_at: null, // Still in progress
        },
      ];
      
      setSessions(demoSessions);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
    }
  };

  const startLab = async (labId: string) => {
    if (!user) {
      toast.error('Please log in to access labs');
      navigate('/login');
      return;
    }
    
    setStartingLab(labId);
    
    try {
      // In a real app, you would create a new session in Supabase
      // For now, we'll just simulate it
      setTimeout(() => {
        const newSession: LabSession = {
          id: `session-${Date.now()}`,
          user_id: user.id,
          lab_id: labId,
          started_at: new Date().toISOString(),
          completed_at: null,
        };
        
        setSessions([...sessions, newSession]);
        toast.success('Lab started successfully!');
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error starting lab:', error);
      toast.error('Failed to start lab');
    } finally {
      setStartingLab(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500 hover:bg-green-600';
      case 'intermediate':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'advanced':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'available':
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: 'Available', color: 'text-green-500' };
      case 'maintenance':
        return { icon: <Clock className="h-4 w-4 text-yellow-500" />, text: 'Maintenance', color: 'text-yellow-500' };
      case 'coming_soon':
        return { icon: <XCircle className="h-4 w-4 text-gray-400" />, text: 'Coming Soon', color: 'text-gray-400' };
      default:
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: 'Available', color: 'text-green-500' };
    }
  };

  const isLabCompleted = (labId: string) => {
    return sessions.some(session => session.lab_id === labId && session.completed_at !== null);
  };

  const isLabInProgress = (labId: string) => {
    return sessions.some(session => session.lab_id === labId && session.completed_at === null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Premium Labs</h1>
          <p className="text-muted-foreground">
            Access our exclusive hands-on labs to practice your network security skills in real-world scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))
          ) : (
            labs.map(lab => (
              <Card key={lab.id} className={lab.status !== 'available' ? 'opacity-75' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{lab.title}</CardTitle>
                    <Badge className={getDifficultyColor(lab.difficulty)}>
                      {lab.difficulty.charAt(0).toUpperCase() + lab.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    {getStatusDetails(lab.status).icon}
                    <span className={getStatusDetails(lab.status).color}>{getStatusDetails(lab.status).text}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lab.description}</p>
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Estimated time: {lab.estimated_time} minutes</span>
                  </div>
                  
                  {isLabCompleted(lab.id) && (
                    <div className="mt-2 flex items-center text-sm text-green-500">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Completed</span>
                    </div>
                  )}
                  
                  {isLabInProgress(lab.id) && !isLabCompleted(lab.id) && (
                    <div className="mt-2 flex items-center text-sm text-blue-500">
                      <Server className="h-4 w-4 mr-2" />
                      <span>In Progress</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-ozar-red hover:bg-ozar-red/90"
                    disabled={lab.status !== 'available' || startingLab === lab.id}
                    onClick={() => startLab(lab.id)}
                  >
                    {startingLab === lab.id ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Starting Lab...
                      </>
                    ) : isLabInProgress(lab.id) ? (
                      'Continue Lab'
                    ) : isLabCompleted(lab.id) ? (
                      'Restart Lab'
                    ) : (
                      'Start Lab'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {labs.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">No labs available</h3>
            <p className="text-muted-foreground">
              Check back later for new premium lab content.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PremiumLabs;
