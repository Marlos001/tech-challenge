import React from 'react';
import carsData from '@/data/cars.json';
import type { Car } from '@/types/car';
import { slugify } from '@/lib/utils';
import { CarGallery } from '@/components/cars/CarGallery';

function getCarBySlug(slug: string): Car | null {
  const cars = carsData as Car[];
  const found = cars.find((c) => slugify(`${c.Name}-${c.Model}`) === slug);
  return found ?? null;
}

export default function CarDetailsPage({ params }: { params: { slug: string } }) {
  const car = getCarBySlug(params.slug);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center text-gray-600 max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carro não encontrado</h1>
          <p>O veículo que você está procurando não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  return <CarGallery car={car} />;
}