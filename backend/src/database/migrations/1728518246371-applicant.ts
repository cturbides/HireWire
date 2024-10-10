import { MigrationInterface, QueryRunner } from "typeorm";

export class Applicant1728518246371 implements MigrationInterface {
    name = 'Applicant1728518246371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9"`);
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "REL_3d3b91f37a09709c125c5c6ecc"`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9"`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "REL_3d3b91f37a09709c125c5c6ecc" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
