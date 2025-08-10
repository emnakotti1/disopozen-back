import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754772076538 implements MigrationInterface {
  name = 'Init1754772076538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."working_hours_dayofweek_enum" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "working_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" "public"."working_hours_dayofweek_enum" NOT NULL, "startTime" TIME, "endTime" TIME, "isClosed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "providerId" uuid, CONSTRAINT "PK_5f84d2fa3953367fe9d704d8df6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "working_hours" ADD CONSTRAINT "FK_ef1feb2aaa765b487a901aa1561" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "working_hours" DROP CONSTRAINT "FK_ef1feb2aaa765b487a901aa1561"`,
    );
    await queryRunner.query(`DROP TABLE "working_hours"`);
    await queryRunner.query(
      `DROP TYPE "public"."working_hours_dayofweek_enum"`,
    );
  }
}
