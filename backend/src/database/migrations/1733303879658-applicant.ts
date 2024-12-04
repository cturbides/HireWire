import { MigrationInterface, QueryRunner } from "typeorm";

export class Applicant1733303879658 implements MigrationInterface {
    name = 'Applicant1733303879658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_99048c4d0b4c90b738785106f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f371d611f4a29288e11c9b628"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a83f2ba95f5386f609b7f4b1c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_42a9fd7e2dce9196022cd88d89"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac8fa139f8d6ec74e5108e0cf8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b51f688a135a51769d49ea1779"`);
        await queryRunner.query(`CREATE TABLE "applicants_skills" ("applicant_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_41a3c6e719a20ab088da0092d15" PRIMARY KEY ("applicant_id", "skill_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_025df5daf76889d0b395e13529" ON "applicants_skills" ("applicant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac4925359f296fc23a5474a3bb" ON "applicants_skills" ("skill_id") `);
        await queryRunner.query(`CREATE TABLE "applicants_laboral_experiences" ("applicant_id" uuid NOT NULL, "laboral_experience_id" uuid NOT NULL, CONSTRAINT "PK_387a456cb312318bbec06766d30" PRIMARY KEY ("applicant_id", "laboral_experience_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_98dde62c487d4bc3b017018cdf" ON "applicants_laboral_experiences" ("applicant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8f9e67a920dd2c0a94046ee40a" ON "applicants_laboral_experiences" ("laboral_experience_id") `);
        await queryRunner.query(`CREATE TABLE "applicants_educations" ("applicant_id" uuid NOT NULL, "education_id" uuid NOT NULL, CONSTRAINT "PK_cb80077b4351d9bf8e4e2194bca" PRIMARY KEY ("applicant_id", "education_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f3baf348c117e8585640d3abfe" ON "applicants_educations" ("applicant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1058331a9b70b232dfd929d387" ON "applicants_educations" ("education_id") `);
        await queryRunner.query(`ALTER TABLE "Skills" DROP CONSTRAINT "PK_719b31bec31703ceb58e957c8c3"`);
        await queryRunner.query(`ALTER TABLE "Skills" ADD CONSTRAINT "PK_2f371d611f4a29288e11c9b628e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Skills" DROP COLUMN "applicant_id"`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" DROP CONSTRAINT "PK_21af4d04a27f45c2250085046c1"`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" ADD CONSTRAINT "PK_42a9fd7e2dce9196022cd88d89f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" DROP COLUMN "applicant_id"`);
        await queryRunner.query(`ALTER TABLE "Educations" DROP CONSTRAINT "PK_c8d540fd083867542139d590c40"`);
        await queryRunner.query(`ALTER TABLE "Educations" ADD CONSTRAINT "PK_b51f688a135a51769d49ea1779d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "Educations" DROP COLUMN "applicant_id"`);
        await queryRunner.query(`ALTER TABLE "applicants_skills" ADD CONSTRAINT "FK_025df5daf76889d0b395e135296" FOREIGN KEY ("applicant_id") REFERENCES "Applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_skills" ADD CONSTRAINT "FK_ac4925359f296fc23a5474a3bb7" FOREIGN KEY ("skill_id") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences" ADD CONSTRAINT "FK_98dde62c487d4bc3b017018cdfc" FOREIGN KEY ("applicant_id") REFERENCES "Applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences" ADD CONSTRAINT "FK_8f9e67a920dd2c0a94046ee40a3" FOREIGN KEY ("laboral_experience_id") REFERENCES "LaboralExperiences"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_educations" ADD CONSTRAINT "FK_f3baf348c117e8585640d3abfe6" FOREIGN KEY ("applicant_id") REFERENCES "Applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applicants_educations" ADD CONSTRAINT "FK_1058331a9b70b232dfd929d3871" FOREIGN KEY ("education_id") REFERENCES "Educations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applicants_educations" DROP CONSTRAINT "FK_1058331a9b70b232dfd929d3871"`);
        await queryRunner.query(`ALTER TABLE "applicants_educations" DROP CONSTRAINT "FK_f3baf348c117e8585640d3abfe6"`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences" DROP CONSTRAINT "FK_8f9e67a920dd2c0a94046ee40a3"`);
        await queryRunner.query(`ALTER TABLE "applicants_laboral_experiences" DROP CONSTRAINT "FK_98dde62c487d4bc3b017018cdfc"`);
        await queryRunner.query(`ALTER TABLE "applicants_skills" DROP CONSTRAINT "FK_ac4925359f296fc23a5474a3bb7"`);
        await queryRunner.query(`ALTER TABLE "applicants_skills" DROP CONSTRAINT "FK_025df5daf76889d0b395e135296"`);
        await queryRunner.query(`ALTER TABLE "Educations" ADD "applicant_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Educations" DROP CONSTRAINT "PK_b51f688a135a51769d49ea1779d"`);
        await queryRunner.query(`ALTER TABLE "Educations" ADD CONSTRAINT "PK_c8d540fd083867542139d590c40" PRIMARY KEY ("id", "applicant_id")`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" ADD "applicant_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" DROP CONSTRAINT "PK_42a9fd7e2dce9196022cd88d89f"`);
        await queryRunner.query(`ALTER TABLE "LaboralExperiences" ADD CONSTRAINT "PK_21af4d04a27f45c2250085046c1" PRIMARY KEY ("id", "applicant_id")`);
        await queryRunner.query(`ALTER TABLE "Skills" ADD "applicant_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Skills" DROP CONSTRAINT "PK_2f371d611f4a29288e11c9b628e"`);
        await queryRunner.query(`ALTER TABLE "Skills" ADD CONSTRAINT "PK_719b31bec31703ceb58e957c8c3" PRIMARY KEY ("id", "applicant_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1058331a9b70b232dfd929d387"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f3baf348c117e8585640d3abfe"`);
        await queryRunner.query(`DROP TABLE "applicants_educations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8f9e67a920dd2c0a94046ee40a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98dde62c487d4bc3b017018cdf"`);
        await queryRunner.query(`DROP TABLE "applicants_laboral_experiences"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac4925359f296fc23a5474a3bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_025df5daf76889d0b395e13529"`);
        await queryRunner.query(`DROP TABLE "applicants_skills"`);
        await queryRunner.query(`CREATE INDEX "IDX_b51f688a135a51769d49ea1779" ON "Educations" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac8fa139f8d6ec74e5108e0cf8" ON "Educations" ("applicant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_42a9fd7e2dce9196022cd88d89" ON "LaboralExperiences" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a83f2ba95f5386f609b7f4b1c" ON "LaboralExperiences" ("applicant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f371d611f4a29288e11c9b628" ON "Skills" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_99048c4d0b4c90b738785106f3" ON "Skills" ("applicant_id") `);
    }

}
