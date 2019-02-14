
export const checkObject = (obj, data, model) => {
  const newData = {}
  Object.keys(data).forEach((key) => {
    model.columns.items.forEach((item) => {
      if (item.name === key) newData[`${item.alias || item.name}`] = data[key]
    })
  })
  Object.keys(data).forEach((key, index) => {
    if (index !== model.pkeyIndex && newData[key]) obj[key].should.equal(newData[key])
  })
}
