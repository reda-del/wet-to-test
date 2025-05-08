
import React from 'react';
import { Shield, Award, Users, Clock } from 'lucide-react';

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ 
  icon, 
  title, 
  description 
}) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-ozar-red/10 text-ozar-red">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <section id="about" className="py-12 md:py-24 bg-ozar-lightGray dark:bg-ozar-black">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80" 
                alt="Network Engineers working" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">About Ozar Network Labs</h2>
            <p className="text-muted-foreground">
              Founded by experienced network engineers and CCIE professionals, Ozar Network Labs was created to bridge the gap between theoretical knowledge and practical experience in the networking field.
            </p>
            <p className="text-muted-foreground">
              Our team has over 4 years of experience working with enterprise networks, providing IT education, and developing practical lab scenarios that mimic real-world environments.
            </p>
            
            <div className="grid gap-6 mt-8">
              <FeatureItem
                icon={<Shield className="h-5 w-5" />}
                title="Industry Expertise"
                description="Our team includes certified CCNA, CCNP, and CCIE professionals with enterprise experience."
              />
              <FeatureItem
                icon={<Award className="h-5 w-5" />}
                title="Certification Success"
                description="We've helped hundreds of students achieve their Cisco certification goals."
              />
              <FeatureItem
                icon={<Users className="h-5 w-5" />}
                title="Community Support"
                description="Join our community of networking professionals for collaboration and support."
              />
              <FeatureItem
                icon={<Clock className="h-5 w-5" />}
                title="24/7 Lab Access"
                description="Our virtual labs are available around the clock to fit your schedule."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
