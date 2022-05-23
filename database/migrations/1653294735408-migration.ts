import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1653294735408 implements MigrationInterface {
    name = 'migration1653294735408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "discordId" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "guild" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "data" ("key" varchar PRIMARY KEY NOT NULL, "value" varchar NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "data"`);
        await queryRunner.query(`DROP TABLE "guild"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
