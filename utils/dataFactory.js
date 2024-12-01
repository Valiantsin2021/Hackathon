import { faker } from '@faker-js/faker'

export class UserBuilder {
  constructor() {
    /**
     * The user object being constructed.
     * @type {Object}
     * @private
     */
    this.user = {}
  }
  /**
   * Set default values for user properties using faker library.
   * @properties id, name, nickname, email, password
   * @return {Object} The updated object with default values set.
   */
  setDefaults() {
    this.user.name = faker.person.firstName()
    this.user.nickname = faker.person.lastName('male')
    this.user.email = faker.internet.email().toLowerCase()
    this.user.password = faker.internet.password()
    return this
  }
  /**
   * Set the first name for the user.
   *
   * @param {string} name - the first name to be set
   * @return {object} this - for method chaining
   */
  withFirstName(name) {
    this.user.name = name
    return this
  }
  /**
   * Set the last name of the user.
   *
   * @param {string} nickname - the last name to set
   * @return {object} - the current object for chaining
   */
  withLastName(nickname) {
    this.user.nickname = nickname
    return this
  }
  /**
   * Set the email for the user.
   *
   * @param {string} email - the email to be set for the user
   * @return {Object} - the current object instance
   */
  withEmail(email) {
    this.user.email = email
    return this
  }
  /**
   * Set the password for the user.
   *
   * @param {string} password - the password to set for the user
   * @return {Object} - the current object instance
   */
  withPassword(password) {
    this.user.password = password
    return this
  }
  /**
   * A method to build user object.
   *
   * @return {Object} the user object
   */
  build() {
    return this.user
  }
}
export const user = new UserBuilder().setDefaults().build()
