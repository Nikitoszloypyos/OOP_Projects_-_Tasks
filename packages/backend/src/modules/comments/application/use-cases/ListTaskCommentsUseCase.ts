import type { ListTaskCommentsRequestDTO, ListTaskCommentsResponseDTO } from '../dto';
import type { CommentRepository, TaskAccessPort } from '../ports';
import { commentToDto } from './commentToDto';

export class ListTaskCommentsUseCase {
      constructor(
            private readonly commentRepository: CommentRepository,
            private readonly taskAccess: TaskAccessPort
      ) {}

      async execute(input: ListTaskCommentsRequestDTO): Promise<ListTaskCommentsResponseDTO> {
            await this.taskAccess.ensureTaskExists(input.taskId);
            await this.taskAccess.ensureUserCanAccessTask(input.taskId, input.actorId);

            const comments = await this.commentRepository.listByTaskId(input.taskId);

            return {
                  comments: comments.map(commentToDto)
            };
      }
}
