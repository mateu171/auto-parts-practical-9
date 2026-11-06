import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRelations1793995572844 implements MigrationInterface {
    name = 'CreateRelations1793995572844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "car_models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "brand" character varying(100) NOT NULL, CONSTRAINT "PK_ee4355345e0e1c18cb6efa2bd5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "specifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, CONSTRAINT "PK_621aabf71e640ab86f0e8b62a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "compatibility_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(50) NOT NULL, CONSTRAINT "UQ_11087e16f91fe20d16c6972b9ec" UNIQUE ("code"), CONSTRAINT "PK_cc40851d8f39ed6b98873baa803" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parts_specifications_specifications" ("partsId" uuid NOT NULL, "specificationsId" uuid NOT NULL, CONSTRAINT "PK_41bec494691bc1a43f2d2012ce2" PRIMARY KEY ("partsId", "specificationsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d4a745aaf176cc899b50a10d99" ON "parts_specifications_specifications"  ("partsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6b4b17c4ba6f6702688e03e43" ON "parts_specifications_specifications"  ("specificationsId") `);
        await queryRunner.query(`ALTER TABLE "parts" ADD "carModelId" uuid`);
        await queryRunner.query(`ALTER TABLE "parts" ADD "compatibilityCodeId" uuid`);
        await queryRunner.query(`ALTER TABLE "parts" ADD CONSTRAINT "UQ_c332b50a87c2cee59ad26e1b5e9" UNIQUE ("compatibilityCodeId")`);
        await queryRunner.query(`ALTER TABLE "parts" ADD CONSTRAINT "FK_860ee1de388738272c9e75af250" FOREIGN KEY ("carModelId") REFERENCES "car_models"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parts" ADD CONSTRAINT "FK_c332b50a87c2cee59ad26e1b5e9" FOREIGN KEY ("compatibilityCodeId") REFERENCES "compatibility_codes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parts_specifications_specifications" ADD CONSTRAINT "FK_d4a745aaf176cc899b50a10d997" FOREIGN KEY ("partsId") REFERENCES "parts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "parts_specifications_specifications" ADD CONSTRAINT "FK_c6b4b17c4ba6f6702688e03e430" FOREIGN KEY ("specificationsId") REFERENCES "specifications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parts_specifications_specifications" DROP CONSTRAINT "FK_c6b4b17c4ba6f6702688e03e430"`);
        await queryRunner.query(`ALTER TABLE "parts_specifications_specifications" DROP CONSTRAINT "FK_d4a745aaf176cc899b50a10d997"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "FK_c332b50a87c2cee59ad26e1b5e9"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "FK_860ee1de388738272c9e75af250"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP CONSTRAINT "UQ_c332b50a87c2cee59ad26e1b5e9"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP COLUMN "compatibilityCodeId"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP COLUMN "carModelId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6b4b17c4ba6f6702688e03e43"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d4a745aaf176cc899b50a10d99"`);
        await queryRunner.query(`DROP TABLE "parts_specifications_specifications"`);
        await queryRunner.query(`DROP TABLE "compatibility_codes"`);
        await queryRunner.query(`DROP TABLE "specifications"`);
        await queryRunner.query(`DROP TABLE "car_models"`);
    }

}
