import type { User } from "../../domain/user/entities/User";
import type { UseRepository } from "../../domain/user/repositories/UserRepository";
import { database } from "../database/NeonClient";

export class UserDatabase implements UseRepository {
  async create(user: User): Promise<any> {
    throw new Error("Method not implemented.")
  }
  update(oldUser: User, newUser: User): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(user: User): Promise<any> {
    throw new Error("Method not implemented.");
  }
  
}