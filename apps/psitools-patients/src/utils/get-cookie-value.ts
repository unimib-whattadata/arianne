'use client';

export const getCookieValue = (name: string) => {
  if (typeof window === 'undefined') return;
  const cookiesClient = document.cookie.split(';');
  const cookie = cookiesClient.find((cookie) => cookie.includes(name));
  const value = cookie?.split('=')[1];
  return value;
};
