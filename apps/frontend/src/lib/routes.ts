export function encodeRepoPath(repoPath: string): string {
  return repoPath.replace(/\//g, '__');
}

export function decodeRepoParam(repoParam: string): string {
  return repoParam.replace(/__/g, '/');
}
