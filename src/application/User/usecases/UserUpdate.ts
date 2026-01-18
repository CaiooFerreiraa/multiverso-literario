import { User } from "../../../domain/user/entities/User";
import type { UseRepository } from "../../../domain/user/repositories/UserRepository";
import { UpdateUserDTO } from "../dtos/UpdateUserDTO";

export class UserUpdate {
  constructor(private useRepo: UseRepository) {}

  async execute(data: UpdateUserDTO) {
    const { id_user, ...useData } = data;
    const user = new User(useData);
    return await this.useRepo.update(id_user, user);
  }
}