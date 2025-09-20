'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Send, Mic, Paperclip } from 'lucide-react';

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
    <div className={cn('space-y-4', className)}>
      {/* Ultra-Modern Input Form */}
      <div className="glass-ultra rounded-2xl p-4 shadow-xl">
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          {/* Enhanced Input Container */}
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="pl-6 pr-16 h-14 text-lg rounded-xl border-none bg-white/80 focus:bg-white focus:shadow-soft transition-all duration-300 placeholder:text-gray-500"
            />
            
            {/* Enhanced Input Actions */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-10 w-10 hover:bg-gray-100 rounded-xl transition-all duration-200"
                disabled={isLoading}
              >
                <Mic className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Ultra-Modern Send Button */}
          <Button
            type="submit"
            size="lg"
            variant={message.trim() ? 'gradient' : 'ghost'}
            className={cn(
              'h-14 w-14 rounded-xl transition-all duration-300 transform',
              message.trim() 
                ? 'scale-100 opacity-100 shadow-glow-primary hover:scale-105' 
                : 'scale-95 opacity-40 hover:opacity-60'
            )}
            disabled={!message.trim() || isLoading}
            loading={isLoading}
          >
            <Send className="h-6 w-6" />
          </Button>
        </form>
      </div>

      {/* Modern Quick Actions */}
      <div className="flex flex-wrap gap-3">
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
      className="text-sm px-4 py-2 rounded-xl glass-subtle hover:glass-ultra hover:scale-105 transition-all duration-300 shadow-soft hover:shadow-lifted"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
