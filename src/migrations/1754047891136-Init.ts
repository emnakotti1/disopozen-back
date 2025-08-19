import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754047891136 implements MigrationInterface {
  name = 'Init1754047891136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phoneNumber" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL`,
    );
  }
}
