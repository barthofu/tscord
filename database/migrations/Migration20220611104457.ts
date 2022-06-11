import { Migration } from '@mikro-orm/migrations';

export class Migration20220611104457 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter601` (`id` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `prefix` text NULL, PRIMARY KEY (`id`));');
    this.addSql('INSERT INTO "_knex_temp_alter601" SELECT * FROM "guild";;');
    this.addSql('DROP TABLE "guild";');
    this.addSql('ALTER TABLE "_knex_temp_alter601" RENAME TO "guild";');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
