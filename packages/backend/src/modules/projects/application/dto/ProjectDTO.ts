export interface ProjectDTO {
      id: string;
      ownerId: string;
      name: string;
      description: string | null;
      isArchived: boolean;
      createdAt: string;
      updatedAt: string;
}
