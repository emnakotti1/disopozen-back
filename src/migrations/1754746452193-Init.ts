import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754746452193 implements MigrationInterface {
  name = 'Init1754746452193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" RENAME COLUMN "comment" TO "notes"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "notes"`);
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "notes" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "notes"`);
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "notes" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" RENAME COLUMN "notes" TO "comment"`,
    );
  }
}
