import { UseRepository } from "../../../domain/users/repositories/UserRepository";
import { ReadUserDTO } from "../dtos/ReadUserDTO";

export class UserRead {
  constructor(private useRepo: UseRepository) {}

  async execute(data: ReadUserDTO) {
    const { email } = data;
    return await this.useRepo.read(email)
  }
}