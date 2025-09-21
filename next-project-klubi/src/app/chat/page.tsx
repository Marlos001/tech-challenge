'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/Button';
import { ChatMessage as ChatMessageType, Car } from '@/types/car';
import { 
  MessageCircle, 
  Trash2
} from 'lucide-react';

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


export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLastAssistant = () => {
    lastAssistantMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    // Only scroll to bottom for user messages and typing
    if (isTyping) {
      scrollToBottom();
    }
  }, [isTyping]);

  useEffect(() => {
    // When a new assistant message is added, scroll to its top
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setTimeout(() => scrollToLastAssistant(), 100);
    }
  }, [messages]);

  const callChatApi = async (text: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<{ response: string; cars: Car[] }> => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history }),
    });
    if (!res.ok) {
      return {
        response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Pode tentar novamente?',
        cars: [],
      };
    }
    const data = await res.json();
    return {
      response: data.message ?? 'Aqui estão algumas opções que selecionei para você.',
      cars: (data.cars as Car[]) ?? [],
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

    // Call chat API
    let response = '';
    let matchedCars: Car[] = [];
    try {
      const historyPayload = (isFirstMessage ? [] : messages).slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const result = await callChatApi(content, historyPayload);
      response = result.response;
      matchedCars = result.cars;
    } catch {
      response = 'Tive um problema para buscar agora. Pode repetir sua mensagem?';
      matchedCars = [];
    }
    setIsTyping(false);

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
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-6xl">
          <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Ultra-Modern Chat Header - Mobile Responsive */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 animate-fade-in shadow-lifted">
              <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-6 text-center sm:text-left">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
                      <MessageCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-3 sm:border-4 border-white animate-pulse shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black gradient-text">CarFinder AI</h1>
                    <p className="text-gray-600 flex items-center gap-2 sm:gap-3 text-sm sm:text-lg justify-center sm:justify-start">
                      <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-sm"></span>
                      <span className="hidden sm:inline">Assistente Inteligente Online</span>
                      <span className="sm:hidden">Online</span>
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="glass"
                  onClick={clearChat}
                  className="hover-lift rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 flex items-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Novo Chat</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Ultra-Modern Chat Container - Mobile Responsive */}
            <div className="glass-card rounded-2xl sm:rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              {/* Welcome State - Mobile Responsive */}
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                  <div className="text-center animate-slide-up max-w-sm sm:max-w-lg">
                    <div className="relative inline-block mb-6 sm:mb-8">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-soft">
                        <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-secondary to-accent rounded-full animate-float" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                      Olá! Sou o CarFinder AI 👋
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 mx-auto leading-relaxed px-2">
                      Estou aqui para ajudar você a encontrar o carro perfeito. 
                      <br className="hidden sm:block" />
                      <span className="font-medium">O que você está procurando?</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Chat Messages - Mobile Responsive */
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'
                  }}
                >
                  {messages.map((message, index) => (
                    <div key={message.id} ref={index === messages.length - 1 && message.role === 'assistant' ? lastAssistantMessageRef : null}>
                      <ChatMessage message={message} />
                    </div>
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

              {/* Ultra-Modern Chat Input - Mobile Responsive */}
              <div className="p-3 sm:p-6 lg:p-8 border-t border-white/20 bg-white/50 backdrop-blur-sm">
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

