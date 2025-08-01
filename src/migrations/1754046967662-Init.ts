import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1754046967662 implements MigrationInterface {
  name = 'Init1754046967662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`,
    );

    // Check if enum exists before creating it
    const enumExists = (await queryRunner.query(`
      SELECT 1 FROM pg_type WHERE typname = 'service_status_enum'
    `)) as Array<any>;

    if (enumExists.length === 0) {
      await queryRunner.query(
        `CREATE TYPE "public"."service_status_enum" AS ENUM('active', 'inactive')`,
      );
    }

    // Check if status column exists before adding it
    const columnExists = (await queryRunner.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'service' AND column_name = 'status'
    `)) as Array<any>;

    if (columnExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "service" ADD "status" "public"."service_status_enum" NOT NULL DEFAULT 'active'`,
      );
    }

    // Check if phoneNumber column exists before adding it
    const phoneNumberColumnExists = (await queryRunner.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'phoneNumber'
    `)) as Array<any>;

    if (phoneNumberColumnExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "users" ADD "phoneNumber" character varying`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_f77953c373efb8ab146d98e90c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`,
    );
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "serviceId"`,
    );
    await queryRunner.query(`ALTER TABLE "appointments" ADD "serviceId" uuid`);
    await queryRunner.query(`ALTER TABLE "calendars" DROP COLUMN "serviceId"`);
    await queryRunner.query(`ALTER TABLE "calendars" ADD "serviceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_f77953c373efb8ab146d98e90c3" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_f77953c373efb8ab146d98e90c3"`,
    );
    await queryRunner.query(`ALTER TABLE "calendars" DROP COLUMN "serviceId"`);
    await queryRunner.query(`ALTER TABLE "calendars" ADD "serviceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "serviceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "serviceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`,
    );
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "service" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_f77953c373efb8ab146d98e90c3" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."service_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
