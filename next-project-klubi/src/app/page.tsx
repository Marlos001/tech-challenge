'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';
import { CarAIIllustration } from '@/components/ui/CarAIIllustration';
import { 
  MessageCircle, 
  Zap, 
  Brain,
  Code,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Cpu,
  Globe,
  Lock,
  Car,
  Search,
  Bot
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'IA Conversacional',
    description: 'Processamento de linguagem natural que entende intenções complexas e contexto do usuário',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Zap,
    title: 'Busca Instantânea',
    description: 'Algoritmos otimizados que retornam resultados relevantes em milissegundos',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Code,
    title: 'API Simples',
    description: 'Integração fácil com apenas algumas linhas de código em qualquer aplicação',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Cpu,
    title: 'Processamento Inteligente',
    description: 'Machine learning que aprende com interações e melhora recomendações',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
];

const capabilities = [
  'Busca semântica avançada',
  'Filtros dinâmicos inteligentes',
  'Recomendações personalizadas',
  'Análise de preferências do usuário',
  'Suporte a múltiplos idiomas',
  'Integração com APIs externas',
];


export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-mesh">
      <Header />
      
      {/* Ultra-Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-16">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-20 max-w-7xl mx-auto">
            {/* Left Content */}
            <div className="flex-1 text-left max-w-3xl lg:max-w-2xl">
              <div className="animate-fade-in">
                <Badge 
                  variant="glass" 
                  size="lg" 
                  className="mb-4 sm:mb-6 lg:mb-8 animate-bounce-soft glass-ultra shadow-soft border-white/40"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse-soft" />
                  <span className="text-xs sm:text-sm">AI-Powered Search Engine</span>
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-6 sm:mb-8 animate-slide-up gradient-text leading-[0.9] tracking-tight">
                CarFinder
                <span className="block text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mt-2 sm:mt-4 font-light">AI</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-700 mb-8 sm:mb-12 animate-slide-up leading-relaxed font-light max-w-2xl">
                Transforme qualquer busca em uma conversa inteligente
              </p>
              
              <div className="animate-slide-up">
                <Button 
                  asChild 
                  size="xl" 
                  variant="gradient" 
                  className="flex flex-row items-center gap-2 sm:gap-3 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-glow-primary"
                >
                  <Link href="/chat" className="flex flex-row items-center gap-2 sm:gap-3">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                    <span>Experimentar Demo</span>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Ultra Modern Glass Card */}
            <div className="flex-1 max-w-2xl w-full">
              <div className="relative">
                {/* Main Glass Card */}
                <div className="glass-card rounded-3xl p-8 relative overflow-hidden shadow-2xl hover-lift">
                  <div className="relative z-10">
                    {/* AI Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative">
                        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                          <Bot className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">CarFinder AI</h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                          Assistente Online
                        </p>
                      </div>
                    </div>
                    
                    {/* Chat Preview */}
                    <div className="space-y-6">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-xs">
                          <div className="gradient-primary rounded-2xl rounded-br-md p-4 shadow-lg">
                            <p className="text-white font-medium">
                              "Quero um SUV elétrico familiar até R$ 120k em São Paulo"
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Response */}
                      <div className="flex justify-start">
                        <div className="max-w-sm">
                          <div className="glass-subtle rounded-2xl rounded-bl-md p-4 shadow-lg">
                            <p className="text-gray-800 font-medium mb-3">
                              "Perfeito! Encontrei 3 opções que combinam com você:"
                            </p>
                            
                            {/* Mini Car Cards */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white/80 rounded-xl p-2 text-center">
                                <Car className="h-4 w-4 text-primary mx-auto mb-1" />
                                <p className="text-xs font-medium">BYD</p>
                                <p className="text-xs text-gray-600">R$ 115k</p>
                              </div>
                              <div className="bg-white/80 rounded-xl p-2 text-center">
                                <Car className="h-4 w-4 text-primary mx-auto mb-1" />
                                <p className="text-xs font-medium">Tesla</p>
                                <p className="text-xs text-gray-600">R$ 119k</p>
                              </div>
                              <div className="bg-white/80 rounded-xl p-2 text-center">
                                <Car className="h-4 w-4 text-primary mx-auto mb-1" />
                                <p className="text-xs font-medium">VW</p>
                                <p className="text-xs text-gray-600">R$ 110k</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Background Illustration */}
                  <div className="absolute bottom-0 right-0 w-80 h-60 opacity-20 overflow-hidden">
                    <CarAIIllustration />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-6 right-6 w-3 h-3 bg-primary rounded-full animate-float" />
                  <div className="absolute bottom-20 left-6 w-2 h-2 bg-secondary rounded-full animate-float delay-1000" />
                  <div className="absolute top-1/2 right-8 w-2 h-2 bg-accent rounded-full animate-float delay-500" />
                </div>
                
                {/* Floating Secondary Cards */}
                <div className="absolute -top-4 -left-4 glass-ultra rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-800">Busca Inteligente</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 glass-ultra rounded-2xl p-4 shadow-xl animate-float delay-1000">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary" />
                    <span className="text-sm font-semibold text-gray-800">IA Conversacional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ultra Modern Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent/5 via-primary/5 to-secondary/5 rounded-full blur-3xl opacity-30" />
        </div>
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--primary) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </section>

      {/* What is CarFinder Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
                O que é o CarFinder?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                O CarFinder é uma engine de busca conversacional powered by AI que pode ser integrada 
                em qualquer aplicação. Nossa demonstração usa o domínio de carros, mas a tecnologia 
                pode ser adaptada para qualquer tipo de produto ou serviço.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {capabilities.map((capability, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <Card variant="glass" className="p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6">
                    <MessageCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Interface Conversacional
                  </h3>
                  <p className="text-gray-600 mb-6">
                    "Quero um SUV elétrico para família em São Paulo, até R$ 120.000"
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 text-left">
                    <p className="text-sm text-gray-600 mb-2">🤖 CarFinder AI:</p>
                    <p className="text-gray-800">
                      Encontrei 3 opções perfeitas! O BYD Dolphin atende seus critérios...
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
              Tecnologia & Recursos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engine construída com as mais avançadas tecnologias de IA e processamento de linguagem natural
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                variant="default" 
                className="group hover:scale-105 transition-all duration-300 animate-slide-up border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
                Fácil Integração
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Integre nossa engine de busca conversacional em sua aplicação com apenas algumas linhas de código. 
                Suporte para REST API, SDKs e webhooks.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">API RESTful completa</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">SDKs para múltiplas linguagens</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">Segurança enterprise-grade</span>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-up">
              <Card variant="default" className="p-6 bg-gray-50 border border-gray-200">
                <div className="text-sm">
                  <div className="text-gray-500 mb-2">// Exemplo de integração</div>
                  <div className="font-mono text-gray-800">
                    <div className="text-blue-600">import</div> {'{CarFinderAI}'} <div className="text-blue-600">from</div> <div className="text-green-600">'@carfinder/sdk'</div>
                    <br /><br />
                    <div className="text-blue-600">const</div> <div className="text-purple-600">ai</div> = <div className="text-blue-600">new</div> <div className="text-yellow-600">CarFinderAI</div>({'{'}
                    <br />
                    &nbsp;&nbsp;apiKey: <div className="text-green-600">'your-api-key'</div>
                    <br />
                    {'}'})
                    <br /><br />
                    <div className="text-blue-600">const</div> <div className="text-purple-600">results</div> = <div className="text-blue-600">await</div> <div className="text-purple-600">ai</div>.<div className="text-yellow-600">search</div>(<br />
                    &nbsp;&nbsp;<div className="text-green-600">'SUV elétrico até R$ 100k'</div>
                    <br />
                    )
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up text-gradient">
              Pronto para Testar?
            </h2>
            <p className="text-xl text-gray-600 mb-10 animate-slide-up leading-relaxed">
              Experimente nossa demonstração prática e veja como a IA conversacional 
              pode revolucionar a experiência de busca na sua aplicação.
            </p>
            
            <div className="animate-slide-up">
              <Button asChild size="xl" variant="gradient">
                <Link href="/chat" className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  <span>Testar Demo Interativa</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">CarFinder</span>
            </div>
            <p className="text-gray-500 mb-6">
              Engine de busca conversacional powered by AI
            </p>
            <div className="flex justify-center space-x-8 text-gray-400 text-sm">
              <Link href="/docs" className="hover:text-primary transition-colors duration-200">
                Documentação
              </Link>
              <Link href="/api" className="hover:text-primary transition-colors duration-200">
                API Reference
              </Link>
              <Link href="/pricing" className="hover:text-primary transition-colors duration-200">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}