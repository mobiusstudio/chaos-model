import joi from 'joi'

const schemaName = joi.string().required().allow('')
const tableName = joi.string().required().allow('')

export const schemaRules = {
  schemaName,
  tableName,
  column: {
    schemaName,
    tableName,
    type: joi.string().required().allow(null),
    name: joi.string().required().allow(null),
    alias: joi.string().allow(null),
    foreign: joi.alternatives().try(
      joi.array().min(1).max(3).items(joi.string()),
      joi.string(),
    ).allow(null),
    required: joi.boolean().allow(null),
    default: joi.alternatives().try(
      joi.number(),
      joi.string(),
      joi.boolean(),
      joi.array(),
    ).allow(null),
  },
  table: {
    schemaName,
    tableName,
    pkeyIndex: joi.number().integer().min(0).default(0),
    columns: joi.array(),
  },
  schema: {
    schemaName,
    tables: joi.array(),
  },
}
