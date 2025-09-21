'use client';

import React from 'react';
import Image from 'next/image';
import type { Car } from '@/types/car';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import { MapPin, Fuel, Settings, MessageCircle, Phone, Mail } from 'lucide-react';

export function CarGallery({ car }: { car: Car }) {
  const [angle, setAngle] = React.useState<'quarter' | 'side' | 'back' | 'interior'>('quarter');

  const angleLabel: Record<typeof angle, string> = {
    quarter: 'Visão 3/4',
    side: 'Lateral',
    back: 'Traseira',
    interior: 'Interior',
  } as const;

  const src = car.Images[angle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Mobile Responsive */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10" />
        <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem]">
          <Image 
            src={src} 
            alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`} 
            fill 
            className="object-cover" 
            sizes="100vw"
            priority
          />
        </div>
        
        {/* Floating Info Card - Mobile Responsive */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full mx-3 sm:mx-4">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 sm:mb-2">{car.Name}</h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-medium mb-3 sm:mb-4">{car.Model}</p>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4">
                {formatPrice(car.Price)}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-medium">{car.Location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section - Mobile Responsive */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Photo Selection - Mobile Responsive */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Galeria de Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
              {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={cn(
                    'group relative h-20 sm:h-24 lg:h-32 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105',
                    angle === a 
                      ? 'ring-2 sm:ring-4 ring-primary shadow-xl scale-105' 
                      : 'ring-1 sm:ring-2 ring-gray-200 hover:ring-gray-300'
                  )}
                  aria-label={`Trocar para ${angleLabel[a]}`}
                >
                  <Image 
                    src={car.Images[a]} 
                    alt={angleLabel[a]} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110" 
                    sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, 15vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                    <p className="text-white text-[10px] sm:text-xs font-medium text-center">{angleLabel[a]}</p>
                  </div>
                  {angle === a && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Marca</h3>
                  <p className="text-gray-600 text-sm truncate">{car.Name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Fuel className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Modelo</h3>
                  <p className="text-gray-600 text-sm truncate">{car.Model}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Localização</h3>
                  <p className="text-gray-600 text-sm truncate">{car.Location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section - Mobile Responsive */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Interessado neste veículo?</h3>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-4 sm:mb-6 px-2">Entre em contato para mais informações e agendamento de test drive.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <a
                  href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no ${car.Name} ${car.Model} por ${formatPrice(car.Price)}. Poderia me passar mais informações?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 justify-center"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>WhatsApp</span>
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <a href="tel:+5511999999999" className="flex items-center gap-2 justify-center">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Ligar</span>
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50 text-sm sm:text-base h-10 sm:h-11"
                asChild
              >
                <a
                  href={`mailto:contato@carfinder.com?subject=Interesse no ${car.Name} ${car.Model}&body=Olá! Tenho interesse no ${car.Name} ${car.Model} por ${formatPrice(car.Price)}. Poderia me passar mais informações?`}
                  className="flex items-center gap-2 justify-center"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>E-mail</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


