export const makeTitle = (str: string) => {
  const page = str.split('/').pop();
  if (!page) return { title: 'Home | PsitTools' };

  const title =
    page.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase()) +
    ' | PsitTools';
  return { title };
};
