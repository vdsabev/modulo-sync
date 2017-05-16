export const parse = (value: string): { source: Store, destination: Store } => {
  const [source, destination] = value.split(',').map((fullPath) => {
    const [type, path] = fullPath.split('://');
    return { type: <StoreType>type, path };
  });

  return { source, destination };
};
