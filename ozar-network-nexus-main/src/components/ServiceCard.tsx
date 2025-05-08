
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, link }) => {
  return (
    <div className="bg-white dark:bg-ozar-darkGray rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-ozar-red/10 text-ozar-red mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button asChild variant="outline" className="mt-2 border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
        <Link to={link}>Learn More</Link>
      </Button>
    </div>
  );
};

export default ServiceCard;
