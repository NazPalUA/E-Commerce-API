import { ObjectId } from 'mongodb';

export function toDTO<T extends { _id: ObjectId }>(entity: T) {
  const { _id, ...rest } = entity;
  return {
    id: _id.toString(),
    ...rest,
  };
}
