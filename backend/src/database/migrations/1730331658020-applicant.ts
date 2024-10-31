import { MigrationInterface, QueryRunner } from "typeorm";

export class Applicant1730331658020 implements MigrationInterface {
    name = 'Applicant1730331658020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "applicants_laboral_experiences_laboral_experiences" ("applicants_id" uuid NOT NULL, "laboral_experiences_id" uuid NOT NULL, CONSTRAINT "PK_a3f93dea31bc05dd681da035ef4" PRIMARY KEY ("applicants_id", "laboral_experiences_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_745e7271e5c7dbf2242f90c0ce" ON "applicants_laboral_experiences_laboral_experiences" ("applicants_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_955731c35a8a0e19f7421853d4" ON "applicants_laboral_experiences_laboral_experiences" ("laboral_experiences_id") `);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences_laboral_experiences" ADD CONSTRAINT "FK_745e7271e5c7dbf2242f90c0ceb" FOREIGN KEY ("applicants_id") REFERENCES "Applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences_laboral_experiences" ADD CONSTRAINT "FK_955731c35a8a0e19f7421853d4e" FOREIGN KEY ("laboral_experiences_id") REFERENCES "LaboralExperiences"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences_laboral_experiences" DROP CONSTRAINT "FK_955731c35a8a0e19f7421853d4e"`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences_laboral_experiences" DROP CONSTRAINT "FK_745e7271e5c7dbf2242f90c0ceb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_955731c35a8a0e19f7421853d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_745e7271e5c7dbf2242f90c0ce"`);
        await queryRunner.query(`DROP TABLE "applicants_laboral_experiences_laboral_experiences"`);
    }

}
