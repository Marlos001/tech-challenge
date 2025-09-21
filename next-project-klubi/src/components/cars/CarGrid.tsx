'use client';

import React from 'react';
import type { Car } from '@/types/car';
import { CarCard } from '@/components/cars/CarCard';
import { Card } from '@/components/ui/Card';

export function CarGrid({ cars }: { cars: Car[] }) {
  if (!cars || cars.length === 0) {
    return (
      <Card variant="glass" className="rounded-2xl p-8 text-center text-gray-600">
        Nenhum carro disponível no momento.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car, idx) => (
        <CarCard key={`${car.Name}-${car.Model}-${idx}`} car={car} />
      ))}
    </div>
  );
}


