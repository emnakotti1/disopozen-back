import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBiographyToUser1754829600000 implements MigrationInterface {
  name = 'AddBiographyToUser1754829600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "biography" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "biography"`);
  }
}
