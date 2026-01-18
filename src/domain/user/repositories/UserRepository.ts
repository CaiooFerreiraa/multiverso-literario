import type { User } from "../entities/User";

export interface UseRepository {
  create(user: User): Promise<any>;
  update(oldUser: User, newUser: User): Promise<any>;
  delete(user: User): Promise<any>;
}