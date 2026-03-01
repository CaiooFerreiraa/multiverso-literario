import type { User } from "../entities/User";

export interface UseRepository {
  create(user: User): Promise<User>;
  read(email: string): Promise<User>
  update(idOldUser: number, newUser: User): Promise<User>;
  delete(idUser: number): Promise<User>;
}
