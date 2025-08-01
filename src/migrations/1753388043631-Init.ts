import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753388043631 implements MigrationInterface {
  name = 'Init1753388043631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."service_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD "status" "public"."service_status_enum" NOT NULL DEFAULT 'active'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."service_status_enum"`);
  }
}
