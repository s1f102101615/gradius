import { roomsRepository } from '$/repository/roomsRepository';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user }) => ({ status: 200, body: await roomsRepository.findRoom(user.id) }),
  post: async ({ user }) => ({ status: 201, body: await roomUsecase.create(user.id) }),
}));
