import type { RoomModel } from "$/commonTypesWithClient/models";
import { prismaClient } from "$/service/prismaClient";

// const toRoomModel = (prismaRoom: Room): RoomModel => ({ 
//   id: roomIdParser.parse(prismaRoom.roomId),
//   userId: UserIdParser.parse(prismaRoom.userId),
// });
export const roomsRepository = {
  save: async (room: RoomModel) => {
    await prismaClient.room.upsert({
      where: { roomId: room.id },
      update: {
        
      },
      create: {
        roomId: room.id,
        userId: room.userId,
      },
    });
  },};