import { FastifyPluginAsync } from 'fastify';
import { getOwnerId } from './getOwnerId';
import { AppValidationError } from '../../../domain/errors';

export const habitRoutes: FastifyPluginAsync = async (app) => {
      app.get(
          '/',
          {
                schema: {
                      querystring: {
                            type: 'object',
                            properties: {
                                  includeArchived: { type: 'string' }
                            },
                            additionalProperties: false
                      }
                }
          },
          async (request, reply) => {
                const ownerId = getOwnerId(request);
                if (!ownerId) {
                      throw new AppValidationError('ownerId is required', 'ownerId');
                }

                const query = request.query as { includeArchived?: string };
                const includeArchived = query.includeArchived === 'true';

                const habits = await app.ctx.listHabitsUseCase.execute({
                      ownerId,
                      includeArchived
                });

                reply.send(habits);
          }
      );

      app.post(
          '/',
          {
                schema: {
                      body: {
                            type: 'object',
                            properties: {
                                  name: { type: 'string' },
                                  color: { type: 'string' },
                                  orderIndex: { type: 'number' }
                            },
                            required: ['name'],
                            additionalProperties: false
                      }
                }
          },
          async (request, reply) => {
                const ownerId = getOwnerId(request);
                if (!ownerId) {
                      throw new AppValidationError('ownerId is required', 'ownerId');
                }

                const body = request.body as {
                      name: string;
                      color?: string;
                      orderIndex?: number;
                };

                const habit = await app.ctx.createHabitUseCase.execute({
                      ownerId,
                      name: body.name,
                      color: body.color,
                      orderIndex: body.orderIndex
                });

                reply.status(201).send(habit);
          }
      );

      app.patch(
          '/:id',
          {
                schema: {
                      params: {
                            type: 'object',
                            properties: {
                                  id: { type: 'string' }
                            },
                            required: ['id'],
                            additionalProperties: false
                      },
                      body: {
                            type: 'object',
                            properties: {
                                  newName: { type: 'string' }
                            },
                            required: ['newName'],
                            additionalProperties: false
                      }
                }
          },
          async (request, reply) => {
                const ownerId = getOwnerId(request);
                if (!ownerId) {
                      throw new AppValidationError('ownerId is required', 'ownerId');
                }

                const params = request.params as { id: string };
                const body = request.body as { newName: string };

                const habit = await app.ctx.renameHabitUseCase.execute({
                      ownerId,
                      habitId: params.id,
                      newName: body.newName
                });

                reply.send(habit);
          }
      );

      app.patch(
          '/:id/archive',
          {
                schema: {
                      params: {
                            type: 'object',
                            properties: {
                                  id: { type: 'string' }
                            },
                            required: ['id'],
                            additionalProperties: false
                      },
                      body: {
                            type: 'object',
                            properties: {
                                  archive: { type: 'boolean' }
                            },
                            required: ['archive'],
                            additionalProperties: false
                      }
                }
          },
          async (request, reply) => {
                const ownerId = getOwnerId(request);
                if (!ownerId) {
                      throw new AppValidationError('ownerId is required', 'ownerId');
                }

                const params = request.params as { id: string };
                const body = request.body as { archive: boolean };

                const habit = await app.ctx.archiveHabitUseCase.execute({
                      ownerId,
                      habitId: params.id,
                      archive: body.archive
                });

                reply.send(habit);
          }
      );
};
