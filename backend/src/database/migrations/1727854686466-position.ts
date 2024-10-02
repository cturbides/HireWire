import { MigrationInterface, QueryRunner } from "typeorm";

export class Position1727854686466 implements MigrationInterface {
    name = 'Position1727854686466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Positions" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Positions" DROP COLUMN "description"`);
    }

}
