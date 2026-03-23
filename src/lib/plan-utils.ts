export const FEATURE_LABELS = {
  // Rankins e Social
  RANKING_GENERAL: 'Ranking geral',
  RANKING_VIP: 'Selos e Ranking VIP',
  COMMUNITY_PHRASES: 'Frases da comunidade',
  
  // Atividades
  QUIZ_BASIC: 'Quizzes básicos',
  QUIZ_EXCLU: 'Quizzes exclusivos',
  QUIZ_UNLIMITED: 'Quizzes ilimitados',
  CHALLENGE_2: '2 Desafios mensais',
  CHALLENGE_EXCLU: 'Desafios exclusivos',
  CHALLENGE_UNLIMITED: 'Desafios ilimitados',
  
  // Conteúdo
  CRON_LIVRO: 'Cronograma e livro do mês',
  LIBRARY_BASIC: 'Biblioteca básica',
  LIBRARY_EXPANDED: 'Biblioteca expandida',
  LIBRARY_DIGITAL: 'Biblioteca Digital',
  
  // Interatividade e Suporte
  ROOM_JOIN: 'Participar de salas',
  REUNIOES: 'Reuniões semanais',
  AUTHOR_ROOM: 'Sala do Autor (Escrita)',
  CHAT_ADMIN: 'Chat com Admin',
  AWARDS_EXCLU: 'Premiações exclusivas',
  ANNUAL_CERT: 'Certificado Anual',
} as const;

export type SystemFeature = keyof typeof FEATURE_LABELS;

export const SYSTEM_FEATURES = Object.entries(FEATURE_LABELS).map(([key, label]) => ({
  key: key as SystemFeature,
  label
}));

export function hasFeature(userPlan: any, feature: SystemFeature, isAdmin: boolean = false): boolean {
  // Admin sempre tem todas as permissões
  if (isAdmin) return true;
  
  // Se não tem plano, não tem permissões (exceto talvez básicas, mas o sistema assume que plano define acesso)
  if (!userPlan || !userPlan.features) return false;
  
  // Verifica se o array de features do plano contém a chave solicitada
  return userPlan.features.includes(feature);
}
