import { io, Socket } from 'socket.io-client'
import { container, delay, inject, singleton } from 'tsyringe'
import { Client } from 'discordx'

import { generalConfig } from '@config'
import { validString } from '@utils/functions'

export class WebSocket {

    private _socket: Socket;
    private _botName = validString(generalConfig.name) ? generalConfig.name : 'bot'

    constructor(
        botId: string | null
    ) {

        this._socket = io(process.env['WEBSOCKET_URL'], {
            query: {
                token: process.env['BOT_TOKEN'],
                botName: this._botName,
                type: 'bot',
                botId: botId || '',
                authorized: [...generalConfig.devs, generalConfig.ownerId]
            }
        })

        this._socket.on('connect', () => {

            // this.broadcast('botConnected', { botName: this._botName })
        })
    }

    get socket() {
        return this._socket
    }

    public broadcast(event: string, ...args: any[]) {
        this._socket.emit('request', { socketId: 'broadcast', event }, ...args)
    }

    public emit(socketId: string, event: string, ...args: any[]) {
        this._socket.emit('request', { socketId, event }, ...args)
    }

}