export const trimAll = (o: Record<string, string>): Record<string, string> =>
  Object.entries(o).reduce(
    (r, [k, v]) => ({
      ...r,
      [k]: v.trim(),
    }),
    {},
  )
