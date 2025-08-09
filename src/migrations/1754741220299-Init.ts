import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1754741220299 implements MigrationInterface {
    name = 'Init1754741220299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" ADD "currency" character varying NOT NULL DEFAULT 'TND'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "currency"`);
    }

}
