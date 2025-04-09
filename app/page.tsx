'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from './components/ui/animated-section';
import { Header } from './components/ui/header';

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <div className="relative bg-blue-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 opacity-90">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
          </div>
          <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${
            heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="pt-20 pb-12 md:pt-32 md:pb-20">
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-yellow-200 to-yellow-300 text-transparent bg-clip-text animate-gradient">
                    Safisaana Ltd
                  </span>
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Discover our wide range of quality products and courses designed to help you succeed
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/products"
                    className="group w-full sm:w-auto bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center space-x-2"
                  >
                    <span>Browse Products</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/courses"
                    className="group w-full sm:w-auto bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center space-x-2"
                  >
                    <span>View Courses</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/dashboard"
                    className="group w-full sm:w-auto bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center justify-center space-x-2"
                  >
                    <span>Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">
                Why Choose Safisaana?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10">
                {[
                  {
                    title: "Quality Products",
                    description: "We offer high-quality products that meet international standards",
                    icon: "M13 10V3L4 14h7v7l9-11h-7z"
                  },
                  {
                    title: "Expert Courses",
                    description: "Learn from industry experts through our comprehensive courses",
                    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  },
                  {
                    title: "24/7 Support",
                    description: "Get assistance whenever you need it with our dedicated support team",
                    icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  }
                ].map((feature, index) => (
                  <AnimatedSection
                    key={index}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    delay={index * 100}
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-blue-600 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={feature.icon}
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-center">
                        {feature.description}
                      </p>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </>
  );
}
