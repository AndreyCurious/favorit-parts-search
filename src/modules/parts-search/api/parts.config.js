export const PARTS_API_URL = 'https://api.favorit-parts.ru/hs/hsprice/';

// Public example key supplied in the API documentation
export const PARTS_API_KEY =
  import.meta.env.VITE_FAVORIT_API_KEY?.trim() || '00000000-0000-0000-0000-000000000001';
