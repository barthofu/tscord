export const apiConfig: APIConfigType = {

    enabled: false,
    port: process.env['API_PORT'] ? parseInt(process.env['API_PORT']) : 4000,
}