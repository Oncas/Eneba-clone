export const KEY_TYPE_OPTIONS = [
  'Steam',
  'Epic Games',
  'Xbox Live',
  'PlayStation',
  'Nintendo',
  'GOG',
  'Origin',
  'Uplay',
  'Battle.net',
  'Other',
] as const;

export type KeyType = (typeof KEY_TYPE_OPTIONS)[number];
