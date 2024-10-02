import { MigrationInterface, QueryRunner } from "typeorm";

export class Position1727853968629 implements MigrationInterface {
    name = 'Position1727853968629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Positions_risk_level_enum" AS ENUM('LOW', 'HIGH', 'MEDIUM')`);
        await queryRunner.query(`CREATE TABLE "Positions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "min_salary" double precision NOT NULL, "max_salary" double precision NOT NULL, "risk_level" "public"."Positions_risk_level_enum" NOT NULL DEFAULT 'MEDIUM', "available" boolean DEFAULT true, CONSTRAINT "PK_0f4f3bbe136c19f47cd0f4e5672" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Positions"`);
        await queryRunner.query(`DROP TYPE "public"."Positions_risk_level_enum"`);
    }

}
