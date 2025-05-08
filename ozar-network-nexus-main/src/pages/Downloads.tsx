
import React, { useState, useEffect } from 'react';
import { FileDown, FileCode, Network, FileText, Terminal, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface DownloadItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  isPremium?: boolean;
  fileUrl?: string;
}

const DownloadItem: React.FC<DownloadItemProps> = ({ 
  icon, 
  title, 
  description, 
  fileType, 
  fileSize, 
  isPremium = false,
  fileUrl
}) => {
  const { user } = useAuth();
  
  const handleDownload = () => {
    if (isPremium && !user) {
      toast.error('You need to log in to access premium content');
      return;
    }
    
    if (isPremium) {
      // Check if user has premium access logic would go here
      // For now, just show a toast
      toast.info('Downloading premium content...');
    } else {
      toast.info('Downloading file...');
    }
    
    // If we have a real file URL, open it
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-ozar-darkGray rounded-lg border border-border p-6 hover:shadow-md transition-all">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ozar-red/10 text-ozar-red">
            {icon}
          </div>
        </div>
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <h3 className="text-lg font-medium">{title}</h3>
            {isPremium && (
              <Badge className="ml-2 bg-ozar-red" variant="default">Premium</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{fileType}</span>
              <span>{fileSize}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white"
              onClick={handleDownload}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Downloads: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // Format file size for display
  const formatFileSize = (size: string) => {
    // This would normally parse the size but we're using mock data
    return size;
  };

  // Determine file type icon
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case '.pkt':
      case '.gns3project':
        return <Network className="h-5 w-5" />;
      case '.txt':
      case '.docx':
        return <FileText className="h-5 w-5" />;
      case '.pdf':
        return <FileCode className="h-5 w-5" />;
      default:
        return <FileDown className="h-5 w-5" />;
    }
  };

  // Filter files by access level
  const freeFiles = files.filter(file => !file.access || file.access === 'free');
  const premiumFiles = files.filter(file => file.access === 'premium');

  // Mock data for files not in the database
  const mockFiles = [
    {
      icon: <Network className="h-5 w-5" />,
      title: "Basic VLAN Configuration Lab",
      description: "A Cisco Packet Tracer file with a simple VLAN setup and switching exercise.",
      fileType: ".pkt",
      fileSize: "1.2 MB",
      isPremium: false
    },
    {
      icon: <FileCode className="h-5 w-5" />,
      title: "OSPF Configuration Example",
      description: "Complete OSPF configuration for a multi-area network setup.",
      fileType: ".txt",
      fileSize: "24 KB",
      isPremium: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section id="downloads" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Free Resources
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-3xl">
                Download free lab files, configurations, and practice materials for your networking studies
              </p>
            </div>

            <div className="bg-ozar-lightGray dark:bg-ozar-black/50 rounded-lg p-6 mb-10">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 text-ozar-red mr-2" />
                <h3 className="font-medium">Free samples of our premium content</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Our free downloads give you a taste of what's available in our full subscription packages. Try before you buy and experience the quality of our lab environments and documentation.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ozar-red"></div>
              </div>
            ) : (
              <>
                {/* Free files section */}
                <h3 className="text-2xl font-bold mb-6">Free Resources</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {freeFiles.length > 0 ? (
                    freeFiles.map((file) => (
                      <DownloadItem
                        key={file.id}
                        icon={getFileIcon(file.title.split('.').pop() || '')}
                        title={file.title}
                        description={file.description}
                        fileType={file.title.split('.').pop() || 'Unknown'}
                        fileSize="1.2 MB" // This would ideally come from the database
                        isPremium={false}
                        fileUrl={file.file_url}
                      />
                    ))
                  ) : (
                    // Show mock data if no files in database
                    mockFiles.map((file, index) => (
                      <DownloadItem
                        key={index}
                        icon={file.icon}
                        title={file.title}
                        description={file.description}
                        fileType={file.fileType}
                        fileSize={file.fileSize}
                        isPremium={file.isPremium}
                      />
                    ))
                  )}
                </div>
                
                {/* Premium files section */}
                {premiumFiles.length > 0 && (
                  <>
                    <h3 className="text-2xl font-bold mt-12 mb-6">Premium Resources</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      {premiumFiles.map((file) => (
                        <DownloadItem
                          key={file.id}
                          icon={getFileIcon(file.title.split('.').pop() || '')}
                          title={file.title}
                          description={file.description}
                          fileType={file.title.split('.').pop() || 'Unknown'}
                          fileSize="2.5 MB" // This would ideally come from the database
                          isPremium={true}
                          fileUrl={file.file_url}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
            
            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">
                Need more comprehensive resources? Check out our premium lab packages.
              </p>
              <Button 
                size="lg" 
                className="bg-ozar-red text-white hover:bg-ozar-red/90"
                onClick={() => window.location.href = '/premium-labs'}
              >
                View Premium Labs
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Downloads;
