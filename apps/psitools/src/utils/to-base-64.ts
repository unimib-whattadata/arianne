export function toBase64(file: File) {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        return resolve(null);
      }
      resolve(reader.result);
    };
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    reader.onerror = (error) => reject(error);
  });
}
