
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Downloads from '@/components/Downloads';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Downloads />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
