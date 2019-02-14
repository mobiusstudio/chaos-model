class Type {
  constructor({
    str,
    def,
    req,
    sep = ' ',
  }) {
    this.str = str
    this.def = def
    this.req = req
    this.sep = sep
  }

  default = (value) => {
    this.str = [this.str, this.def.replace('#defaultValue#', value)].join(this.sep)
  }

  required = () => {
    this.str = [this.str, this.req].join(this.sep)
  }

  tostring = ({ req, def }) => {
    if (req === true || req === 'true' || req === 1) this.required()
    if (def && typeof def === 'string') this.default(def)
    return this.str
  }
}

export class Sql extends Type {
  constructor(str) {
    super({
      str,
      def: 'DEFAULT #defaultValue#',
      req: 'NOT NULL',
      sep: ' ',
    })
  }

  static autoId = schemaName => new Sql('bigint').tostring({ req: true, def: `"${schemaName}".${schemaName}_id()` })

  static seqId = () => new Sql('serial').tostring({ req: false, def: null })
}

export class Jot extends Type {
  constructor(str) {
    super({
      str,
      def: 'default(#defaultValue#)',
      req: 'required()',
      sep: '.',
    })
  }
}

export class Swt extends Type {
  constructor(str) {
    super({
      str,
      def: 'default: #defaultValue#',
      req: 'required: true',
      sep: ',\n',
    })
  }
}

export class Joi {
  constructor(joi) {
    this.joi = joi
  }

  torule = ({ req = false, def = null } = { req: false, def: null }) => {
    if (req === true || req === 'true' || req === 1) this.joi = this.joi.required()
    if (def !== undefined) this.joi = this.joi.default(def)
    return this.joi
  }
}

export class Swg {
  constructor(swg) {
    this.swg = swg
  }

  toinstance = (obj = null) => {
    if (obj) {
      const { required = null, req = null, default: df = null, def = null, ...arg } = obj
      if (required || req) this.swg.required = required || req
      if (df || def) this.swg.default = df || def
      return {
        ...this.swg,
        ...arg,
      }
    }
    return this.swg
  }
}

// export const generateSwg = obj => ({
//   required = false,
//   req = false,
//   default: df = null,
//   def = null,
//   ...arg
// } = {
//   required: false,
//   default: null,
// }) => new Swg(obj).toinstance({
//   req: required || req,
//   def: df || def,
//   ...arg,
// })
