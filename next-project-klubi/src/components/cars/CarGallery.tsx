'use client';

import React from 'react';
import Image from 'next/image';
import type { Car } from '@/types/car';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';
import { MapPin, Calendar, Fuel, Settings, MessageCircle, Phone, Mail } from 'lucide-react';

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
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10" />
        <div className="relative h-[70vh] overflow-hidden rounded-b-[3rem]">
          <Image 
            src={src} 
            alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`} 
            fill 
            className="object-cover" 
          />
        </div>
        
        {/* Floating Info Card */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h1 className="text-3xl font-black text-gray-900 mb-2">{car.Name}</h1>
              <p className="text-xl text-gray-600 font-medium mb-4">{car.Model}</p>
              <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                {formatPrice(car.Price)}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">{car.Location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Photo Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Galeria de Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={cn(
                    'group relative h-32 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105',
                    angle === a 
                      ? 'ring-4 ring-primary shadow-xl scale-105' 
                      : 'ring-2 ring-gray-200 hover:ring-gray-300'
                  )}
                  aria-label={`Trocar para ${angleLabel[a]}`}
                >
                  <Image 
                    src={car.Images[a]} 
                    alt={angleLabel[a]} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium text-center">{angleLabel[a]}</p>
                  </div>
                  {angle === a && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Marca</h3>
                  <p className="text-gray-600">{car.Name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Fuel className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Modelo</h3>
                  <p className="text-gray-600">{car.Model}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Localização</h3>
                  <p className="text-gray-600">{car.Location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Interessado neste veículo?</h3>
            <p className="text-xl opacity-90 mb-6">Entre em contato para mais informações e agendamento de test drive.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50"
                asChild
              >
                <a
                  href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no ${car.Name} ${car.Model} por ${formatPrice(car.Price)}. Poderia me passar mais informações?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50"
                asChild
              >
                <a href="tel:+5511999999999" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>Ligar</span>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary border-white hover:bg-gray-50"
                asChild
              >
                <a
                  href={`mailto:contato@carfinder.com?subject=Interesse no ${car.Name} ${car.Model}&body=Olá! Tenho interesse no ${car.Name} ${car.Model} por ${formatPrice(car.Price)}. Poderia me passar mais informações?`}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-5 w-5" />
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


