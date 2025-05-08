
import React from 'react';
import { FileDown, FileCode, Network, FileText, Terminal, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DownloadItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
}

const DownloadItem: React.FC<DownloadItemProps> = ({ icon, title, description, fileType, fileSize }) => {
  return (
    <div className="bg-white dark:bg-ozar-darkGray rounded-lg border border-border p-6 hover:shadow-md transition-all">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ozar-red/10 text-ozar-red">
            {icon}
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{fileType}</span>
              <span>{fileSize}</span>
            </div>
            <Button size="sm" variant="outline" className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
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
  return (
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

        <div className="grid gap-6 md:grid-cols-2">
          <DownloadItem
            icon={<Network className="h-5 w-5" />}
            title="Basic VLAN Configuration Lab"
            description="A Cisco Packet Tracer file with a simple VLAN setup and switching exercise."
            fileType=".pkt"
            fileSize="1.2 MB"
          />
          <DownloadItem
            icon={<FileCode className="h-5 w-5" />}
            title="OSPF Configuration Example"
            description="Complete OSPF configuration for a multi-area network setup."
            fileType=".txt"
            fileSize="24 KB"
          />
          <DownloadItem
            icon={<Terminal className="h-5 w-5" />}
            title="ACL Practice Scenarios"
            description="Practice implementing Access Control Lists with these sample scenarios."
            fileType=".docx"
            fileSize="356 KB"
          />
          <DownloadItem
            icon={<FileText className="h-5 w-5" />}
            title="IPv6 Transition Guide"
            description="Step-by-step guide to transitioning from IPv4 to IPv6 networks."
            fileType=".pdf"
            fileSize="2.8 MB"
          />
          <DownloadItem
            icon={<Network className="h-5 w-5" />}
            title="Basic GNS3 Topology"
            description="A simple GNS3 project file with router and switch setup for beginners."
            fileType=".gns3project"
            fileSize="3.1 MB"
          />
          <DownloadItem
            icon={<FileCode className="h-5 w-5" />}
            title="BGP Configuration Cheat Sheet"
            description="Quick reference guide for BGP commands and configurations."
            fileType=".pdf"
            fileSize="1.4 MB"
          />
        </div>
        
        <div className="text-center mt-10">
          <p className="text-muted-foreground mb-4">
            Need more comprehensive resources? Check out our premium lab packages.
          </p>
          <Button size="lg" className="bg-ozar-red text-white hover:bg-ozar-red/90">
            View Premium Labs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Downloads;
