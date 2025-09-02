export const mapEnumValues = <T extends string[] | readonly string[]>(
  enumValues: T,
): { [K in T[number]]: K } => {
  const obj = {} as { [K in T[number]]: K };
  enumValues.forEach((value: T[number]) => {
    obj[value.toLowerCase() as T[number]] = value;
  });
  return obj;
};
