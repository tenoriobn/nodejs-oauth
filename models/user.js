const bcrypt = require('bcrypt')
const getDb = require('../util/database').getDb;

class User {
  constructor(username, email, password) {
    this.username = username
    this.email = email
    this.password = password
  }

  async save() {
    const db = getDb();

    return db.collection('users').insertOne(this)
  }

  static async findOne(email, password) {
    const db = getDb();
    const user = await db.collection('users').findOne({email: email});

    if (!user) {
      return null
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log('passwordMatch: ', passwordMatch)

    if (passwordMatch) {
      return user;
    } else {
      return null
    }
  }
}

module.exports = User;