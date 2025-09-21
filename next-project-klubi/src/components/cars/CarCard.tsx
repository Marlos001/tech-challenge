'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import type { Car } from '@/types/car';
import { ExternalLink, Heart, MapPin, Users, Package } from 'lucide-react';

export function CarCard({ car }: { car: Car }) {
  const [angle, setAngle] = React.useState<'quarter' | 'side' | 'back' | 'interior'>('quarter');
  const [isLiked, setIsLiked] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const angleLabel: Record<typeof angle, string> = {
    quarter: '3/4',
    side: 'Lateral',
    back: 'Traseira',
    interior: 'Interior',
  } as const;

  const currentSrc = car.Images[angle];
  const params = new URLSearchParams({
    name: car.Name,
    model: car.Model,
    location: car.Location,
  });

  const powertrain = car.Powertrain || 'flex';
  const seats = car.Seats || 5;
  const trunkLiters = car.TrunkLiters || 300;

  const powertainIcons = {
    electric: '⚡',
    hybrid: '🔋',
    flex: '⛽',
    gasoline: '⛽',
    diesel: '🛢️',
  };

  return (
    <Card 
      variant="glow" 
      className="group overflow-hidden transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-crisp hover:shadow-lifted"
    >
      {/* Image Container - Mobile Responsive */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg sm:rounded-t-xl bg-gray-100">
        <Image
          src={currentSrc}
          alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`}
          fill
          className={cn(
            "object-cover transition-all duration-700 ease-out",
            imageLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
            "group-hover:scale-105"
          )}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Location Badge - Mobile Responsive */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <Badge variant="glass" size="sm" className="shadow-sm backdrop-blur-md text-xs">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            <span className="hidden sm:inline">{car.Location}</span>
            <span className="sm:hidden">{car.Location.split(',')[0]}</span>
          </Badge>
        </div>

        {/* Favorite Button - Mobile Responsive */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
          <Button 
            size="icon" 
            variant="glass" 
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 backdrop-blur-md shadow-sm transition-all duration-300",
              "opacity-80 hover:opacity-100 group-hover:scale-110",
              isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Angle Selection Pills - Mobile Responsive */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 z-10">
          <div className="flex gap-0.5 justify-center bg-white/90 backdrop-blur-md px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/40">
            {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
              <button
                key={a}
                aria-label={`Ver ${angleLabel[a]}`}
                onClick={(e) => {
                  e.preventDefault();
                  setAngle(a);
                }}
                className={cn(
                  'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all duration-300 font-semibold',
                  'hover:scale-110 active:scale-95 transform-gpu',
                  angle === a 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md scale-105' 
                    : 'bg-transparent text-gray-600 hover:bg-gray-100/70 hover:text-gray-800'
                )}
              >
                {angleLabel[a]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section - Mobile Responsive */}
      <CardContent className="p-3 sm:p-4 lg:p-5 space-y-2 sm:space-y-3">
        {/* Header - Mobile Responsive */}
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight group-hover:text-primary transition-colors truncate">
                {car.Name}
              </h3>
              <p className="text-gray-600 font-medium text-xs sm:text-sm truncate">{car.Model}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-sm sm:text-base lg:text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatPrice(car.Price)}
              </span>
            </div>
          </div>
        </div>

        {/* Car Details - Mobile Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-sm">{powertainIcons[powertrain]}</span>
            <span className="capitalize text-xs">{powertrain}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">{seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="text-xs">{trunkLiters}L</span>
          </div>
        </div>

        {/* Tags - Mobile Responsive */}
        {car.Tags && car.Tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {car.Tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {car.Tags.length > 3 && (
              <Badge variant="outline" size="sm" className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5">
                +{car.Tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button - Mobile Responsive */}
        <div className="pt-1">
          <Button 
            size="sm" 
            variant="gradient" 
            className="w-full h-8 sm:h-9 group-hover:shadow-glow-primary transition-all duration-300 text-xs sm:text-sm font-semibold" 
            asChild
          >
            <Link href={`/cars?${params.toString()}`}>
              <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





