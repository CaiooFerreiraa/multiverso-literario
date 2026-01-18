import { User } from "../../domain/user/entities/User";
import type { UseRepository } from "../../domain/user/repositories/UserRepository";

export class UserDatabase implements UseRepository {
  constructor(private database: any) {}
  
  async create(user: User): Promise<User> {
    try {
      const id_user = await this.#insertInUser(user);
      await this.#insertInMember(id_user, user);

      return user;
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async #insertInUser(user: User): Promise<number> {
    try {
      const [{ id_user }] = await this.database<
        { id_user: number }[]
      >`
        INSERT INTO users (fullname, email, password)
        VALUES (${user.fullName}, ${user.email}, ${user.password})
        RETURNING id_user;
      `
      return id_user;
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async #insertInMember(id_user: number, user: User) {
    try {
      await this.database`
        INSERT INTO member (id_user, birthday, "phoneNumber", city) VALUES (
          ${id_user}, ${user.birthday}, ${user.phoneNumber}, ${user.city}
        )
      `
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async read(idUser: number): Promise<User> {
    throw new Error("Method not implemented.");
  }

  update(idOldUser: number, newUser: User): Promise<User> {
    throw new Error("Method not implemented.");
  }

  delete(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  
}