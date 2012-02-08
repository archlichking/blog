User = require './User'

class Comment
  constructor: ()->
    # fields should be in a real comment
    # @id
    # @owner_id
    # @article_id
    # @body
    # @createdAt
    # @updatedAt
    @dummy_data = [
      {
        id:1
        owner_id: 1
        article_id: 1
        body: 'try this one in thread'
        createdAt: '2012-02-08 13:22:30'
        updatedAt: '2012-02-08 13:22:30'
      },
      {
        id:2
        owner_id: 2
        article_id: 1
        body: 'suck it up'
        createdAt: '2012-02-08 13:22:30'
        updatedAt: '2012-02-08 13:22:30'
      }
    ]
    @user = new User()

  findCommentsByArticleId: (a_id, callback)->
    console.log "invoking findCommentsByArticleId with a_id=#{a_id}"
    ret = []
    for d in @dummy_data
      if d.article_id == parseInt(a_id)
        @user.findUserById d.owner_id, (error, u)->
          d['owner_name'] = u.name
        ret.push d
    callback null, ret

  findCommentsByOwnerId: (o_id, callback)->
    console.log "invoking findCommentsByOwnerId with o_id=#{o_id}"

module.exports = Comment
