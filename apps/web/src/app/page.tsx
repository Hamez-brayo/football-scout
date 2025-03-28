'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedCounter from '@/components/AnimatedCounter';
import TypingText from '@/components/TypingText';
import HoverCard from '@/components/HoverCard';
import ScrollReveal from '@/components/ScrollReveal';
import ImageParallax from '@/components/ImageParallax';
import FloatingIcons from '@/components/FloatingIcons';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [completedTyping, setCompletedTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show CTA button with delay after typing completes
    if (completedTyping) {
      const timer = setTimeout(() => {
        setShowCTA(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [completedTyping]);

  // Analytics stats for counter animation
  const stats = [
    { id: 1, name: 'Players Analyzed', value: 25000, prefix: '+' },
    { id: 2, name: 'Clubs Using Our Platform', value: 350, prefix: '' },
    { id: 3, name: 'Countries Covered', value: 65, prefix: '' },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 sm:pb-24 lg:flex lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-8 sm:mt-16 lg:mt-8">
              <span className="inline-flex items-center rounded-md bg-indigo-600/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Next Generation Football Analysis
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              <TypingText 
                text="Discover Football Talent with AI" 
                typingSpeed={70} 
                onComplete={() => setCompletedTyping(true)}
              />
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Scout, analyze, and track player performance with advanced AI-powered tools. 
              Make informed decisions with comprehensive data analysis and visualization.
            </p>
            <div className={`mt-8 flex items-center gap-x-6 transition-opacity duration-500 ${showCTA ? 'opacity-100' : 'opacity-0'}`}>
              <Link 
                href="/sign-in" 
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-transform duration-200 hover:scale-105"
              >
                Get Started
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white group transition-all duration-300">
                Learn more <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-12 flex max-w-2xl sm:mt-16 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <ScrollReveal
                animation="fade-in"
                threshold={0.1}
                delay={300}
              >
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <ImageParallax strength={15}>
                    <div className="relative overflow-hidden group h-56 sm:h-64 md:h-72 lg:h-80">
                      <img
                        src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt="Football analysis dashboard"
                        className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/70 to-transparent mix-blend-overlay"></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <p className="text-sm font-medium uppercase tracking-wider mb-2 opacity-90">AI-Powered Analysis</p>
                        <h3 className="text-xl font-bold">Visualize player potential with advanced metrics</h3>
                      </div>
                    </div>
                  </ImageParallax>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="bg-white dark:bg-gray-800 py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="fade-up" delay={100}>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 text-center lg:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-2">
                  <dt className="text-sm leading-6 text-gray-600 dark:text-gray-300">{stat.name}</dt>
                  <dd className="order-first text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    <AnimatedCounter 
                      end={stat.value} 
                      prefix={stat.prefix} 
                      duration={2500} 
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Football stadium background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 tracking-tight text-indigo-600 dark:text-indigo-400">
                Advanced Scouting
              </h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Everything you need to evaluate talent
              </p>
              <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300">
                Our platform combines cutting-edge AI with comprehensive data analysis to give you a complete picture of player performance and potential.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-16 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <ScrollReveal animation="slide-right" delay={100}>
                <HoverCard
                  title="Advanced Player Analysis"
                  description="Track detailed performance metrics, including technical skills, physical attributes, tactical awareness, and psychological factors."
                  hoverContent="Our AI algorithms analyze over 200 player metrics from multiple data sources to give you a complete player profile."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                  }
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={200}>
                <HoverCard
                  title="Data-Driven Insights"
                  description="Make confident decisions based on comprehensive data visualization, trend analysis, and AI-powered recommendations."
                  hoverContent="Our platform processes millions of data points to identify emerging talent patterns before they become obvious to traditional scouting methods."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clipRule="evenodd" />
                    </svg>
                  }
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </ScrollReveal>
              
              <ScrollReveal animation="slide-left" delay={300}>
                <HoverCard
                  title="Global Talent Network"
                  description="Access a vast database of players from around the world, with detailed profiles and performance histories."
                  hoverContent="Our scouts and partners are active in over 65 countries, providing insider information on emerging talent from established and developing football nations."
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                      <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 01.44-.44l5.14-1.435a.75.75 0 01.871.39.75.75 0 01-.39.871l-5.14 1.435a.75.75 0 01-.871-.39.75.75 0 01.39-.871zM8.78 17.732a.75.75 0 01-.44.44l-5.14 1.435a.75.75 0 01-.871-.39.75.75 0 01.39-.871l5.14-1.435a.75.75 0 01.871.39.75.75 0 01-.39.871zM3.638 3.638a.75.75 0 01.32-.32l5.14-2.142a.75.75 0 01.922.46.75.75 0 01-.46.922l-5.14 2.142a.75.75 0 01-.922-.46.75.75 0 01.46-.922zM20.362 20.362a.75.75 0 01-.32.32l-5.14 2.142a.75.75 0 01-.922-.46.75.75 0 01.46-.922l5.14-2.142a.75.75 0 01.922.46.75.75 0 01-.46.922z" clipRule="evenodd" />
                    </svg>
                  }
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </ScrollReveal>
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-br from-indigo-600/5 via-indigo-900/20 to-purple-900/30 dark:from-indigo-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 -z-10">
          <svg className="absolute inset-0 h-full w-full stroke-indigo-300/10 dark:stroke-indigo-600/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
            <defs>
              <pattern id="testimonial-pattern" width="40" height="40" x="50%" y="50%" patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth="0" fill="url(#testimonial-pattern)" />
          </svg>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <ScrollReveal animation="fade-in" threshold={0.2}>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-indigo-50 dark:border-indigo-950">
                <div className="relative p-8 sm:p-10">
                  <div className="flex flex-col items-center">
                    <img className="mx-auto h-12" src="https://tailwindui.com/img/logos/workcation-logo-indigo-600.svg" alt="Testimonial logo" />
                    
                    <div className="mt-8 text-center">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
                        <path d="M14.828 9H7.172L0 21.9V36h12v-12H6l6-9.9V9zm30 0h-7.656L30 21.9V36h12v-12h-6l6-9.9V9z" fill="currentColor"/>
                      </svg>
                      
                      <blockquote className="mt-4 text-xl font-medium text-gray-900 dark:text-white leading-8 sm:text-2xl sm:leading-9">
                        <p>This platform has revolutionized our scouting process. We've discovered talent that would have gone unnoticed with traditional methods, and our recruitment efficiency has improved by 70%.</p>
                      </blockquote>
                      
                      <div className="mt-8 flex items-center justify-center">
                        <img className="h-12 w-12 rounded-full ring-2 ring-indigo-600 dark:ring-indigo-500" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Daniel Martinez" />
                        <div className="ml-4 text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">Daniel Martinez</div>
                          <div className="text-gray-600 dark:text-gray-300">Head Scout, Madrid FC</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-xl sm:rounded-2xl sm:px-16 md:pt-20 lg:flex lg:gap-x-16 lg:px-20 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#4f46e5" />
                  <stop offset="1" stopColor="#0c0a1c" />
                </radialGradient>
              </defs>
            </svg>
            <ScrollReveal animation="slide-right" threshold={0.3}>
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Boost your scouting.
                  <br />
                  Start using our app today.
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Join thousands of football clubs and scouts who are already discovering the next generation of football talent.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                  <Link
                    href="/sign-up"
                    className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-transform duration-200 hover:scale-105"
                  >
                    Create Account
                  </Link>
                  <Link href="/sign-in" className="text-sm font-semibold leading-6 text-white group transition-all duration-300">
                    Sign In <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Football Animation */}
            <div className="hidden lg:flex lg:items-center lg:justify-center relative mt-16 h-56 sm:h-64 lg:mt-0 lg:h-full">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Replace embedded video with football animation */}
                <div className="w-full h-full relative overflow-hidden rounded-xl border border-indigo-500/50 bg-gradient-to-br from-indigo-900/40 to-purple-900/40">
                  {/* Container for the football */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    {/* Football with bounce effect */}
                    <div className="relative w-32 h-32 animate-bounce-football">
                      <div className="absolute inset-0 w-full h-full rounded-full bg-white shadow-xl border-2 border-gray-200">
                        {/* Football pentagon pattern */}
                        <div className="absolute inset-0 w-full h-full">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                            </defs>
                            <path d="M50,10 L90,40 L75,85 L25,85 L10,40 Z" fill="none" stroke="black" strokeWidth="1.5"></path>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="black" strokeWidth="1" strokeDasharray="4 4"></circle>
                            <circle cx="50" cy="50" r="25" fill="none" stroke="black" strokeWidth="1"></circle>
                            <path d="M50,25 L65,45 L58,65 H42 L35,45 Z" fill="black"></path>
                            <path d="M10,40 L35,45" stroke="black" strokeWidth="1"></path>
                            <path d="M90,40 L65,45" stroke="black" strokeWidth="1"></path>
                            <path d="M25,85 L42,65" stroke="black" strokeWidth="1"></path>
                            <path d="M75,85 L58,65" stroke="black" strokeWidth="1"></path>
                          </svg>
                        </div>
                      </div>
                      
                      {/* Add glow effect around the ball */}
                      <div className="absolute inset-0 w-full h-full rounded-full bg-white/30 blur-md -z-10 scale-110"></div>
                    </div>
                    
                    {/* Shadow effect that grows and shrinks with the bounce */}
                    <div className="absolute bottom-16 w-16 h-2 bg-black/40 rounded-full blur-sm animate-shadow-scale"></div>
                  </div>

                  {/* Light rays and decorative elements */}
                  <div className="absolute inset-0 z-0">
                    {/* Light beams */}
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-indigo-500/30 rotate-[20deg] blur-sm"></div>
                    <div className="absolute top-0 right-1/3 w-1 h-full bg-purple-500/30 -rotate-[15deg] blur-sm"></div>
                    <div className="absolute top-0 right-1/4 w-1 h-full bg-indigo-500/30 rotate-[30deg] blur-sm"></div>
                    <div className="absolute top-0 left-1/3 w-1 h-full bg-purple-500/30 -rotate-[25deg] blur-sm"></div>

                    {/* Glowing spheres */}
                    <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-indigo-600/30 blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-purple-600/30 blur-3xl"></div>
                    
                    {/* Floating circles */}
                    <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-indigo-400/60 animate-float-slow-1"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-purple-400/60 animate-float-slow-2"></div>
                    <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-blue-400/60 animate-float-slow-3"></div>

                    {/* Trail effect for the football */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-indigo-400/40 animate-pulse-expand"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-indigo-400/30 animate-pulse-expand delay-100"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-indigo-400/20 animate-pulse-expand delay-200"></div>
                  </div>

                  {/* Overlay gradient - lighter than before */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent mix-blend-overlay pointer-events-none z-20"></div>
                </div>
              </div>
            </div>

            <ScrollReveal animation="slide-left" threshold={0.3} delay={200} className="lg:hidden">
              <div className="relative mt-16 h-56 sm:h-64 lg:mt-8 lg:h-full">
                <ImageParallax strength={10}>
                  <div className="relative overflow-hidden rounded-xl group h-full">
                    <img
                      className="absolute inset-0 w-full h-full object-cover object-center rounded-xl transition-all duration-500 group-hover:scale-110"
                      src="https://images.unsplash.com/photo-1614632537197-38a17061c2bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Football stadium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 to-transparent mix-blend-overlay rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent rounded-xl"></div>
                    <div className="absolute bottom-0 right-0 p-6 text-white text-right">
                      <p className="text-sm font-medium uppercase tracking-wider mb-2 opacity-90">Global Reach</p>
                      <h3 className="text-xl font-bold">Discover talent from stadiums worldwide</h3>
                    </div>
                  </div>
                </ImageParallax>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Football Scout, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add animation classes to tailwind.config.js */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 45s linear infinite;
        }

        /* New animations for football */
        @keyframes bounce-football {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px) rotate(10deg); }
        }
        
        @keyframes shadow-scale {
          0%, 100% { transform: scaleX(1); opacity: 0.2; }
          50% { transform: scaleX(0.7); opacity: 0.1; }
        }
        
        @keyframes float-slow-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(0, -15px); }
          75% { transform: translate(-10px, -5px); }
        }
        
        @keyframes float-slow-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-15px, 5px); }
          50% { transform: translate(-5px, 15px); }
          75% { transform: translate(10px, 5px); }
        }
        
        @keyframes float-slow-3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(10px, 15px); }
          66% { transform: translate(-15px, 10px); }
        }
        
        @keyframes pulse-expand {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        
        .animate-bounce-football {
          animation: bounce-football 2s ease-in-out infinite;
        }
        
        .animate-shadow-scale {
          animation: shadow-scale 2s ease-in-out infinite;
        }
        
        .animate-float-slow-1 {
          animation: float-slow-1 8s ease-in-out infinite;
        }
        
        .animate-float-slow-2 {
          animation: float-slow-2 9s ease-in-out infinite;
        }
        
        .animate-float-slow-3 {
          animation: float-slow-3 7s ease-in-out infinite;
        }
        
        .animate-pulse-expand {
          animation: pulse-expand 3s ease-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.5s;
        }
        
        .delay-200 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
