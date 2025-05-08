
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-ozar-black to-ozar-darkGray text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Virtual Network Labs for IT Professionals & Students
              </h1>
              <p className="text-muted-foreground text-lg">
                Gain hands-on experience with Cisco, GNS3, and Packet Tracer environments. 
                Perfect for CCNA/CCNP preparation and professional skills development.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button asChild size="lg" className="bg-ozar-red hover:bg-ozar-red/80">
                <Link to="/services">Explore Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-ozar-black">
                <Link to="/downloads">Free Resources</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm pt-4">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current text-ozar-red"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Professional Support</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current text-ozar-red"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Real-World Scenarios</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current text-ozar-red"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>24/7 Lab Access</span>
              </div>
            </div>
          </div>
          <div className="mx-auto lg:mr-0 w-full max-w-[600px]">
            <div className="overflow-hidden rounded-lg border border-ozar-red/20 shadow-xl">
              <div className="bg-ozar-black/90 p-2 text-white flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs">Router Configuration</div>
              </div>
              <div className="bg-ozar-darkGray font-mono text-sm text-green-400 p-4 overflow-x-auto">
                <p>Router# configure terminal</p>
                <p>Router(config)# hostname R1</p>
                <p>R1(config)# interface GigabitEthernet0/0</p>
                <p>R1(config-if)# ip address 192.168.1.1 255.255.255.0</p>
                <p>R1(config-if)# no shutdown</p>
                <p>R1(config-if)# exit</p>
                <p>R1(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.254</p>
                <p>R1(config)# end</p>
                <p>R1# write memory</p>
                <p className="text-white mt-2">Building configuration...</p>
                <p className="text-white">Configuration saved successfully.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
