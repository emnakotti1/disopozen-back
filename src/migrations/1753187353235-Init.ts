import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753187353235 implements MigrationInterface {
    name = 'Init1753187353235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" ADD "first" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "first"`);
    }

}
