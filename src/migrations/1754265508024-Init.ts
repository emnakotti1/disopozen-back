import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1754265508024 implements MigrationInterface {
    name = 'Init1754265508024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    }

}
