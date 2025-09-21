import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import carsData from '@/data/cars.json';
import type { Car } from '@/types/car';
import { CarGrid } from '@/components/cars/CarGrid';

export default function CarsPage() {
  const cars = carsData as Car[];

  return (
    <div className="min-h-screen gradient-mesh">
      <Header />

      <div className="pt-16 pb-6">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col gap-4 sm:gap-6">
            <Card variant="glass" className="rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-black gradient-text mb-2">Carros</h1>
              <p className="text-gray-600 text-sm sm:text-base">Fotos e informações básicas.</p>
            </Card>

            <CarGrid cars={cars} />
          </div>
        </div>
      </div>
    </div>
  );
}


