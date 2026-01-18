import { User } from "../../../domain/user/entities/User";
import type { UseRepository } from "../../../domain/user/repositories/UserRepository";

export class UserRegister {
  constructor(private useRepo: UseRepository) {}

  async execute() {
    const user = new User("Caio Ferreira", new Date(), "cs1919328@gmail.com", "77981468313", "VDC", "teste");
    return await this.useRepo.create(user);
  }
}