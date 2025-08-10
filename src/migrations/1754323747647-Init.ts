import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754323747647 implements MigrationInterface {
  name = 'Init1754323747647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "postalCode" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "postalCode"`);
  }
}
