import { MigrationInterface, QueryRunner } from "typeorm";

export class Modules1730322796795 implements MigrationInterface {
    name = 'Modules1730322796795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Employees" DROP CONSTRAINT "UQ_80abff2402c0cb23da0a5205153"`);
        await queryRunner.query(`ALTER TABLE "Employees" DROP COLUMN "document_id"`);
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "UQ_13f1e1cf1f0a4dc2eb2184f1b6b"`);
        await queryRunner.query(`ALTER TABLE "Applicants" DROP COLUMN "document_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Applicants" ADD "document_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "UQ_13f1e1cf1f0a4dc2eb2184f1b6b" UNIQUE ("document_id")`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD "document_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Employees" ADD CONSTRAINT "UQ_80abff2402c0cb23da0a5205153" UNIQUE ("document_id")`);
    }

}
