import { Migration } from '@mikro-orm/migrations';

export class Migration20220607153921 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `stat` rename column `action` to `value`;');
  }

}
