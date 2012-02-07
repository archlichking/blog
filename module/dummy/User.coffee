class User
  constructor: ()->
    @dummy_users = 
      1:
        real_name: 'lay zhu'
        email: 'thunderzhulei@gmail.com'
        password: 'asdf'
      2:
        real_name: 'test user'
        email: 'testuser@blog.com'
        password: 'asdf'

  findUserById: (id)->
    console.log 'invoking getUserById with id=#{id}'
    @dummy_users[id]

module.exports = User
