class User
  constructor: ()->
    # fields
    # @id
    # @name
    # @email
    # @password
    # @status
    # @createdAt
    # @updatedAt
    @dummy_data = [
      {
        id:1
        name: 'lay zhu'
        email: 'thunderzhulei@gmail.com'
        password: 'asdf'
        status: 'nothing to say'
      },
      {
        id:2
        name: 'test user'
        email: 'testuser@blog.com'
        password: 'asdf'
        status: 'nothing to say again'
      }
    ]
  findUserById: (u_id, callback)->
    console.log "invoking getUserById with id=#{u_id}"
    for d in @dummy_data
      if d.id == parseInt(u_id)
        callback null, d

module.exports = User
