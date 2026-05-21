'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Contact, PipelineStage, LeadStatus } from '@/types';
import { getContacts, updateContactStage } from '@/lib/storage';

const stages: PipelineStage[] = ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Fechado'];

const stageColors: Record<PipelineStage, string> = {
  'Prospecção': 'border-zinc-600',
  'Qualificação': 'border-blue-600',
  'Proposta': 'border-yellow-600',
  'Negociação': 'border-orange-600',
  'Fechado': 'border-green-600',
};

const stageBg: Record<PipelineStage, string> = {
  'Prospecção': 'bg-zinc-800/30',
  'Qualificação': 'bg-blue-900/10',
  'Proposta': 'bg-yellow-900/10',
  'Negociação': 'bg-orange-900/10',
  'Fechado': 'bg-green-900/10',
};

const stageHeaderBg: Record<PipelineStage, string> = {
  'Prospecção': 'bg-zinc-700/50 text-zinc-300',
  'Qualificação': 'bg-blue-900/40 text-blue-300',
  'Proposta': 'bg-yellow-900/40 text-yellow-300',
  'Negociação': 'bg-orange-900/40 text-orange-300',
  'Fechado': 'bg-green-900/40 text-green-300',
};

const statusDot: Record<LeadStatus, string> = {
  Frio: 'bg-blue-400',
  Morno: 'bg-amber-400',
  Quente: 'bg-red-400',
};

export default function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<PipelineStage | null>(null);
  const dragId = useRef<string | null>(null);

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  function handleDragStart(id: string) {
    setDragging(id);
    dragId.current = id;
  }

  function handleDragEnd() {
    setDragging(null);
    setDragOver(null);
    dragId.current = null;
  }

  function handleDrop(stage: PipelineStage) {
    const id = dragId.current;
    if (!id) return;
    const updated = updateContactStage(id, stage);
    setContacts(updated);
    setDragging(null);
    setDragOver(null);
  }

  const byStage = (stage: PipelineStage) =>
    contacts.filter((c) => c.stage === stage);

  const totalValue = contacts.filter((c) => c.stage !== 'Fechado').length;

  return (
    <div className="p-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Pipeline de Vendas</h1>
        <p className="text-zinc-400 text-sm">{totalValue} oportunidades ativas · Arraste os cards para mover entre etapas</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {stages.map((stage) => {
          const cards = byStage(stage);
          const isDragTarget = dragOver === stage;

          return (
            <div
              key={stage}
              className={`flex-shrink-0 w-64 flex flex-col rounded-xl border-t-2 ${stageColors[stage]} ${stageBg[stage]} transition-colors ${
                isDragTarget ? 'ring-2 ring-indigo-500/50' : ''
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(stage); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => handleDrop(stage)}
            >
              {/* Column Header */}
              <div className={`px-4 py-3 rounded-t-lg ${stageHeaderBg[stage]}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider">{stage}</span>
                  <span className="text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                    {cards.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {cards.length === 0 && (
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center text-zinc-600 text-xs transition-colors ${
                    isDragTarget ? 'border-indigo-500/50 text-indigo-500/50' : 'border-zinc-800'
                  }`}>
                    {isDragTarget ? 'Soltar aqui' : 'Nenhum contato'}
                  </div>
                )}
                {cards.map((contact) => (
                  <div
                    key={contact.id}
                    draggable
                    onDragStart={() => handleDragStart(contact.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
                      dragging === contact.id ? 'opacity-40 scale-95' : 'hover:border-zinc-700 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-100 leading-tight">{contact.name}</p>
                          <p className="text-xs text-zinc-500">{contact.company}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[contact.status]}`} />
                        <span className="text-xs text-zinc-500">{contact.status}</span>
                      </div>
                      <Link
                        href={`/contatos/${contact.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Ver →
                      </Link>
                    </div>

                    {contact.interactions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-800">
                        <p className="text-xs text-zinc-600 line-clamp-2">
                          {contact.interactions[contact.interactions.length - 1].note}
                        </p>
                        <p className="text-xs text-zinc-700 mt-1">
                          {contact.interactions.length} interaç{contact.interactions.length === 1 ? 'ão' : 'ões'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
