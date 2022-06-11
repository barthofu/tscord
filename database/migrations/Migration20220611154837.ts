import { Migration } from '@mikro-orm/migrations';

export class Migration20220611154837 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `stat` (`id` integer not null primary key autoincrement, `type` text not null, `value` text not null, `additional_data` json null, `created_at` datetime not null);');

    this.addSql('create table `data` (`key` text not null, `created_at` datetime not null, `updated_at` datetime not null, `value` text not null, primary key (`key`));');

    this.addSql('create table `guild` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, `prefix` text null, primary key (`id`));');

    this.addSql('create table `user` (`id` text not null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`));');
  }

}
