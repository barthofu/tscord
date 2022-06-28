import { mikroORMConfig } from './src/config/database'

export default mikroORMConfig[process.env.NODE_ENV || 'development']