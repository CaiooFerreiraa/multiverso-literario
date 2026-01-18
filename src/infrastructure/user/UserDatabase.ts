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

  async update(idOldUser: number, newUser: User): Promise<User> {
    try {
      await this.#updateInUsers(idOldUser, newUser)
      return newUser
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async #updateInUsers(idOldUser: number, user: User) {
    try {
      await this.database`
        UPDATE users
        SET fullname = ${user.fullName}, email = ${user.email}, password = ${user.password}
        WHERE id_user = ${idOldUser};
      `
      await this.#updateInMember(idOldUser, user)
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async #updateInMember(idOldUser: number, user: User) {
    try {
      await this.database`
        UPDATE member
        SET birthday = ${user.birthday}, "phoneNumber" = ${user.phoneNumber}, city = ${user.city}
        WHERE id_user = ${idOldUser}; 
      `
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  delete(user: User): Promise<User> {
    throw new Error("Method not implemented.");
  }
  
}