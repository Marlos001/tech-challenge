'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { ChatMessage as ChatMessageType, Car } from '@/types/car';
import { Bot, User, Heart, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div
      className={cn(
        'flex gap-4 max-w-4xl mx-auto animate-slide-up',
        isBot ? 'justify-start' : 'justify-end'
      )}
    >
      {isBot && (
        <Avatar size="lg" className="flex-shrink-0 ring-2 ring-primary/20">
          <AvatarFallback className="gradient-primary text-white">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col gap-2', isBot ? 'items-start' : 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 max-w-md break-words transition-all duration-200',
            isBot
              ? 'bg-white border border-gray-200 text-gray-900 shadow-sm'
              : 'gradient-primary text-white shadow-glow'
          )}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-sm text-gray-500 ml-2">Digitando...</span>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          )}
        </div>

        {/* Car Cards */}
        {message.cars && message.cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full max-w-4xl">
            {message.cars.map((car, index) => (
              <CarCard key={index} car={car} />
            ))}
          </div>
        )}

        <span className="text-xs text-gray-400 px-2">
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {!isBot && (
        <Avatar size="lg" className="flex-shrink-0 ring-2 ring-secondary/20">
          <AvatarFallback className="gradient-secondary text-white">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function CarCard({ car }: { car: Car }) {
  return (
    <Card variant="elevated" className="group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="relative h-32 overflow-hidden">
        <Image
          src={car.Images.quarter}
          alt={`${car.Name} ${car.Model}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="glass" size="sm">
            {car.Location}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Button size="icon" variant="glass" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900 text-sm">
            {car.Name}
          </h4>
        </div>

        <p className="text-gray-600 text-sm mb-3">{car.Model}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(car.Price)}
          </span>
          <Button size="sm" variant="outline" className="text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}



