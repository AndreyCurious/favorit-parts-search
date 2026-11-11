export function getVendorError(error) {
  const description = typeof error === 'string' ? error : JSON.stringify(error);

  if (/quota/i.test(description)) {
    return 'Лимит запросов поставщика исчерпан. Попробуйте позже.';
  }

  if (/key/i.test(description)) {
    return 'API отклонил ключ доступа. Проверьте настройки подключения.';
  }

  return 'Поставщик вернул ошибку. Попробуйте позже.';
}
