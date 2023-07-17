import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomsRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const roomUsecase = {
  create: async (user: RoomModel['userId']) => {
    const newRoom: RoomModel = {
      id: roomIdParser.parse(randomUUID()),
      userId: user,
      status: 'unstarted',
      scenario: ['30', 'god', '40', 'tec', '50', 'drag'],
    };
    await roomsRepository.save(newRoom);

    return newRoom;
  },
};
