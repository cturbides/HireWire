import { MigrationInterface, QueryRunner } from "typeorm";

export class Skill1727851054645 implements MigrationInterface {
    name = 'Skill1727851054645'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Skills" ADD "official" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Skills" DROP COLUMN "official"`);
    }

}
