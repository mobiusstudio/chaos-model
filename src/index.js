import pg from 'pg'

export const connect = (connectionString) => {
  const pool = new pg.Pool({ connectionString })
  global.db = pool
}

export * from './model'
