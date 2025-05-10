
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const { user } = useAuth();
  
  const handleSubscribe = (plan: string) => {
    // This would integrate with a payment provider in the future
    console.log(`Subscribe to ${plan} plan`);
    // For now, just show a toast or alert
    alert(`You selected the ${plan} plan. Payment integration will be added in the future.`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="max-w-[85%] md:max-w-[65%] lg:max-w-[50%] text-muted-foreground text-lg">
                Choose the plan that works best for your learning goals. All plans include access to our community and resources.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {/* Free Plan */}
              <div className="flex flex-col border rounded-lg overflow-hidden">
                <div className="bg-muted p-6">
                  <h3 className="text-xl font-bold">Free</h3>
                  <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                    <span className="text-3xl font-bold tracking-tight">$0</span>
                    <span className="ml-1 text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Perfect for beginners looking to get started with networking.
                  </p>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>5 Basic Lab Environments</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Community Forum Access</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Basic Study Materials</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Limited Lab Time (2 hours/day)</span>
                    </li>
                  </ul>
                  <Button 
                    onClick={() => handleSubscribe('Free')}
                    className="mt-6 w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                  >
                    you are in this plan
                    {user ? 'Current Plan' : 'Get Started for Free'}
                  </Button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="flex flex-col border rounded-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-ozar-red text-white px-3 py-1 text-xs font-semibold uppercase">
                  Most Popular
                </div>
                <div className="bg-muted p-6">
                  <h3 className="text-xl font-bold">Premium</h3>
                  <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                    <span className="text-3xl font-bold tracking-tight">$29</span>
                    <span className="ml-1 text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    For serious networking students and professionals.
                  </p>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>All Free Plan Features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>30+ Advanced Lab Environments</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Instructor-Led Guidance</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Unlimited Lab Time</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Complete Study Materials</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Priority Support</span>
                    </li>
                  </ul>
                  <Button 
                    asChild
                    className="mt-6 w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                  >
                    <a href="https://buy.stripe.com/test_3cI6oGbhJ5Zh2fHevmcs800" target="_blank" rel="noopener noreferrer">
                      Subscribe
                    </a>
                  </Button>
                </div>
              </div>

              {/* Student Plan */}
              <div className="flex flex-col border rounded-lg overflow-hidden">
                <div className="bg-muted p-6">
                  <h3 className="text-xl font-bold">Student</h3>
                  <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                    <span className="text-3xl font-bold tracking-tight">$19</span>
                    <span className="ml-1 text-xl text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Special discount for enrolled students. ID verification required.
                  </p>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>All Premium Plan Features</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Student-Only Study Groups</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Exam Preparation Materials</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-ozar-red mr-2" />
                      <span>Resume & Career Resources</span>
                    </li>
                  </ul>
                  <Button 
                    asChild
                    className="mt-6 w-full bg-ozar-red text-white hover:bg-ozar-red/90"
                  >
                    <a href="https://buy.stripe.com/test_aEUeYx8mCeIa5QA4gh" target="_blank" rel="noopener noreferrer">
                      Subscribe
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-lg font-semibold mb-2">Need a custom plan for your organization?</h3>
              <p className="mb-6 text-muted-foreground">Contact us for bulk pricing and custom lab environments for your team or institution.</p>
              <Button asChild variant="outline" className="border-ozar-red text-ozar-red hover:bg-ozar-red hover:text-white">
                <a href="mailto:abdo.reda.business@gmail.com?subject=Contact%20Sales&body=I%20want%20to%20ask%20about...">Contact Sales</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
