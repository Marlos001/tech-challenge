import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Inicializar o modelo OpenAI
    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    // Criar as mensagens para o chat
    const messages = [
      new SystemMessage(
        'Você é um assistente especializado em ajudar usuários a encontrar carros. ' +
        'Seja útil, amigável e forneça informações relevantes sobre veículos.'
      ),
      new HumanMessage(message),
    ];

    // Fazer a requisição para o OpenAI
    const response = await model.invoke(messages);

    return NextResponse.json({
      message: response.content,
      success: true,
    });

  } catch (error) {
    console.error('Erro na API de chat:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Chat funcionando!',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
