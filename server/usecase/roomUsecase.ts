import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomsRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const roomUsecase = {
  pause: async (
    user: RoomModel['userId'],
    status: RoomModel['status'],
    nowtime: RoomModel['nowtime']
  ) => {
    const newRoom: RoomModel = {
      id: roomIdParser.parse(randomUUID()),
      userId: user,
      status,
      scenario: ['1', 's', '2', 's', '3', 'n', '4', 's', '5', 's', '6', 's'],
      nowtime,
    };
    await roomsRepository.save(newRoom);

    return newRoom;
  },
};
