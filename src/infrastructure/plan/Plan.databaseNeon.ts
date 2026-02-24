import { Plan } from "../../domain/plan/entities/Plan";
import { PlanUser } from "../../domain/plan/entities/PlanUser";
import { PlanRepository } from "../../domain/plan/repository/PlanRepository";
import { Database } from "../database/neon";

export class PlanDatabaseNeon implements PlanRepository {
    constructor(private database: Database) { };

    async create(plan: Plan): Promise<any> {
        try {
            await this.database.query(
                `INSERT INTO plan_expanded (value, duraction) VALUES ($1, $2)`,
                [plan.value, plan.duraction]
            );
        } catch (error) {
            throw error;
        }
    }

    read(id_plan: number): Promise<any> {

    }

    readAll(): Promise<any> {

    }

    update(id_plan: number): Promise<any> {

    }

    delete(id_plan: number): Promise<any> {

    }


    contract(planUser: PlanUser): Promise<any> {

    }

    cancel(id_planUser: number): Promise<any> {

    }
}