import { checkObject } from './utils'
import { User, UserProfile } from './mock/models/user'
import { Car } from './mock/models/car'


const mobiusor = {
  username: 'mobiusor',
  password: '123456',
  idToken: 'abcdef',
}
const elaine = {
  username: 'elaine',
  password: '123456',
  idToken: 'abcdef',
}
const mProfile = {
  name: 'miao bu',
  age: 28,
}
const eProfile = {
  name: 'gu xin rui',
  age: 18,
}
const xts = {
  carName: 'XTS',
}


describe('========== Join ==========', () => {
  it('add account', async () => {
    const user = new User()
    try {
      const res = await user.add({
        data: mobiusor,
      })
      checkObject(res, mobiusor, user)
      mobiusor.id = res.id
      xts.ownerId = res.id
    } catch (error) {
      throw error
    }

    try {
      const res = await user.add({
        data: elaine,
      })
      checkObject(res, elaine, user)
      elaine.id = res.id
    } catch (error) {
      throw error
    }
  })

  it('add profile', async () => {
    const profile = new UserProfile()
    try {
      mProfile.loverId = elaine.id
      const pres = await profile.add({
        data: mProfile,
        pkeyValue: mobiusor.id,
      })
      checkObject(pres, mProfile, profile)
    } catch (error) {
      throw error
    }

    try {
      eProfile.loverId = mobiusor.id
      const pres = await profile.add({
        data: eProfile,
        pkeyValue: elaine.id,
      })
      checkObject(pres, eProfile, profile)
    } catch (error) {
      throw error
    }
  })

  it('add car', async () => {
    const car = new Car()
    try {
      const res = await car.add({
        data: xts,
      })
      checkObject(res, xts, car)
      xts.id = res.id
    } catch (error) {
      throw error
    }
  })

  it('update mobiusor profile', async () => {
    const profile = new UserProfile()
    const newMp = {
      carId: xts.id,
    }
    try {
      const res = await profile.update({
        data: newMp,
        pkeyValue: mobiusor.id,
      })
      res.carId.should.equal(xts.id)
    } catch (error) {
      throw error
    }
  })

  it('update elaine profile', async () => {
    const profile = new UserProfile()
    const newEp = {
      carId: xts.id,
    }
    try {
      const res = await profile.update({
        data: newEp,
        pkeyValue: elaine.id,
      })
      res.carId.should.equal(xts.id)
    } catch (error) {
      throw error
    }
  })

  it('left join user/profile/car', async () => {
    const user = new User()
    const profile = new UserProfile()
    const car = new Car()
    const userOn = { userId: '"user".user.id' }
    const carOn = { carId: '"car".car.id' }
    const res = await profile.from().ljoin(user, userOn).ljoin(car, carOn).do()
    console.log(res)
    // console.log(table.state.query)
  })
})
