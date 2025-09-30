export const getSize = (id: string | undefined) => {
  switch (id) {
    case 'actions':
      return 'w-full';
    default:
      return '';
  }
};
