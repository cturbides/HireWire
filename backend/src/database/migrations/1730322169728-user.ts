import { MigrationInterface, QueryRunner } from "typeorm";

export class User1730322169728 implements MigrationInterface {
    name = 'User1730322169728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "document_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_633068827149d09000ca38c4fdd" UNIQUE ("document_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_633068827149d09000ca38c4fdd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "document_id"`);
    }

}
