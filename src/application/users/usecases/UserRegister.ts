import { User } from "../../../domain/users/entities/User";
import type { UseRepository } from "../../../domain/users/repositories/UserRepository";
import { CreateUserDTO } from "../dtos/CreateUserDTO";

export class UserRegister {
  constructor(private useRepo: UseRepository) {}

  async execute(data: CreateUserDTO) {
    const user = new User(data);
    return await this.useRepo.create(user);
  }
}