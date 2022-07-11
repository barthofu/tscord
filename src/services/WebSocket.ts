import { io, Socket } from 'socket.io-client'
import { singleton } from 'tsyringe'

import { generalConfig } from '@config'

@singleton()
export class WebSocket {

    private _socket: Socket;

    constructor() {
        this._socket = io(process.env['WEBSOCKET_URL'], {
            query: {
                token: process.env['BOT_TOKEN'],
                botName: generalConfig.name,
                type: 'bot'
            }
        })
    }

    get socket() {
        return this._socket
    }

    public broadcast(event: string, data: any) {
        this._socket.emit('request', 'broadcast', event, data)
    }

    public emit(socketId: string, event: string, data: any) {
        this._socket.emit('request', socketId, event, data)
    }

}