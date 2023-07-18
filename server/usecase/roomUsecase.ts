import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomsRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import { randomUUID } from 'crypto';

export const roomUsecase = {
  pause: async (
    user: RoomModel['userId'],
    status: RoomModel['status'],
    nowtime: RoomModel['nowtime'],
    myposition: RoomModel['myposition'],
    bullet: RoomModel['bullet'],
    enemy: RoomModel['enemy']
  ) => {
    const newRoom: RoomModel = {
      id: roomIdParser.parse(randomUUID()),
      userId: user,
      status,
      scenario: ['2', '0', '2', '0', '2', '0', '2', '0', '2', '0', '6', '0'],
      nowtime,
      myposition,
      bullet,
      enemy,
    };
    await roomsRepository.save(newRoom);

    return newRoom;
  },
};
