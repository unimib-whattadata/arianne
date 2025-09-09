export const getSize = (id: string | undefined) => {
  switch (id) {
    case 'checked':
      return 'w-12';
    case 'name':
      return 'w-20';
    case 'date':
      return 'w-28';
    case 'method':
      return 'grow-1';
    case 'open':
      return 'w-36';
    default:
      return 'grow-0';
  }
};
