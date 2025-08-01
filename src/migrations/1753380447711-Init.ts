import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1753380447711 implements MigrationInterface {
  name = 'Init1753380447711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`,
    );
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "first"`);
    await queryRunner.query(
      `ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD "first" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
