import {MigrationInterface, QueryRunner} from "typeorm";

export class NestStarter1629677451985 implements MigrationInterface {
    name = 'NestStarter1629677451985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email-change" ("token" character(21) NOT NULL, "newEmail" text NOT NULL, "userId" integer NOT NULL, "validUntil" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()) + interval '2 days', CONSTRAINT "PK_2257238e3438c07d1809a949765" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_email-change_userId" ON "email-change" ("userId") `);
        await queryRunner.query(`CREATE TABLE "email-verification" ("token" character(21) NOT NULL, "userId" integer NOT NULL, "validUntil" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()) + interval '2 days', CONSTRAINT "PK_6dfb0062e0a71f8612209ba8e21" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_email-verification_userId" ON "email-verification" ("userId") `);
        await queryRunner.query(`CREATE TABLE "password-reset" ("token" character(21) NOT NULL, "userId" integer NOT NULL, "validUntil" TIMESTAMP NOT NULL DEFAULT timezone('utc', now()) + interval '2 days', CONSTRAINT "PK_f1ad961ee6d0da067f483338751" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_password-reset_userId" ON "password-reset" ("userId") `);
        await queryRunner.query(`CREATE TABLE "connection" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "slug" text NOT NULL, "userId" integer NOT NULL, "contactId" integer NOT NULL, "status" text NOT NULL, CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_connection_slug" ON "connection" ("slug") `);
        await queryRunner.query(`CREATE TABLE "user" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "slug" text NOT NULL, "image" text, "name" text NOT NULL, "username" text NOT NULL, "email" text NOT NULL, "phone" text, "title" text, "company" text, "location" text, "bio" text, "birthday" date, "emailVerified" boolean NOT NULL DEFAULT false, "active" boolean NOT NULL DEFAULT false, "passwordHash" text NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_user_slug" ON "user" ("slug") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_user_email" ON "user" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_user_username" ON "user" ("username") `);
        await queryRunner.query(`CREATE TABLE "refresh-token" ("token" character(21) NOT NULL, "expiry" TIMESTAMP NOT NULL, "userId" integer NOT NULL, "deviceId" text NOT NULL, CONSTRAINT "PK_895eefbc5efe4f52da9090b4d18" PRIMARY KEY ("token"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "slug" text NOT NULL, "type" text NOT NULL, "userId" integer NOT NULL, "linkedUserId" integer, "read" boolean DEFAULT false, "meta" json, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "index_notification_slug" ON "notification" ("slug") `);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_a0b44951ec86a193373e1e816a9" FOREIGN KEY ("contactId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh-token" ADD CONSTRAINT "FK_980388a8baa20f67d6610a1afd3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_301fece8cf3b510c5f79da1e3d8" FOREIGN KEY ("linkedUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_301fece8cf3b510c5f79da1e3d8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "refresh-token" DROP CONSTRAINT "FK_980388a8baa20f67d6610a1afd3"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_a0b44951ec86a193373e1e816a9"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`);
        await queryRunner.query(`DROP INDEX "index_notification_slug"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "refresh-token"`);
        await queryRunner.query(`DROP INDEX "index_user_username"`);
        await queryRunner.query(`DROP INDEX "index_user_email"`);
        await queryRunner.query(`DROP INDEX "index_user_slug"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "index_connection_slug"`);
        await queryRunner.query(`DROP TABLE "connection"`);
        await queryRunner.query(`DROP INDEX "index_password-reset_userId"`);
        await queryRunner.query(`DROP TABLE "password-reset"`);
        await queryRunner.query(`DROP INDEX "index_email-verification_userId"`);
        await queryRunner.query(`DROP TABLE "email-verification"`);
        await queryRunner.query(`DROP INDEX "index_email-change_userId"`);
        await queryRunner.query(`DROP TABLE "email-change"`);
    }

}
