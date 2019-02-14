import { boolean } from './boolean'
import { string } from './string'
import { number } from './number'
import { id } from './id'
import { object } from './object'
import { array } from './array'

export const types = {
  boolean,
  string,
  number,
  id,
  object,
  array,
}

export const typeMap = new Map()

Object.keys(types).forEach((p) => {
  Object.keys(types[p]).forEach((s) => {
    if (s === 'default') typeMap.set(p, types[p].default)
    else typeMap.set(s, types[p][s])
  })
})

export const find = s => Object.keys(types).find(p => p === s || Object.keys(types[p]).includes(s))

export { schemaRules } from './schema'
