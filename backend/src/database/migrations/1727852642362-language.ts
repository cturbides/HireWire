import { MigrationInterface, QueryRunner } from "typeorm";

export class Language1727852642362 implements MigrationInterface {
    name = 'Language1727852642362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_233ebfdefa0ca52e27832267429" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Languages"`);
    }

}
