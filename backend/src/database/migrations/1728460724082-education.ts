import { MigrationInterface, QueryRunner } from "typeorm";

export class Education1728460724082 implements MigrationInterface {
    name = 'Education1728460724082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Educations_level_enum" AS ENUM('BACHELOR', 'POSTGRADUATE', 'MASTERS', 'DOCTORATE', 'TECHNICAL', 'MANAGEMENT')`);
        await queryRunner.query(`CREATE TABLE "Educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" boolean NOT NULL DEFAULT true, "description" character varying NOT NULL, "level" "public"."Educations_level_enum" NOT NULL, "start_date" date NOT NULL, "end_date" date, "institution" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_b51f688a135a51769d49ea1779d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Educations" ADD CONSTRAINT "FK_0973e077f6b2daf23e78ae0539a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Educations" DROP CONSTRAINT "FK_0973e077f6b2daf23e78ae0539a"`);
        await queryRunner.query(`DROP TABLE "Educations"`);
        await queryRunner.query(`DROP TYPE "public"."Educations_level_enum"`);
    }

}
