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
import { ExternalLink, Heart } from 'lucide-react';

export function CarCard({ car }: { car: Car }) {
  const [angle, setAngle] = React.useState<'quarter' | 'side' | 'back' | 'interior'>('quarter');

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

  return (
    <Card variant="elevated" className="group hover:scale-105 transition-all duration-300 overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={currentSrc}
          alt={`${car.Name} ${car.Model} - ${angleLabel[angle]}`}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="glass" size="sm">
            {car.Location}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2 flex gap-1 bg-white/60 backdrop-blur px-1.5 py-1 rounded-lg shadow-sm">
          {(['quarter', 'side', 'back', 'interior'] as const).map((a) => (
            <button
              key={a}
              aria-label={`Ver ${angleLabel[a]}`}
              onClick={() => setAngle(a)}
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-md transition-all',
                angle === a ? 'bg-primary text-white' : 'bg-white/70 text-gray-700'
              )}
            >
              {angleLabel[a]}
            </button>
          ))}
        </div>
        <div className="absolute top-2 right-2">
          <Button size="icon" variant="glass" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900 text-sm">{car.Name}</h4>
        </div>

        <p className="text-gray-600 text-sm mb-3">{car.Model}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatPrice(car.Price)}</span>
          <Button size="sm" variant="outline" className="text-xs" asChild>
            <Link href={`/cars?${params.toString()}`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


