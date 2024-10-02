import { MigrationInterface, QueryRunner } from "typeorm";

export class Skill1727846952049 implements MigrationInterface {
    name = 'Skill1727846952049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_19f4e08665a1f4bbbb7d5631f35"`);
        await queryRunner.query(`CREATE TABLE "Skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_2f371d611f4a29288e11c9b628e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD "state" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "state" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "user_settings" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TABLE "Skills"`);
        await queryRunner.query(`ALTER TABLE "user_settings" ADD CONSTRAINT "FK_19f4e08665a1f4bbbb7d5631f35" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
