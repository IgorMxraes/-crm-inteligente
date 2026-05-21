// fix deploy
'use client';

import { useState, useEffect, use, type ReactElement } from 'react';
import Link from 'next/link';
import { Contact, InteractionType } from '@/types';
import { getContactById, addInteraction } from '@/lib/storage';

const interactionIcons: Record<InteractionType, ReactElement> = {
  nota: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  ligação: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  email: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  reunião: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const interactionColors: Record<InteractionType, string> = {
  nota: 'bg-zinc-700 text-zinc-300',
  ligação: 'bg-green-900/50 text-green-300',
  email: 'bg-blue-900/50 text-blue-300',
  reunião: 'bg-purple-900/50 text-purple-300',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [contact, setContact] = useState<Contact | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newType, setNewType] = useState<InteractionType>('nota');
  const [aiResult, setAiResult] = useState<{ summary: string; nextAction: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);

  useEffect(() => {
    const c = getContactById(id);
    setContact(c ?? null);
  }, [id]);

  function handleAddNote() {
    if (!newNote.trim() || !contact) return;
    const updated = addInteraction(contact.id, {
      date: new Date().toISOString(),
      type: newType,
      note: newNote.trim(),
    });
    const c = updated.find((x) => x.id === contact.id);
    if (c) setContact(c);
    setNewNote('');
  }

  async function handleAnalyzeAI() {
    if (!contact) return;
    setAiLoading(true);
    setAiError('');
    setShowAiPanel(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/analisar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          company: contact.company,
          status: contact.status,
          stage: contact.stage,
          interactions: contact.interactions,
        }),
      });
      if (!res.ok) throw new Error('Erro na API');
      const data = await res.json();
      setAiResult(data);
    } catch {
      setAiError('Erro ao conectar com a IA. Verifique a chave da API.');
    } finally {
      setAiLoading(false);
    }
  }

  if (!contact) {
    return (
      <div className="p-8 text-zinc-400">
        <Link href="/contatos" className="text-indigo-400 hover:text-indigo-300 text-sm mb-6 inline-block">
          ← Voltar
        </Link>
        <p>Contato não encontrado.</p>
      </div>
    );
  }

  const statusColors = {
    Frio: 'bg-blue-900/40 text-blue-300 border border-blue-800',
    Morno: 'bg-amber-900/40 text-amber-300 border border-amber-800',
    Quente: 'bg-red-900/40 text-red-300 border border-red-800',
  };

  const sortedInteractions = [...contact.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link href="/contatos" className="text-indigo-400 hover:text-indigo-300 text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar para Contatos
      </Link>

      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{contact.name}</h1>
              <p className="text-zinc-400 text-sm">{contact.company}</p>
            </div>
          </div>
          <button
            onClick={handleAnalyzeAI}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {aiLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analisando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analisar com IA
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Telefone</p>
            <p className="text-sm text-zinc-200">{contact.phone}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">E-mail</p>
            <p className="text-sm text-zinc-200">{contact.email}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Status</p>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
              {contact.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Etapa</p>
            <p className="text-sm text-zinc-200">{contact.stage}</p>
          </div>
        </div>
      </div>

      {/* AI Panel */}
      {showAiPanel && (
        <div className="bg-zinc-900 border border-indigo-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-indigo-300">Análise com IA</h2>
            </div>
            <button onClick={() => setShowAiPanel(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {aiLoading && (
            <div className="flex items-center gap-3 text-zinc-400 text-sm">
              <svg className="w-4 h-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analisando histórico do contato...
            </div>
          )}

          {aiError && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg p-3">
              {aiError}
            </div>
          )}

          {aiResult && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Resumo do Histórico</p>
                <p className="text-sm text-zinc-200 leading-relaxed">{aiResult.summary}</p>
              </div>
              <div className="border-t border-zinc-800 pt-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Sugestão de Próxima Ação</p>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-green-200 leading-relaxed">{aiResult.nextAction}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Interaction */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Adicionar Interação</h2>
        <div className="flex gap-3 mb-3">
          {(['nota', 'ligação', 'email', 'reunião'] as InteractionType[]).map((t) => (
            <button
              key={t}
              onClick={() => setNewType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                newType === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              <span className={`${interactionColors[t]} p-0.5 rounded`}>
                {interactionIcons[t]}
              </span>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Descreva a interação..."
            rows={3}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors self-end"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Interaction History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-5">
          Histórico de Interações
          <span className="ml-2 text-xs text-zinc-500 font-normal">({contact.interactions.length})</span>
        </h2>
        {sortedInteractions.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">Nenhuma interação registrada ainda.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-zinc-800" />
            <div className="space-y-5">
              {sortedInteractions.map((interaction) => (
                <div key={interaction.id} className="relative flex gap-4 pl-10">
                  <div className={`absolute left-0 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${interactionColors[interaction.type]}`}>
                    {interactionIcons[interaction.type]}
                  </div>
                  <div className="flex-1 bg-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${interactionColors[interaction.type]}`}>
                        {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                      </span>
                      <span className="text-xs text-zinc-500">{formatDate(interaction.date)}</span>
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed">{interaction.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
