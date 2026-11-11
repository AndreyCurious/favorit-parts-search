const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

export const formatPrice = (value) => (value === null ? 'Цена не указана' : money.format(value));

export function getErrorMessage(error) {
  if (error?.status === 429) return 'Лимит запросов исчерпан. Попробуйте позже.';

  if (error?.status === 401 || error?.status === 403)
    return 'API отклонил доступ. Проверьте ключ подключения.';

  if (typeof error?.data?.error === 'string') return error.data.error;

  if (error?.status === 'TIMEOUT_ERROR') return 'Превышено время ожидания. Повторите запрос.';

  if (error?.status === 'FETCH_ERROR')
    return 'Не удалось подключиться. Проверьте интернет и повторите запрос.';

  return 'Не удалось получить данные. Повторите запрос позже.';
}
