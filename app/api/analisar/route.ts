import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { name, company, status, stage, interactions } = await req.json();

    if (!interactions || !name) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const historyText = interactions
      .map((i: { date: string; type: string; note: string }) =>
        `[${new Date(i.date).toLocaleDateString('pt-BR')}] (${i.type.toUpperCase()}) ${i.note}`
      )
      .join('\n');

    const prompt = `Você é um assistente especialista em vendas B2B. Analise o histórico de interações com este lead e forneça um resumo objetivo e uma sugestão de próxima ação.

DADOS DO CONTATO:
- Nome: ${name}
- Empresa: ${company}
- Status do Lead: ${status}
- Etapa do Pipeline: ${stage}

HISTÓRICO DE INTERAÇÕES:
${historyText || 'Sem interações registradas.'}

Responda APENAS com um JSON válido no seguinte formato (sem markdown, sem texto extra):
{
  "summary": "resumo conciso do histórico em 2-3 frases, destacando pontos-chave do relacionamento",
  "nextAction": "sugestão específica e acionável da próxima melhor ação para avançar este negócio"
}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta inválida da IA');

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('AI Error:', err);
    return NextResponse.json({ error: 'Erro ao processar análise' }, { status: 500 });
  }
}
