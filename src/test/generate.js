import { faker } from "@faker-js/faker";

function buildUser(overrides) {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  };
}

function buildBook(overrides) {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(),
    author: faker.person.fullName(),
    coverImageUrl: faker.image.url(),
    pageCount: faker.number.int(400),
    publisher: faker.company.name(),
    synopsis: faker.lorem.paragraph(),
    ...overrides,
  };
}

function buildListItem(overrides = {}) {
  const {
    bookId = overrides.book ? overrides.book.id : faker.string.uuid(),
    startDate = faker.date.past({ refDate: 2 }).getTime(),
    finishDate = faker.date
      .between({ from: new Date(startDate), to: new Date() })
      .getTime(),
    owner = { ownerId: faker.string.uuid() },
  } = overrides;

  return {
    id: faker.string.uuid(),
    bookId,
    ownerId: owner.id,
    rating: faker.number.int(5),
    notes: faker.datatype.boolean() ? "" : faker.lorem.paragraph(),
    startDate,
    finishDate,
    book: buildBook({ id: bookId }),
    ...overrides,
  };
}

export { buildUser, buildBook, buildListItem };
