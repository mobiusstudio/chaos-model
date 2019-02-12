import '@babel/polyfill/noConflict'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { connect } from '../lib'

chai.use(chaiAsPromised)
chai.should()

const database = "owlly-management"
const postgresHost = 'postgresql://mobiusor@localhost:5432'

const connectionString  = postgresHost + '/' + database

before(() => {
  connect(connectionString)
})

after((done) => {
  done()
})
