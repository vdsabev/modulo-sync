// local://./posts/:postId/content.md
// firebase://postContent/:postId
//
// local://./posts/:postId/!(content.md)
// gcs://posts/:postId

export const parse = (value: string): Store => {
  const [type, path] = value.split('://');
  return { type: <StoreType>type, path };
};
