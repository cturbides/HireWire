import { MigrationInterface, QueryRunner } from 'typeorm';

export class Src1733302448870 implements MigrationInterface {
  name = 'Src1733302448870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_4ed056b9344e6f7d8d46ec4b30" UNIQUE ("user_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "first_name" character varying, "last_name" character varying, "document_id" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "email" character varying, "password" character varying, "phone" character varying, "avatar" character varying, CONSTRAINT "UQ_633068827149d09000ca38c4fdd" UNIQUE ("document_id"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Positions_risk_level_enum" AS ENUM('LOW', 'HIGH', 'MEDIUM')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Positions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "min_salary" double precision NOT NULL, "max_salary" double precision NOT NULL, "risk_level" "public"."Positions_risk_level_enum" NOT NULL DEFAULT 'MEDIUM', "available" boolean DEFAULT true, "description" character varying, CONSTRAINT "PK_0f4f3bbe136c19f47cd0f4e5672" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "mensual_salary" double precision NOT NULL, "join_date" date, "department" character varying NOT NULL, "user_id" uuid NOT NULL, "position_id" uuid NOT NULL, CONSTRAINT "REL_cde49f2891d1208cca7c2acefa" UNIQUE ("user_id"), CONSTRAINT "PK_42cbd69fa6c59f000fdc0c07bb9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Languages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_233ebfdefa0ca52e27832267429" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying, "official" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_2f371d611f4a29288e11c9b628e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "LaboralExperiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "company" character varying NOT NULL, "position" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date, "salary" double precision NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_42a9fd7e2dce9196022cd88d89f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Educations_level_enum" AS ENUM('BACHELOR', 'POSTGRADUATE', 'MASTERS', 'DOCTORATE', 'TECHNICAL', 'MANAGEMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, "level" "public"."Educations_level_enum" NOT NULL, "start_date" date NOT NULL, "end_date" date, "institution" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_b51f688a135a51769d49ea1779d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Applicants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "desired_salary" double precision NOT NULL, "recommended_by" character varying NOT NULL, "user_id" uuid NOT NULL, "position_id" uuid NOT NULL, CONSTRAINT "PK_dfec37e21fe57b8591c299d2893" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Skills" ADD "applicant_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Skills" DROP CONSTRAINT "PK_2f371d611f4a29288e11c9b628e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Skills" ADD CONSTRAINT "PK_719b31bec31703ceb58e957c8c3" PRIMARY KEY ("id", "applicant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "LaboralExperiences" ADD "applicant_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "LaboralExperiences" DROP CONSTRAINT "PK_42a9fd7e2dce9196022cd88d89f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "LaboralExperiences" ADD CONSTRAINT "PK_21af4d04a27f45c2250085046c1" PRIMARY KEY ("id", "applicant_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Educations" ADD "applicant_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Educations" DROP CONSTRAINT "PK_b51f688a135a51769d49ea1779d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Educations" ADD CONSTRAINT "PK_c8d540fd083867542139d590c40" PRIMARY KEY ("id", "applicant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_99048c4d0b4c90b738785106f3" ON "Skills" ("applicant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2f371d611f4a29288e11c9b628" ON "Skills" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a83f2ba95f5386f609b7f4b1c" ON "LaboralExperiences" ("applicant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42a9fd7e2dce9196022cd88d89" ON "LaboralExperiences" ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ac8fa139f8d6ec74e5108e0cf8" ON "Educations" ("applicant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b51f688a135a51769d49ea1779" ON "Educations" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_4ed056b9344e6f7d8d46ec4b302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employees" ADD CONSTRAINT "FK_cde49f2891d1208cca7c2acefae" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Employees" ADD CONSTRAINT "FK_0ea391192ab12fda3398573d6cb" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "LaboralExperiences" ADD CONSTRAINT "FK_699b45f756731dcf9ec74c9fcb9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Educations" ADD CONSTRAINT "FK_0973e077f6b2daf23e78ae0539a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Applicants" ADD CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Applicants" ADD CONSTRAINT "FK_ebfa4ad4ba4c3e7d1766d92e329" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b51f688a135a51769d49ea1779"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ac8fa139f8d6ec74e5108e0cf8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_42a9fd7e2dce9196022cd88d89"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a83f2ba95f5386f609b7f4b1c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2f371d611f4a29288e11c9b628"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_99048c4d0b4c90b738785106f3"`,
    );
    await queryRunner.query(`DROP TABLE "Applicants"`);
    await queryRunner.query(`DROP TABLE "Educations"`);
    await queryRunner.query(`DROP TABLE "LaboralExperiences"`);
    await queryRunner.query(`DROP TABLE "Skills"`);
    await queryRunner.query(`DROP TABLE "Languages"`);
    await queryRunner.query(`DROP TABLE "Employees"`);
    await queryRunner.query(`DROP TABLE "Positions"`);
    await queryRunner.query(`DROP TYPE "public"."Positions_risk_level_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
