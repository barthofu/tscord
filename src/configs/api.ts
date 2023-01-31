export const apiConfig: APIConfigType = {

    enabled: false, // is the API server enabled or not
    port: process.env['API_PORT'] ? parseInt(process.env['API_PORT']) : 4000, // the port on which the API server should be exposed
}