const { faker } = require('@faker-js/faker')

exports.generateFakeData = (type) => {
  if (type === 'project') return fakeProject()
  if (type === 'user') return fakeUser()
}

const fakeProject = () => ({
  level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
  title: faker.lorem.text().slice(0, 100),
  description: faker.lorem.paragraph({ min: 3, max: 5 }),
  photo: faker.image.url({ width: 1280, height: 720 }),
  tags: faker.lorem.words(5),
  link: faker.internet.url(),
  gitBack: faker.internet.url(),
  gitFront: faker.internet.url()
})

const fakeUser = () => ({
  username: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement(['admin', 'user', 'client', 'helper']),
  photo: faker.image.avatar(),
  active: faker.helpers.arrayElement([true, false])
})
