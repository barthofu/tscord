import { io, Socket } from "socket.io-client"
import { singleton } from "tsyringe"

import { generalConfig } from "@configs"
import { getDevs, validString } from "@utils/functions"
import { Store } from "@services"
@singleton()
export class WebSocket {
    
    private _socket: Socket
    private _eventsQueueBeforeInit: Map<string, (...args: any[]) => void> = new Map()
    private _botName = validString(generalConfig.name) ? generalConfig.name : 'bot'
    private _isInit = false

    constructor(
        private store: Store
    ) {}

    get socket() {
        return this._socket
    }

    get isInit() {
        return this._isInit
    }

    init(botId: string | null) {

        this._socket = io(process.env['WEBSOCKET_URL'], {

            query: {
                token: process.env['BOT_TOKEN'],
                botName: this._botName,
                type: 'bot',
                botId: botId || '',
                authorized: getDevs()
            }
        })

        this._socket.on('connect', () => {

            // this.broadcast('botConnected', { botName: this._botName })
            this._isInit = true

            this.store.update('ready', (e) => ({ ...e, websocket: true }))
        })

        // set the events in the pre-init queue
        for (const [event, callback] of this._eventsQueueBeforeInit) {
            this._socket.on(event, callback)
        }
    }

    broadcast(event: string, ...args: any[]) {
        if (this.isInit) this._socket?.emit('request', { socketId: 'broadcast', event }, ...args)
    }

    emit(socketId: string, event: string, ...args: any[]) {
        if (this.isInit) this._socket?.emit('request', { socketId, event }, ...args)
    }

    addEvent(event: string, callback: (...args: any[]) => void) {

        if (this.isInit) this._socket.on(event, callback)
        else this._eventsQueueBeforeInit.set(event, callback)
    }

}