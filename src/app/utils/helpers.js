const COLORS = {
  primary: '#201C52',
  secondary: '#D08A00',
  text: '#002F6E',
  accent: '#8B745A',
  danger: '#DB282F',
  info: '#0076C0',
  success: '#009862',
  warning: '#FFDB00',
  bgLight: '#F9F9F9',
  bgWhite: '#FFFFFF',
  textDark: '#000000',
  textMedium: '#505050',
  border: '#B9B9B9'
};

const generateId = () => `ID-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

const checkExpiringSoon = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
};

export { COLORS, generateId, formatDate, checkExpiringSoon };