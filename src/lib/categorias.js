export const CATEGORIAS = {
  entrada: [
    { value: 'Rendimento', emoji: '💰' },
    { value: 'Prenda', emoji: '🎁' },
    { value: 'Trabalho', emoji: '💼' },
    { value: 'Freelance', emoji: '💻' },
    { value: 'Investimento', emoji: '📈' },
    { value: 'Outros', emoji: '📦' },
  ],
  saida: [
    { value: 'Compras', emoji: '🛍️' },
    { value: 'Alimentação', emoji: '🍕' },
    { value: 'Entretenimento', emoji: '🎮' },
    { value: 'Saúde', emoji: '🏥' },
    { value: 'Educação', emoji: '📚' },
    { value: 'Viagem', emoji: '✈️' },
    { value: 'Casa', emoji: '🏠' },
    { value: 'Transporte', emoji: '🚗' },
    { value: 'Tecnologia', emoji: '📱' },
    { value: 'Outros', emoji: '📦' },
  ],
};

export const getCategoriaEmoji = (categoria) => {
  const all = [...CATEGORIAS.entrada, ...CATEGORIAS.saida];
  return all.find(c => c.value === categoria)?.emoji ?? '📦';
};
