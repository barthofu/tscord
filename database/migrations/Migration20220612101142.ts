import { Migration } from '@mikro-orm/migrations';

export class Migration20220612101142 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `guild` add column `deleted` integer not null;');
  }

}
