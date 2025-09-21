'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Digite sua mensagem...',
  className,
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn('space-y-3 sm:space-y-4', className)}>
      {/* Ultra-Modern Input Form - Mobile Responsive */}
      <div className="glass-ultra rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 sm:gap-4">
          {/* Enhanced Input Container - Mobile Responsive */}
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="pl-4 sm:pl-6 pr-4 sm:pr-6 h-12 sm:h-14 text-base sm:text-lg rounded-lg sm:rounded-xl border-none bg-white/80 focus:bg-white focus:shadow-soft transition-all duration-300 placeholder:text-gray-500"
            />
          </div>

          {/* Ultra-Modern Send Button - Mobile Responsive */}
          <Button
            type="submit"
            size="lg"
            variant={message.trim() ? 'gradient' : 'ghost'}
            className={cn(
              'h-12 w-12 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl transition-all duration-300 transform flex-shrink-0',
              message.trim() 
                ? 'scale-100 opacity-100 shadow-glow-primary hover:scale-105' 
                : 'scale-95 opacity-40 hover:opacity-60'
            )}
            disabled={!message.trim() || isLoading}
            loading={isLoading}
          >
            <Send className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </form>
      </div>

      {/* Modern Quick Actions - Hidden on Mobile */}
      <div className="hidden sm:flex flex-wrap gap-3">
        <QuickAction
          text="SUV elétrico familiar"
          onClick={() => setMessage('Quero um SUV elétrico para família')}
          disabled={isLoading}
        />
        <QuickAction
          text="Até R$ 100k"
          onClick={() => setMessage('Carros até R$ 100.000')}
          disabled={isLoading}
        />
        <QuickAction
          text="Honda Civic SP"
          onClick={() => setMessage('Honda Civic em São Paulo')}
          disabled={isLoading}
        />
        <QuickAction
          text="Carro econômico"
          onClick={() => setMessage('Carro econômico para cidade')}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}

function QuickAction({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="glass"
      className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl glass-subtle hover:glass-ultra hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-lifted whitespace-nowrap"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
