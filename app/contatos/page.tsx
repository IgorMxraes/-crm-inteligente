'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contact, LeadStatus } from '@/types';
import { getContacts } from '@/lib/storage';

const statusColors: Record<LeadStatus, string> = {
  Frio: 'bg-blue-900/40 text-blue-300 border border-blue-800',
  Morno: 'bg-amber-900/40 text-amber-300 border border-amber-800',
  Quente: 'bg-red-900/40 text-red-300 border border-red-800',
};

const statusDot: Record<LeadStatus, string> = {
  Frio: 'bg-blue-400',
  Morno: 'bg-amber-400',
  Quente: 'bg-red-400',
};

export default function ContatosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'Todos'>('Todos');

  useEffect(() => {
    setContacts(getContacts());
  }, []);

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Todos' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    Frio: contacts.filter((c) => c.status === 'Frio').length,
    Morno: contacts.filter((c) => c.status === 'Morno').length,
    Quente: contacts.filter((c) => c.status === 'Quente').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Contatos</h1>
        <p className="text-zinc-400 text-sm">Gerencie seus leads e clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['Frio', 'Morno', 'Quente'] as LeadStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? 'Todos' : s)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterStatus === s
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${statusDot[s]}`} />
              <span className="text-zinc-400 text-xs font-medium">{s}</span>
            </div>
            <p className="text-2xl font-bold text-white">{statusCounts[s]}</p>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, empresa ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        {filterStatus !== 'Todos' && (
          <button
            onClick={() => setFilterStatus('Todos')}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-lg transition-colors"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nome</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Empresa</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Telefone</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden lg:table-cell">E-mail</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider hidden md:table-cell">Etapa</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                  Nenhum contato encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((contact) => (
                <tr key={contact.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {contact.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="text-sm font-medium text-zinc-100">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{contact.company}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 hidden md:table-cell">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-zinc-400 hidden lg:table-cell">{contact.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[contact.status]}`} />
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400 hidden md:table-cell">{contact.stage}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/contatos/${contact.id}`}
                      className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-600 text-right">
        {filtered.length} de {contacts.length} contatos
      </p>
    </div>
  );
}
