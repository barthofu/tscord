export const databaseConfig = {
    
    type: "sqlite",
    path: "./database/",
    backup: {
        enabled: false,
        interval: "daily",
        time: "00:00",
        path: ""
    }
}