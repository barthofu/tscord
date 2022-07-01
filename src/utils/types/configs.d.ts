type GeneralConfigType = {

    __templateVersion: string,

    name: string,
    description: string,
    defaultLocale: string,
    simpleCommandsPrefix: string,
    ownerId: string,
    timezone: string,
    automaticUploadImagesToImgur: boolean,

    devs: string[],

    eval: {
        name: string,
        onlyOwner: boolean
    },

    activities: {
        text: string,
        type: string
    }[],

}

type DatabaseConfigType = {
    
    path: `${string}/` 

    backup: {
        enabled: boolean,
        path: `${string}/`
    }
}

type LogsConfigType = {

    debug: boolean,

    interaction: {
        file: boolean,
        console: boolean,
        channel: string | null,

        exclude: string[]
    }

    simpleCommand: {
        file: boolean,
        console: boolean,
        channel: string | null
    }

    newUser: {
        file: boolean,
        console: boolean,
        channel: string | null
    }

    guild: {
        file: boolean,
        console: boolean,
        channel: string | null
    }
}

type StatsConfigType = {

    interaction: {
        
        exclude: string[]
    }
}

type APIConfigType = {

    port: number,
}