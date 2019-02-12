import sqorn from '@sqorn/pg'
import pg from 'pg'

const database = "identity_management"
const postgresHost = 'postgresql://mobiusor@localhost:5432'

const connectionString  = postgresHost + '/' + database

export const sq = sqorn()

const connect = (connectionString) => {
  const pool = new pg.Pool({ connectionString })
  global.db = pool
}
