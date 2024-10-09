import { MigrationInterface, QueryRunner } from "typeorm";

export class LaboralExperience1728458327764 implements MigrationInterface {
    name = 'LaboralExperience1728458327764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "LaboralExperiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "company" character varying NOT NULL, "position" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date, "salary" double precision NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_42a9fd7e2dce9196022cd88d89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" ADD CONSTRAINT "FK_699b45f756731dcf9ec74c9fcb9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" DROP CONSTRAINT "FK_699b45f756731dcf9ec74c9fcb9"`);
        await queryRunner.query(`DROP TABLE "LaboralExperiences"`);
    }

}
