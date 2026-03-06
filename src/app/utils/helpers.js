const COLORS = {
  primary: '#387F40',
  secondary: '#FACB48',
  text: '#959BA9',
  accent: '#61CE70',
  thirdary: '#D8322D',
  danger: '#DB282F',
  info: '#23A455',
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

export const getStatusIcon = (status) => {
  return status;
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'Active': return 'bg-green-100 text-green-800 border-green-300';
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Expired': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800';
  }

};
export { COLORS, generateId, formatDate, checkExpiringSoon };