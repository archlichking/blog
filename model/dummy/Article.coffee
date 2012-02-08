Comment = require './Comment'
User = require './USer'

class Article
  constructor: ()->
    # fields should be present in a real article obj
    # @id
    # @title
    # @body
    # @ower_id
    # @createdAt
    # @updatedAt
    @dummy_data = [
      {
        id:1
        title: 'welcome'
        body: 'welcome everyone, here is first article'
        owner_id: 1
        createdAt: '2012-02-07 21:12:32'
        updatedAt: '2012-02-07 21:12:32'
      }
    ]
    @comment = new Comment()
    @user = new User()
  
  findArticleById: (id, callback)->
    console.log "invoking findArticleById with id=#{id}"
    for d in @dummy_data
      if d.id == parseInt(id)
        @comment.findCommentsByArticleId d.id, (error, comments)->
          d['comments'] = comments
        console.log d
        callback null, d

  findArticleByTitle: (t, callback)->
    console.log "invoking findArticleByTitle with title like #{t}"
    for d in @dummy_data
      if d.title == t
        callback null, d

  findArticleByOwnerId: (o_id, callback)->
    ret = []
    console.log "invoking findArticleByOwnerId with owner_id=#{o_id}"
    for d in @dummy_data
      if d.owner_id is o_id
        ret.push d
    callback null, ret

module.exports = Article
