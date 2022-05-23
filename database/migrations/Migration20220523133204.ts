import { Migration } from '@mikro-orm/migrations';

export class Migration20220523133204 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `data` (`key` text not null, `value` text not null, primary key (`key`));');

    this.addSql('create table `guild` (`id` integer not null primary key autoincrement);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `discord_id` integer not null);');
  }

}
