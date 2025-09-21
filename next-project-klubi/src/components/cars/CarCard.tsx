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
import { ExternalLink, Heart, MapPin, Fuel, Users, Package } from 'lucide-react';

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
      {/* Image Container with improved aspect ratio and no clipping */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-gray-100">
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Location Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="glass" size="sm" className="shadow-sm backdrop-blur-md">
            <MapPin className="w-3 h-3 mr-1" />
            {car.Location}
          </Badge>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <Button 
            size="icon" 
            variant="glass" 
            className={cn(
              "h-9 w-9 backdrop-blur-md shadow-sm transition-all duration-300",
              "opacity-80 hover:opacity-100 group-hover:scale-110",
              isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"
            )}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <Heart className={cn("h-4 w-4 transition-all", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Angle Selection Pills - Melhor integração */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex gap-0.5 justify-center bg-white/90 backdrop-blur-md px-1.5 py-1 rounded-full shadow-lg border border-white/40">
            {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
              <button
                key={a}
                aria-label={`Ver ${angleLabel[a]}`}
                onClick={(e) => {
                  e.preventDefault();
                  setAngle(a);
                }}
                className={cn(
                  'text-[10px] px-2 py-1 rounded-full transition-all duration-300 font-semibold',
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

      {/* Content Section */}
      <CardContent className="p-5 space-y-3">
        {/* Header - Layout melhorado para evitar clipping */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-primary transition-colors truncate">
                {car.Name}
              </h3>
              <p className="text-gray-600 font-medium text-sm truncate">{car.Model}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatPrice(car.Price)}
              </span>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-sm">{powertainIcons[powertrain]}</span>
            <span className="capitalize">{powertrain}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{seats}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>{trunkLiters}L</span>
          </div>
        </div>

        {/* Tags */}
        {car.Tags && car.Tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {car.Tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" size="sm" className="text-[10px] px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {car.Tags.length > 3 && (
              <Badge variant="outline" size="sm" className="text-[10px] px-2 py-0.5">
                +{car.Tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Button - Melhor integração */}
        <div className="pt-1">
          <Button 
            size="sm" 
            variant="gradient" 
            className="w-full h-9 group-hover:shadow-glow-primary transition-all duration-300 text-sm font-semibold" 
            asChild
          >
            <Link href={`/cars?${params.toString()}`}>
              <ExternalLink className="h-3.5 w-3.5 mr-2" />
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}





