import type { User } from "../entities/User";

export interface UseRepository {
  create(user: User): Promise<User>;
  read(idUser: number): Promise<User>
  update(idOldUser: number, newUser: User): Promise<User>;
  delete(user: User): Promise<User>;
}