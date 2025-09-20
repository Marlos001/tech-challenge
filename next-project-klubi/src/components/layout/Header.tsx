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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Car className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors duration-200" />
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <span className="text-xl font-bold text-gradient">
              CarFinder
            </span>
          </Link>

          {/* Single CTA Button */}
          <Button asChild variant="gradient" size="default">
            {isOnChat ? (
              <Link href="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Link>
            ) : (
              <Link href="/chat" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Testar Agora
              </Link>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
