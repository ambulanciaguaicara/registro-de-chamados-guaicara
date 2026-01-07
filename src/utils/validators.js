export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.toString().trim() !== '';
}
