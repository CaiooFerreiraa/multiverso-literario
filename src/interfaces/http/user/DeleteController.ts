import type { Request, Response } from "express";
import { DeleteUserDTO, DeleteUserSchema } from "../../../application/user/dtos/DeleteUserDTO";
import { UserDelete } from "../../../application/user/usecases/UserDelete";

export class DeleteController {
  constructor(private useCase: UserDelete) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: DeleteUserDTO = DeleteUserSchema.parse(req.body);
      const user = await this.useCase.execute(useData);
      res.status(200).json(user);
    } catch (error: unknown) {
      error = error instanceof Error ? error.message : String(error);
      console.log(error);
      res.status(400).json(error)
    }
  }
}