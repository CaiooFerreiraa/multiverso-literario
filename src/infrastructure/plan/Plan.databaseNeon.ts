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

    async read(id_plan: number): Promise<any> {
        try {
           return await this.database.query(
                `SELECT * FROM plan_expanded WHERE id_plan = $1`,
                [id_plan]
            )
        } catch (error) {
            throw error;
        }
    }

    async readAll(): Promise<any> {
        try {
            return await this.database.query(
                'SELECT * plan_expanded'
            )
        } catch (error) {
            throw error;
        }
    }

    async update(id_plan: number, plan: Plan): Promise<any> {
        try {
            await this.database.query(`
                UPDATE plan_expanded
                SET value = $1, duraction = $2
                WHERE id_plan = $3    
            `, [plan.value, plan.duraction, id_plan]
            )
        } catch (error) {
            throw error;
        }
    }

    async delete(id_plan: number): Promise<any> {
        try {
            await this.database.query(`
                DELETE FROM plan_expanded
                WHERE id_plan = $1
            `, [id_plan])
        } catch (error) {
            throw error;
        }
    }


    async contract(planUser: PlanUser): Promise<any> {
        try {
            await this.database.query(`
                INSERT INTO buy (id_plan, id_user, price_paid, status, method_payment) VALUES (
                    $1, $2, $3, $4, $5 
                )
            `, [planUser.id_plan, planUser.id_user, planUser.price_paid, planUser.status, planUser.method_payment])
        } catch (error) {
            throw error;
        }
    }

    async cancel(id_planUser: number): Promise<any> {
        try {
            await this.database.query(`
                DELETE FROM buy
                WHERE id_planUser = $1    
            `, [id_planUser])
        } catch (error) {
            throw error; 
        }
    }

    async readPlanUser(id_user: number): Promise<any> {
        try {
            await this.database.query(`
                SELECT *
                FROM buy
                WHERE id_user = $1;    
            `, [id_user])
        } catch (error) {
            
        }
    }
}