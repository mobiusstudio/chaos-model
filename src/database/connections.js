const connections = {
  postgres: {},
  redis: {},
}

const init = (type, name, options) => {
  if (name === 'default') {
    throw new Error('databse name "default" is reserved.')
  }
  const arr = [type === 'postgres' ? 'postgresql' : type, '://']
  const { credentials } = options
  if (credentials) {
    if (credentials.username) {
      arr.push(options.credentials.username)
    } else if (type === 'postgres') {
      throw new Error('Missing username in postgres credentials')
    }
    if (credentials.password) {
      arr.push(':')
      arr.push(options.credentials.password)
    }
    arr.push('@')
  }
  arr.push(options.host)
  if (options.port) {
    arr.push(':')
    arr.push(options.port)
  }
  const server = arr.join('')
  arr.push('/')
  arr.push(options.db)
  const connection = {
    server,
    db: options.db,
    database: options.db,
    string: arr.join(''),
    host: options.host,
    port: options.port,
    options: options.options,
    default: options.default,
  }
  if (credentials) {
    if (credentials.username) {
      connection.user = credentials.username
    }
    if (credentials.password) {
      connection.password = credentials.password
    }
  }
  connections[type][name] = connection
  if (connection.default) {
    connections[type].default = connection
  }
}

const configure = (config) => {
  Object.keys(config).forEach((type) => {
    const typedConfig = config[type]
    Object.keys(typedConfig).forEach((name) => {
      const options = typedConfig[name]
      options.default = options.default || Object.keys(typedConfig).length === 1
      init(type, name, options)
    })
  })
}

export default {
  configure,
  postgres: connections.postgres,
  redis: connections.redis,
}
