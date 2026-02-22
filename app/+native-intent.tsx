export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  if (path === '/') return '/(tabs)/(home)';
  return path;
}
