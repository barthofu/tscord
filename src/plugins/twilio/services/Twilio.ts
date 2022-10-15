import { singleton } from 'tsyringe'
import EventEmitter from 'node:events';
import { Twilio as TwilioSDK } from 'twilio'

import { twilioConfig, twilioPhoneNumbers } from "../config"


@singleton()
export class Twilio extends EventEmitter {
    public client: TwilioSDK;

    constructor() {
        super()
        if (twilioConfig.enabled) this.client = new TwilioSDK(
            process.env["TWILIO_ACCOUNT_SID"] as string,
            process.env["TWILIO_AUTH_TOKEN"]  as string,
            { logLevel: twilioConfig.debug ? "debug" : undefined }
        )
    }

    public async sendSMS(from: typeof twilioPhoneNumbers[number], to: string, body: string) {
        if (!twilioConfig.enabled || !this.client) return;
        if (!twilioPhoneNumbers.includes(from)) throw new Error(`Invalid source phone number: ${from}`);

        return this.client.messages.create({ from, to, body });
    }
}

export interface Twilio {
    on<U extends keyof TwilioPlugin.Events>(
      event: U, listener: TwilioPlugin.Events[U]
    ): this;

    emit<U extends keyof TwilioPlugin.Events>(
      event: U, ...args: Parameters<TwilioPlugin.Events[U]>
    ): boolean;
}