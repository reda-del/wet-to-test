
import React from 'react';
import ServiceCard from './ServiceCard';
import { Network, Globe, Server, FileCode, Headset, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 md:py-24 bg-ozar-lightGray dark:bg-ozar-black">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-3xl">
            We provide comprehensive networking solutions from hands-on labs to professional consulting services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            icon={<Network className="h-6 w-6" />}
            title="Virtual Lab Access"
            description="Access fully configured Cisco, GNS3, and Packet Tracer environments remotely. Perfect for CCNA and CCNP preparation."
            link="/services/virtual-labs"
          />
          <ServiceCard
            icon={<FileCode className="h-6 w-6" />}
            title="Custom Lab Scenarios"
            description="Tailored networking scenarios designed to meet specific learning goals or to simulate your production environment."
            link="/services/custom-labs"
          />
          <ServiceCard
            icon={<Globe className="h-6 w-6" />}
            title="Remote Setup Help"
            description="Expert assistance setting up your own lab environment, with guidance on hardware, software, and configurations."
            link="/services/remote-setup"
          />
          <ServiceCard
            icon={<Server className="h-6 w-6" />}
            title="CCNA/CCNP Practice Kits"
            description="Comprehensive lab kits designed specifically for certification exam preparation with guided exercises."
            link="/services/certification-kits"
          />
          <ServiceCard
            icon={<Headset className="h-6 w-6" />}
            title="Networking Consultancy"
            description="Professional consultancy for network design, optimization, security audits, and troubleshooting assistance."
            link="/services/consultancy"
          />
          <ServiceCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Training Resources"
            description="Structured learning materials including documentation, video tutorials, and expert-led training sessions."
            link="/services/training"
          />
        </div>

        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-ozar-red text-white hover:bg-ozar-red/90">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
