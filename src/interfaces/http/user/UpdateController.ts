import type { Request, Response } from "express";
import { UpdateUserDTO, UpdateUserSchema } from "../../../application/User/dtos/UpdateUserDTO";
import { UserUpdate } from "../../../application/User/usecases/UserUpdate";

export class UpdateController {
  constructor(private useCase: UserUpdate) {};

  execute = async (req: Request, res: Response) => {
    try {
      const useData: UpdateUserDTO = UpdateUserSchema.parse(req.body);
      const {password, ...user} = await this.useCase.execute(useData)
      res.status(200).json(user);
    } catch (error: unknown) {
      error = error instanceof Error ? error.message : String(error)
      console.log(error)
      res.status(400).json(error)
    }
  }
}