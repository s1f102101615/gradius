import type { RoomModel } from '$/commonTypesWithClient/models';
import { UserIdParser, roomIdParser } from '$/service/idParsers';
import { prismaClient } from '$/service/prismaClient';
import { randomUUID } from 'crypto';

// const toRoomModel = (prismaRoom: Room): RoomModel => ({
//   id: roomIdParser.parse(prismaRoom.roomId),
//   userId: UserIdParser.parse(prismaRoom.userId),
// });
export const roomsRepository = {
  save: async (room: RoomModel) => {
    await prismaClient.room.upsert({
      where: { userId: room.userId },
      update: {},
      create: {
        roomId: room.id,
        userId: room.userId,
        status: room.status,
        scenario: room.scenario,
      },
    });
  },

  //findRoomでroomをid取得する、roomがなければ作成するようにする
  findRoom: async (userId: string): Promise<RoomModel> => {
    const room = await prismaClient.room.findUnique({
      where: { userId },
    });
    if (room === null) {
      await prismaClient.room.create({
        data: {
          roomId: roomIdParser.parse(randomUUID()),
          userId,
          status: 'unstarted',
          scenario: ['20', 'dasdas'],
        },
      });
      return await roomsRepository.findRoom(userId);
    } else {
      return {
        id: roomIdParser.parse(room.roomId),
        userId: UserIdParser.parse(room.userId),
        status: room.status,
        scenario: room.scenario,
      };
    }
  },
};
