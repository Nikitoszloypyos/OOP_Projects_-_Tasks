import { FastifyPluginAsync } from 'fastify';
import { getOwnerId } from './getOwnerId';
import { AppValidationError } from '../../../domain/errors';

export const timeEntryRoutes: FastifyPluginAsync = async (app) => {
      app.post(
          '/',
          {
                schema: {
                      body: {
                            type: 'object',
                            properties: {
                                  habitId: { type: 'string' },
                                  date: { type: 'string' }, // YYYY-MM-DD
                                  durationMinutes: { type: 'number' },
                                  source: { type: 'string' }
                            },
                            required: ['habitId', 'date', 'durationMinutes'],
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
                      habitId: string;
                      date: string;
                      durationMinutes: number;
                      source?: string;
                };

                const entry = await app.ctx.addTimeEntryUseCase.execute({
                      ownerId,
                      habitId: body.habitId,
                      date: body.date,
                      durationMinutes: body.durationMinutes,
                      source: body.source
                });

                reply.status(201).send(entry);
          }
      );

      app.get(
          '/',
          {
                schema: {
                      querystring: {
                            type: 'object',
                            properties: {
                                  from: { type: 'string' },
                                  to: { type: 'string' }
                            },
                            required: ['from', 'to'],
                            additionalProperties: false
                      }
                }
          },
          async (request, reply) => {
                const ownerId = getOwnerId(request);
                if (!ownerId) {
                      throw new AppValidationError('ownerId is required', 'ownerId');
                }

                const query = request.query as { from: string; to: string };

                const entries =
                    await app.ctx.listTimeEntriesForPeriodUseCase.execute({
                          ownerId,
                          from: query.from,
                          to: query.to
                    });

                reply.send(entries);
          }
      );
};
