declare global {
    namespace NodeJS {
      interface ProcessEnv {

        NODE_ENV: 'development' | 'production'
        
        BOT_TOKEN: string
        TEST_GUILD_ID: string
        BOT_OWNER_ID: string
        
        DATABASE_HOST: string
        DATABASE_PORT: string
        DATABASE_NAME: string
        DATABASE_USER: string
        DATABASE_PASSWORD: string
        
        API_PORT: string
        API_ADMIN_TOKEN: string
        
        WEBSOCKET_URL: string

        IMGUR_CLIENT_ID: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}