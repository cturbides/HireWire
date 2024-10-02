import { MigrationInterface, QueryRunner } from "typeorm";

export class Employee1727859590541 implements MigrationInterface {
    name = 'Employee1727859590541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "join_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "UQ_80abff2402c0cb23da0a5205153" UNIQUE ("document_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "UQ_80abff2402c0cb23da0a5205153"`);
        await queryRunner.query(`ALTER TABLE "Employees" ALTER COLUMN "join_date" SET DEFAULT '2024-10-02'`);
    }

}
