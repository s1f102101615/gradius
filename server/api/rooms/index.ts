import type { RoomModel } from '$/commonTypesWithClient/models';

export type Methods = {
  get: {
    resBody: RoomModel;
  };
  post: {
    resBody: RoomModel;
    reqBody: { status: RoomModel['status']; nowtime: RoomModel['nowtime'] };
  };
};
