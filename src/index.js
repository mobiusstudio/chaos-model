import db from './database'
import errors from './errors'

global.db = db

export const configure = async (options) => {
  const res = await db.configure(options)
  return res
}

export * from './model'
export { errors }
