'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import { ChatMessage as ChatMessageType, Car } from '@/types/car';
import { Bot, User, ExternalLink, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { slugify } from '@/lib/utils';

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
            <div className="prose prose-sm max-w-none prose-headings:mt-0 prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-strong:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Car Cards */}
        {message.cars && message.cars.length > 0 && (
          <div className="mt-4 w-full max-w-5xl">
            {message.cars.length === 1 ? (
              <SingleCarCard car={message.cars[0]} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {message.cars.map((car, index) => (
                  <CarCard key={index} car={car} />
                ))}
              </div>
            )}
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
  const [angle, setAngle] = React.useState<'quarter' | 'side' | 'back' | 'interior'>('quarter');
  const [showModal, setShowModal] = React.useState(false);

  const angleLabel: Record<typeof angle, string> = {
    quarter: '3/4',
    side: 'Lateral',
    back: 'Traseira',
    interior: 'Interior',
  } as const;

  const angles: Array<'quarter' | 'side' | 'back' | 'interior'> = ['quarter', 'side', 'back', 'interior'];
  const currentIndex = angles.indexOf(angle);
  
  const nextAngle = () => {
    const nextIndex = (currentIndex + 1) % angles.length;
    setAngle(angles[nextIndex]);
  };
  
  const prevAngle = () => {
    const prevIndex = (currentIndex - 1 + angles.length) % angles.length;
    setAngle(angles[prevIndex]);
  };

  const currentSrc = car.Images[angle];
  const slug = slugify(`${car.Name}-${car.Model}`);

  return (
    <>
      <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-gray-50/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={currentSrc}
            alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`}
            fill
            className="object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Location badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
              📍 {car.Location}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={prevAngle}
              className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-all duration-200"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={nextAngle}
              className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-black/80 transition-all duration-200"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => setShowModal(true)}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label="Ver detalhes"
            >
              <Maximize2 className="h-5 w-5 text-gray-700" />
            </button>
            <Link
              href={`/cars/${slug}`}
              target="_blank"
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label="Abrir página do carro"
            >
              <ExternalLink className="h-5 w-5 text-gray-700" />
            </Link>
          </div>

          {/* Angle selector */}
          <div className="absolute bottom-4 left-4 flex gap-1.5">
            {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAngle(a)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  angle === a 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                )}
                aria-label={`Ver ${angleLabel[a]}`}
              />
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{car.Name}</h3>
              <p className="text-gray-600 text-sm font-medium">{car.Model}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatPrice(car.Price)}
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all duration-200"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image section */}
              <div className="relative h-80 md:h-[28rem] bg-gray-50">
                <Image 
                  src={currentSrc} 
                  alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`} 
                  fill 
                  className="object-contain" 
                />
              </div>
              
              {/* Info section */}
              <div className="p-8 flex flex-col">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{car.Name}</h2>
                    <p className="text-xl text-gray-600 font-medium">{car.Model}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-500">📍</span>
                      <span className="text-sm font-medium text-gray-700">{car.Location}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {formatPrice(car.Price)}
                    </div>
                  </div>

                  {/* Angle selector */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Visualizar:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => setAngle(a)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                            angle === a 
                              ? 'bg-primary text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          )}
                        >
                          {angleLabel[a]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href={`/cars/${slug}`}
                    target="_blank"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Ver página completa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SingleCarCard({ car }: { car: Car }) {
  const [angle, setAngle] = React.useState<'quarter' | 'side' | 'back' | 'interior'>('quarter');
  const [showModal, setShowModal] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const angleLabel: Record<typeof angle, string> = {
    quarter: 'Visão 3/4',
    side: 'Lateral',
    back: 'Traseira',
    interior: 'Interior',
  } as const;

  const angles: Array<'quarter' | 'side' | 'back' | 'interior'> = ['quarter', 'side', 'back', 'interior'];
  const currentIndex = angles.indexOf(angle);
  
  const nextAngle = () => {
    const nextIndex = (currentIndex + 1) % angles.length;
    setAngle(angles[nextIndex]);
  };
  
  const prevAngle = () => {
    const prevIndex = (currentIndex - 1 + angles.length) % angles.length;
    setAngle(angles[prevIndex]);
  };

  const currentSrc = car.Images[angle];
  const slug = slugify(`${car.Name}-${car.Model}`);

  return (
    <>
      <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50/30 to-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 backdrop-blur-sm hover:scale-[1.01]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-[28rem]">
          {/* Enhanced Image Section */}
          <div className="lg:col-span-2 relative h-80 lg:h-auto overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={currentSrc}
              alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`}
              fill
              className={cn(
                "object-contain transition-all duration-700 ease-out p-4",
                imageLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
                "group-hover:scale-105"
              )}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            
            {/* Enhanced navigation arrows */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={prevAngle}
                className="w-14 h-14 bg-white/95 backdrop-blur-lg rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            </div>
            
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={nextAngle}
                className="w-14 h-14 bg-white/95 backdrop-blur-lg rounded-full flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Modern location badge */}
            <div className="absolute top-6 left-6">
              <Badge variant="glass" className="shadow-lg backdrop-blur-xl bg-white/90 text-gray-800 border border-white/40">
                📍 {car.Location}
              </Badge>
            </div>

            {/* Action buttons with better styling */}
            <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={() => setShowModal(true)}
                className="w-12 h-12 bg-white/95 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                aria-label="Ver detalhes"
              >
                <Maximize2 className="h-5 w-5 text-gray-700" />
              </button>
              <Link
                href={`/cars/${slug}`}
                target="_blank"
                className="w-12 h-12 bg-white/95 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200/50"
                aria-label="Abrir página do carro"
              >
                <ExternalLink className="h-5 w-5 text-gray-700" />
              </Link>
            </div>

            {/* Enhanced angle selector dots */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              {angles.map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300 hover:scale-125',
                    angle === a 
                      ? 'bg-primary shadow-lg scale-125 shadow-primary/30' 
                      : 'bg-white/80 hover:bg-white shadow-md'
                  )}
                  aria-label={`Ver ${angleLabel[a]}`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Info Section */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            {/* Header section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 leading-tight">{car.Name}</h2>
                <p className="text-xl text-gray-600 font-semibold">{car.Model}</p>
                <div className="text-3xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {formatPrice(car.Price)}
                </div>
              </div>

              {/* Tags */}
              {car.Tags && car.Tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {car.Tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" size="sm" className="text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                  {car.Tags.length > 4 && (
                    <Badge variant="outline" size="sm" className="text-xs font-medium">
                      +{car.Tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Modern thumbnail grid */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ângulos</p>
              <div className="grid grid-cols-4 gap-2">
                {angles.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAngle(a)}
                    className={cn(
                      'relative aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-105',
                      'border-2 shadow-sm',
                      angle === a 
                        ? 'border-primary shadow-xl shadow-primary/20 scale-105' 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    )}
                    aria-label={`Ver ${angleLabel[a]}`}
                  >
                    <Image 
                      src={car.Images[a]} 
                      alt={angleLabel[a]} 
                      fill 
                      className="object-cover" 
                      sizes="100px"
                    />
                    {angle === a && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full shadow-lg border border-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0">
                      <div className="bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white text-[10px] px-1 py-1 text-center font-semibold">
                        {angleLabel[a].replace('Visão ', '')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="pt-6 mt-auto">
              <Link
                href={`/cars/${slug}`}
                target="_blank"
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white px-6 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl group"
              >
                <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Ver Página Completa
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* Enhanced Modal - Same as CarCard */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all duration-200"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-80 md:h-[28rem] bg-gray-50">
                <Image 
                  src={currentSrc} 
                  alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`} 
                  fill 
                  className="object-contain" 
                />
              </div>
              
              <div className="p-8 flex flex-col">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">{car.Name}</h2>
                    <p className="text-xl text-gray-600 font-medium">{car.Model}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-sm text-gray-500">📍</span>
                      <span className="text-sm font-medium text-gray-700">{car.Location}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {formatPrice(car.Price)}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Visualizar:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {angles.map((a) => (
                        <button
                          key={a}
                          onClick={() => setAngle(a)}
                          className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                            angle === a 
                              ? 'bg-primary text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          )}
                        >
                          {angleLabel[a]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href={`/cars/${slug}`}
                    target="_blank"
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Ver página completa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}




