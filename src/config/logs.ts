export const logsConfig: LogsConfigType = {

    debug: false,
		
    interaction: {
        file: true,
        console: true,
        channel: null,

        exclude: [
            'BUTTON_INTERACTION', 
            'SELECT_MENU_INTERACTION'
        ]
    },

    simpleCommand: {
        file: true,
        console: true,
        channel: null
    },

    newUser: {
        file: true,
        console: true,
        channel: null
    },

    guild: {
        file: true,
        console: true,
        channel: null
    }
}