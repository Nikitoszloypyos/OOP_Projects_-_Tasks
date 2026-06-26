import type { Clock, IdGenerator } from '../../../../shared/application/ports';
import { Comment } from '../../domain/entities';
import type { AddCommentRequestDTO, AddCommentResponseDTO } from '../dto';
import type { CommentRepository, TaskAccessPort } from '../ports';
import { commentToDto } from './commentToDto';

export class AddCommentUseCase {
      constructor(
            private readonly commentRepository: CommentRepository,
            private readonly taskAccess: TaskAccessPort,
            private readonly idGenerator: IdGenerator,
            private readonly clock: Clock
      ) {}

      async execute(input: AddCommentRequestDTO): Promise<AddCommentResponseDTO> {
            await this.taskAccess.ensureTaskExists(input.taskId);
            await this.taskAccess.ensureUserCanAccessTask(input.taskId, input.actorId);

            const comment = Comment.create({
                  id: this.idGenerator.generate(),
                  taskId: input.taskId,
                  authorId: input.actorId,
                  text: input.text,
                  createdAt: this.clock.now()
            });

            await this.commentRepository.save(comment);

            return {
                  comment: commentToDto(comment)
            };
      }
}
