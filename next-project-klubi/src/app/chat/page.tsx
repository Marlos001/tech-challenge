'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType, Car } from '@/types/car';
import { 
  MessageCircle, 
  Sparkles, 
  Trash2, 
  Download,
  RefreshCw,
  Zap,
  Car as CarIcon,
  Search
} from 'lucide-react';
import carsData from '@/data/cars.json';

const cars = carsData as Car[];

const welcomeMessage: ChatMessageType = {
  id: '1',
  role: 'assistant',
  content: `Olá! 👋 Sou o CarFinder AI, sua assistente inteligente para encontrar o carro perfeito!

Posso te ajudar a:
🔍 Buscar carros por marca, modelo ou características
💰 Filtrar por faixa de preço
📍 Encontrar veículos na sua região
⚡ Recomendar opções baseadas no seu perfil

Como posso te ajudar hoje?`,
  timestamp: new Date(),
};

const mockResponses = [
  {
    keywords: ['suv', 'elétrico', 'eletrico'],
    response: 'Ótima escolha! SUVs elétricos são o futuro da mobilidade. Encontrei algumas opções incríveis para você:',
    cars: cars.filter(car => car.Name === 'BYD' || car.Model.toLowerCase().includes('cross')),
  },
  {
    keywords: ['honda', 'civic'],
    response: 'O Honda Civic é uma excelente escolha! É conhecido pela confiabilidade e economia. Aqui estão as opções disponíveis:',
    cars: cars.filter(car => car.Name === 'Honda'),
  },
  {
    keywords: ['100000', '100.000', 'cem mil'],
    response: 'Vou mostrar os melhores carros até R$ 100.000. Você tem várias opções excelentes nessa faixa:',
    cars: cars.filter(car => car.Price <= 100000),
  },
  {
    keywords: ['são paulo', 'sp'],
    response: 'São Paulo tem uma grande variedade de carros disponíveis! Aqui estão as opções na região:',
    cars: cars.filter(car => car.Location.toLowerCase().includes('são paulo')),
  },
  {
    keywords: ['barato', 'económico', 'economico', 'mais barato'],
    response: 'Vou te mostrar as opções mais econômicas disponíveis. Ótimas escolhas para quem busca valor:',
    cars: cars.sort((a, b) => a.Price - b.Price).slice(0, 3),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateResponse = (userMessage: string): { response: string; cars: Car[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching mock response
    const mockResponse = mockResponses.find(mock =>
      mock.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (mockResponse) {
      return {
        response: mockResponse.response,
        cars: mockResponse.cars,
      };
    }

    // Default response with random cars
    const randomCars = cars.sort(() => 0.5 - Math.random()).slice(0, 2);
    return {
      response: `Entendi sua busca! Baseado no que você mencionou, encontrei algumas opções que podem interessar. Dê uma olhada:`,
      cars: randomCars,
    };
  };

  const handleSendMessage = async (content: string) => {
    // Add welcome message if this is the first user message
    const isFirstMessage = messages.length === 0;
    
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    if (isFirstMessage) {
      setMessages([welcomeMessage, userMessage]);
    } else {
      setMessages(prev => [...prev, userMessage]);
    }
    
    setIsLoading(true);
    setIsTyping(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsTyping(false);

    // Generate response
    const { response, cars: matchedCars } = generateResponse(content);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const assistantMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      cars: matchedCars,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      
      <div className="pt-16 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Ultra-Modern Chat Header */}
            <div className="glass-card rounded-3xl p-6 mb-6 animate-fade-in shadow-lifted">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
                      <MessageCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white animate-pulse shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black gradient-text">CarFinder AI</h1>
                    <p className="text-gray-600 flex items-center gap-3 text-lg">
                      <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-sm"></span>
                      Assistente Inteligente Online
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  variant="glass"
                  onClick={clearChat}
                  className="hover-lift rounded-2xl px-6 py-3 flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    <span>Novo Chat</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Ultra-Modern Chat Container */}
            <div className="glass-card rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              {/* Welcome State */}
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center animate-slide-up">
                    <div className="relative inline-block mb-8">
                      <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-soft">
                        <MessageCircle className="h-12 w-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full animate-float" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Olá! Sou o CarFinder AI 👋
                    </h3>
                    <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
                      Estou aqui para ajudar você a encontrar o carro perfeito. 
                      <br />
                      <span className="font-medium">O que você está procurando?</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-8 space-y-8"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'
                  }}
                >
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  
                  {isTyping && (
                    <ChatMessage
                      message={{
                        id: 'typing',
                        role: 'assistant',
                        content: '',
                        timestamp: new Date(),
                      }}
                      isTyping={true}
                    />
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Ultra-Modern Chat Input */}
              <div className="p-8 border-t border-white/20 bg-white/50 backdrop-blur-sm">
                <ChatInput
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                  placeholder="Descreva o carro que você está procurando..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-secondary/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}

