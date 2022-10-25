import { jest } from "@jest/globals"
import { Client as ClientX } from "discordx"
import { BaseChannel, Client, CommandInteraction, Guild, GuildChannel, GuildMember, Message, TextChannel, User } from "discord.js"
import { RawCommandInteractionData } from "discord.js/typings/rawDataTypes"
import { singleton } from "tsyringe"

@singleton()
export class Mock {

    private client: Client
    private guild: Guild
    private channel: TextChannel
    private guildChannel: GuildChannel
    private textChannel: TextChannel
    private guildMember: GuildMember
    private user: User
    private message: Message

    getClient() { return this.client }

    constructor() {
        this.mockClient()
        this.mockGuild()
        this.mockUser()
        this.mockGuildMember()
        this.mockChannel()
        this.mockGuildChannel()
        this.mockTextChannel()
        this.mockMessage('mocked message')

        // mock cache
        this.client.guilds.cache.set(this.guild.id, this.guild)
        this.client.guilds.fetch = jest.fn(() => Promise.resolve(this.guild)) as any

        this.client.channels.cache.set(this.channel.id, this.channel)
        this.client.channels.fetch = jest.fn(() => Promise.resolve(this.channel)) as any

        this.guild.channels.cache.set(this.textChannel.id, this.textChannel)
        this.guild.channels.fetch = jest.fn(() => Promise.resolve(this.textChannel)) as any

        this.guild.members.cache.set(this.guildMember.id, this.guildMember)
        this.guild.members.fetch = jest.fn(() => Promise.resolve(this.guildMember)) as any
    }

    private mockClient() {
        this.client = new ClientX({ intents: [], guards: [] })
        this.client.login = jest.fn(() => Promise.resolve('LOGIN_TOKEN')) as any
    }

    private mockGuild(): void {
        this.guild = Reflect.construct(Guild,  [
            this.client, 
            {
                unavailable: false,
                id: 'guild-id',
                name: 'mocked js guild',
                icon: 'mocked guild icon url',
                splash: 'mocked guild splash url',
                region: 'eu-west',
                member_count: 42,
                large: false,
                features: [],
                application_id: 'application-id',
                afkTimeout: 1000,
                afk_channel_id: 'afk-channel-id',
                system_channel_id: 'system-channel-id',
                embed_enabled: true,
                verification_level: 2,
                explicit_content_filter: 3,
                mfa_level: 8,
                joined_at: new Date('2018-01-01').getTime(),
                owner_id: 'owner-id',
                channels: [],
                roles: [],
                presences: [],
                voice_states: [],
                emojis: [],
            }
        ])
    }

    private mockChannel() {
        this.channel = Reflect.construct(BaseChannel, [
            this.guild,
            {
                id: 'channel-id',
            }
        ])
    }

    private mockGuildChannel(): void {
        this.guildChannel = Reflect.construct(GuildChannel, [
            this.guild, 
            {
                ...this.channel,
                name: 'guild-channel',
                position: 1,
                parent_id: '123456789',
                permission_overwrites: [],
            }
        ])
    }

    private mockTextChannel(): void {
        this.textChannel = Reflect.construct(TextChannel, [
            this.guild, 
            {
                ...this.guildChannel,
                topic: 'topic',
                nsfw: false,
                last_message_id: '123456789',
                lastPinTimestamp: new Date('2019-01-01').getTime(),
                rate_limit_per_user: 0,
            }
        ])

        this.textChannel.send = jest.fn(() => Promise.resolve(this.message)) as any
    }

    private mockUser() {
        this.user = Reflect.construct(User, [
            this.client,
            {
                id: 'user-id',
                username: 'test',
                discriminator: 'test#0000',
                avatar: null,
                bot: false
            }
        ])
    }

    private mockGuildMember(): void {
        this.guildMember = Reflect.construct(GuildMember, [
          this.client,
          {
            id: BigInt(1),
            deaf: false,
            mute: false,
            self_mute: false,
            self_deaf: false,
            session_id: "session-id",
            channel_id: "channel-id",
            nick: "nick",
            joined_at: new Date("2020-01-01").getTime(),
            user: this.user,
            roles: [],
          },
          this.guild
        ])
    }

    private mockMessage(content: string): void {
        this.message = Reflect.construct(Message, [
          this.client,
          {
            id: BigInt(10),
            type: "DEFAULT",
            content: content,
            author: this.user,
            webhook_id: null,
            member: this.guildMember,
            pinned: false,
            tts: false,
            nonce: "nonce",
            embeds: [],
            attachments: [],
            edited_timestamp: null,
            reactions: [],
            mentions: [],
            mention_roles: [],
            mention_everyone: [],
            hit: false,
          },
          this.textChannel
        ])

        this.message.inGuild = jest.fn(() => true)

        this.message.react = jest.fn() as any
        this.message.edit = jest.fn() as any
        this.message.delete = jest.fn() as any
    }


    public mockCommandInteraction<T extends RawCommandInteractionData['data']>(commandData: T): CommandInteraction {

        const interaction = Reflect.construct(CommandInteraction, [
            this.client,
            {
                data: commandData,
                id: BigInt(1),
                user: this.guildMember,
            }
        ])
        
        interaction.guildId = this.guild.id
        
        interaction.followUp = jest.fn(() => Promise.resolve(this.message)) as any
        interaction.reply = jest.fn(() => Promise.resolve(this.message)) as any
        interaction.isCommand = jest.fn(() => true)

        return interaction
    }
}