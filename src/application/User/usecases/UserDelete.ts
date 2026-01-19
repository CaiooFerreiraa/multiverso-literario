import { UseRepository } from "../../../domain/user/repositories/UserRepository";
import { DeleteUserDTO } from "../dtos/DeleteUserDTO";

export class UserDelete {
  constructor(private useRepo: UseRepository ) {};

  async execute(data: DeleteUserDTO) {
    const { id_user } = data
    return await this.useRepo.delete(id_user);
  }

}