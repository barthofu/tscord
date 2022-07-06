export const apiConfig: APIConfigType = {

    port: process.env['API_PORT'] ? parseInt(process.env['API_PORT']) : 4000,
}