'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Car, MessageCircle, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isOnChat = pathname === '/chat';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'glass-ultra py-4 shadow-lifted'
          : 'py-6',
        className
      )}
      style={{
        background: isScrolled 
          ? 'rgba(255, 255, 255, 0.85)' 
          : 'transparent'
      }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile Responsive */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Car className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:text-primary-dark transition-colors duration-200" />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gradient">
              CarFinder
            </span>
          </Link>

          {/* Single CTA Button - Mobile Responsive */}
          <Button asChild variant="gradient" size="sm" className="text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">
            {isOnChat ? (
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
            ) : (
              <Link href="/chat" className="flex items-center">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Testar Agora</span>
                <span className="sm:hidden">Chat</span>
              </Link>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
