export interface UserLookupPort {
      ensureUserExists(userId: string): Promise<void>;
}
