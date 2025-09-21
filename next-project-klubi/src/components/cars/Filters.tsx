'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = React.useState<string>(params.get('q') || params.get('name') || '');
  const [model, setModel] = React.useState<string>(params.get('model') || '');
  const [location, setLocation] = React.useState<string>(params.get('location') || '');
  const [minPrice, setMinPrice] = React.useState<string>(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = React.useState<string>(params.get('maxPrice') || '');

  const apply = () => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (model) next.set('model', model);
    if (location) next.set('location', location);
    if (minPrice) next.set('minPrice', minPrice);
    if (maxPrice) next.set('maxPrice', maxPrice);
    router.push(`/cars?${next.toString()}`);
  };

  const clear = () => {
    setQ('');
    setModel('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/cars');
  };

  return (
    <Card variant="glass" className="rounded-2xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Input placeholder="Marca ou termo" value={q} onChange={(e) => setQ(e.target.value)} />
        <Input placeholder="Modelo" value={model} onChange={(e) => setModel(e.target.value)} />
        <Input placeholder="Localização" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input placeholder="Preço mín" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input placeholder="Preço máx" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <Button variant="ghost" onClick={clear}>Limpar</Button>
        <Button variant="gradient" onClick={apply}>Aplicar</Button>
      </div>
    </Card>
  );
}





