import pg from 'pg'
import errors from './errors'

 export const connect = (connectionString) => {
  const pool = new pg.Pool({ connectionString })
  global.db = pool
}

export * from './model'
export { errors }
