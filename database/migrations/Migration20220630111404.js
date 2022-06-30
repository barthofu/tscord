'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20220630111404 extends Migration {

  async up() {
    this.addSql('create table "image" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "file_name" varchar(255) not null, "url" varchar(255) not null, "hash" varchar(255) not null, "delete_hash" varchar(255) not null, "size" int not null);');

    this.addSql('create table "stat" ("id" serial primary key, "type" varchar(255) not null, "value" varchar(255) not null, "additional_data" jsonb null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "data" ("key" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "value" varchar(255) not null);');
    this.addSql('alter table "data" add constraint "data_pkey" primary key ("key");');

    this.addSql('create table "guild" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "prefix" varchar(255) null, "deleted" boolean not null);');
    this.addSql('alter table "guild" add constraint "guild_pkey" primary key ("id");');

    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
  }

}
exports.Migration20220630111404 = Migration20220630111404;
