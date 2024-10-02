import { MigrationInterface, QueryRunner } from "typeorm";

export class Applicant1727896764468 implements MigrationInterface {
    name = 'Applicant1727896764468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Applicants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "document_id" character varying NOT NULL, "desired_salary" double precision NOT NULL, "recommended_by" character varying NOT NULL, "user_id" uuid NOT NULL, "position_id" uuid NOT NULL, CONSTRAINT "UQ_13f1e1cf1f0a4dc2eb2184f1b6b" UNIQUE ("document_id"), CONSTRAINT "REL_3d3b91f37a09709c125c5c6ecc" UNIQUE ("user_id"), CONSTRAINT "PK_dfec37e21fe57b8591c299d2893" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Applicants" ADD CONSTRAINT "FK_ebfa4ad4ba4c3e7d1766d92e329" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "FK_ebfa4ad4ba4c3e7d1766d92e329"`);
        await queryRunner.query(`ALTER TABLE "Applicants" DROP CONSTRAINT "FK_3d3b91f37a09709c125c5c6ecc9"`);
        await queryRunner.query(`DROP TABLE "Applicants"`);
    }

}
