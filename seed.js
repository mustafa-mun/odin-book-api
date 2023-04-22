const { faker } = require("@faker-js/faker");
const User = require("./models/user-models/user");
const UserProfile = require("./models/user-models/profile");
const bcrypt = require("bcryptjs");

async function createRandomUser() {
  const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    username: faker.internet.userName(),
    password: hashedPassword,
  };
}

async function populateUsers() {
  try {
    for (let i = 0; i < 15; i++) {
      const userData = await createRandomUser(); // await the result of createRandomUser()
      const user = new User(userData);
      const result = await user.save();
      const profile = new UserProfile({
        user: result._id,
      });
      await profile.save();
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  populateUsers,
};
