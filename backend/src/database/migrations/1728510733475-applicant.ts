import { MigrationInterface, QueryRunner } from "typeorm";

export class Applicant1728510733475 implements MigrationInterface {
    name = 'Applicant1728510733475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "applicants_skills_skills" ("applicants_id" uuid NOT NULL, "skills_id" uuid NOT NULL, CONSTRAINT "PK_a9eb303cd43b59d15aff54a93e3" PRIMARY KEY ("applicants_id", "skills_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01839147a77838d8641d6e8545" ON "applicants_skills_skills" ("applicants_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7dcfd27769fcf3cf9cee8fbe60" ON "applicants_skills_skills" ("skills_id") `);
        await queryRunner.query(`ALTER TABLE "applicants_skills_skills" ADD CONSTRAINT "FK_01839147a77838d8641d6e8545c" FOREIGN KEY ("applicants_id") REFERENCES "Applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_skills_skills" ADD CONSTRAINT "FK_7dcfd27769fcf3cf9cee8fbe608" FOREIGN KEY ("skills_id") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicants_skills_skills" DROP CONSTRAINT "FK_7dcfd27769fcf3cf9cee8fbe608"`);
        await queryRunner.query(`ALTER TABLE "applicants_skills_skills" DROP CONSTRAINT "FK_01839147a77838d8641d6e8545c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7dcfd27769fcf3cf9cee8fbe60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01839147a77838d8641d6e8545"`);
        await queryRunner.query(`DROP TABLE "applicants_skills_skills"`);
    }

}
