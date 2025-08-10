import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754262811697 implements MigrationInterface {
  name = 'Init1754262811697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "imageUrl" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "imageUrl"`);
  }
}
