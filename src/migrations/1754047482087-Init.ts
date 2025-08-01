import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1754047482087 implements MigrationInterface {
    name = 'Init1754047482087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "provider"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "provider" character varying NOT NULL DEFAULT 'local'`);
    }

}
