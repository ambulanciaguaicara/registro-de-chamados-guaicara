export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}

export function validateForm(formData) {
  const errors = [];
  
  const requiredFields = {
    dataHora: 'Data e Hora',
    paciente: 'Paciente',
    endereco: 'Endereço',
    numero: 'Número',
    destino: 'Destino',
    motorista: 'Motorista',
    prioridade: 'Prioridade',
    finalidade: 'Finalidade',
    obito: 'Óbito',
    tipoChamado: 'Tipo de Chamado'
  };
  
  for (const [field, label] of Object.entries(requiredFields)) {
    if (!validateRequired(formData[field])) {
      errors.push(`${label} é obrigatório`);
    }
  }
  
  return errors;
}
