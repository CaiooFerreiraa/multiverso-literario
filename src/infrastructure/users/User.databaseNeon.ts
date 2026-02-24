import { User } from "../../domain/users/entities/User";
import type { UseRepository } from "../../domain/users/repositories/UserRepository";
import { Database } from "../database/neon";

export class UserNeonDatabase implements UseRepository {
  constructor(private database: Database) { }

  async create(user: User): Promise<User> {
    try {
      const id_user = await this.insertInUser(user);
      await this.insertInMember(id_user, user);
      return user;
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertInUser(user: User): Promise<number> {
    try {
      const [result] = await this.database.query(
        `INSERT INTO users (fullname, email, password)
         VALUES ($1, $2, $3)
         RETURNING id_user;`,
        [user.fullName, user.email, user.password]
      );
      return result.id_user;
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async insertInMember(id_user: number, user: User) {
    try {
      await this.database.query(
        `INSERT INTO member (id_user, birthday, "phoneNumber", city) VALUES (
          $1, $2, $3, $4
        )`,
        [id_user, user.birthday, user.phoneNumber, user.city]
      );
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async read(email: string): Promise<any> {
    try {
      const user = await this.database.query(
        `SELECT a.fullname, a.email, a.password, b.birthday, b.city, b."phoneNumber" 
         FROM users a
         JOIN member b ON a.id_user = b.id_user
         WHERE a.email = $1`,
        [email]
      );
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async update(idOldUser: number, newUser: User): Promise<User> {
    try {
      await this.updateInUsers(idOldUser, newUser);
      return newUser;
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async updateInUsers(idOldUser: number, user: User) {
    try {
      await this.database.query(
        `UPDATE users
         SET fullname = $1, email = $2, password = $3
         WHERE id_user = $4;`,
        [user.fullName, user.email, user.password, idOldUser]
      );
      await this.updateInMember(idOldUser, user);
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  private async updateInMember(idOldUser: number, user: User) {
    try {
      await this.database.query(
        `UPDATE member
         SET birthday = $1, "phoneNumber" = $2, city = $3
         WHERE id_user = $4;`,
        [user.birthday, user.phoneNumber, user.city, idOldUser]
      );
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async delete(idUser: number): Promise<any> {
    try {
      await this.database.query(
        `DELETE FROM users
         WHERE id_user = $1`,
        [idUser]
      );
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

}