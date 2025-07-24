import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753375695240 implements MigrationInterface {
    name = 'Init1753375695240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_f77953c373efb8ab146d98e90c3"`);
        await queryRunner.query(`ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "calendars" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "calendars" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_f77953c373efb8ab146d98e90c3" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calendars" DROP CONSTRAINT "FK_880cc315aa362063bac587e0131"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_f77953c373efb8ab146d98e90c3"`);
        await queryRunner.query(`ALTER TABLE "calendars" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "calendars" ADD "serviceId" integer`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD "serviceId" integer`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "calendars" ADD CONSTRAINT "FK_880cc315aa362063bac587e0131" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_f77953c373efb8ab146d98e90c3" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
