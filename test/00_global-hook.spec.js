import '@babel/polyfill/noConflict'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { connect } from '../lib'

chai.use(chaiAsPromised)
chai.should()

before(async () => {
  const str = require('./config/config.json')
  await connect(str.connectionString)
})

after((done) => {
  done()
})
