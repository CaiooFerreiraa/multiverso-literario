import { User } from "../../../domain/user/entities/User";
import type { UseRepository } from "../../../domain/user/repositories/UserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class UserRegister {
  constructor(private useRepo: UseRepository) {}

  async execute(data: CreateUserDTO) {
    if (this.#validateEmail(data.email)) throw new Error("Formato de email inválido!!");

    const user = new User(data);
    return await this.useRepo.create(user);
  }

  #validateEmail(email: string) {
    return !email.includes("@");
  }
}