import errors from 'restify-errors'
const normalize = (name) => {
  /* eslint-disable no-param-reassign */
  // name = name.charAt(0).toUpperCase() + name.slice(1)
  if (!name.endsWith('Error')) {
    return `${name}Error`
  }
  return name
}

errors.localization = {
  "DBCreateFailed": "Create object failed.",
  "DBUpdateFailed": "Update object failed.",
  "DBDeleteFailed": "Delete object failed.",
  "DBGetFailed": "Get object information failed.",
  "AddFailed": "Add new file failed.",
  "UpdateFailed": "Update file failed.",
  "DeleteFaild": "Delete new file failed.",
  "ValidateFailed": "Validate failed.",
  "InvalidFilterSymbol": "Invalid Filter Symbol",
  "InvalidNextKey": "Invalid NextKey",
  
  "InvalidId": "This id does not exist in system.",
  "AccountOrPasswordInvalid": "Invalid account or password."
}

errors.lang = (error) => {
  if (error.message) return error.message
  const name = error.name.slice(0, -5)
  return errors.localization[name]
}

errors.register = (options) => {
  Object.keys(options).forEach((name) => {
    const config = options[name]
    const errorName = normalize(name)
    switch (typeof config) {
      case 'number':
        errors[errorName] = errors.makeConstructor(errorName, {
          statusCode: config,
        })
        return
      case 'object':
        errors[errorName] = errors.makeConstructor(errorName, config)
        return
      default:
    }
    throw new Error(`Invalid error config for ${errorName}`)
  })
}

errors.update = (localization) => {
  errors.localization = Object.keys(localization).reduce((previousLocalization, key) => {
    previousLocalization[key] = localization[key]
    return previousLocalization
  }, errors.localization)
}

export default errors
