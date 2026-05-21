export type LeadStatus = 'Frio' | 'Morno' | 'Quente';
export type PipelineStage = 'Prospecção' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado';
export type InteractionType = 'nota' | 'ligação' | 'email' | 'reunião';

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  note: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  status: LeadStatus;
  stage: PipelineStage;
  interactions: Interaction[];
  createdAt: string;
}
