import { MigrationInterface, QueryRunner } from "typeorm";

export class Employee1727857640753 implements MigrationInterface {
    name = 'Employee1727857640753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "mensual_salary" double precision NOT NULL, "join_date" date DEFAULT '2024-10-02T08:27:29.166Z', "department" character varying NOT NULL, "document_id" character varying NOT NULL, "user_id" uuid NOT NULL, "position_id" uuid NOT NULL, CONSTRAINT "REL_cde49f2891d1208cca7c2acefa" UNIQUE ("user_id"), CONSTRAINT "PK_42cbd69fa6c59f000fdc0c07bb9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_cde49f2891d1208cca7c2acefae" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "FK_0ea391192ab12fda3398573d6cb" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_0ea391192ab12fda3398573d6cb"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "FK_cde49f2891d1208cca7c2acefae"`);
        await queryRunner.query(`DROP TABLE "Employees"`);
    }

}
