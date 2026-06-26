export interface ProjectsPublicApi {
      ensureProjectExists(projectId: string): Promise<void>;
      ensureUserIsProjectMember(projectId: string, userId: string): Promise<void>;
}
