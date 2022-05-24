import { Migration } from '@mikro-orm/migrations';

export class Migration20220524202903 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `stat` (`id` integer not null primary key autoincrement, `type` text not null, `action` text not null, `created_at` datetime not null);');

    this.addSql('create table `data` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `value` text not null, primary key (`key`));');

    this.addSql('create table `guild` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null);');

    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `created_at` datetime not null, `updated_at` datetime not null, `discord_id` integer not null);');
  }

}
