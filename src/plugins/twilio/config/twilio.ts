export const twilioConfig: TwilioPlugin.ConfigType = {
    enabled: false,
    debug: false,
    apiValidateSource: false, // Set to false if you are using a reverse-proxy
}

export const twilioPhoneNumbers = [
    "+1XXXXXXXXXX"
] as const