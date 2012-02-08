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
        title: 'welcome'
        body: 'welcome everyone, here is first article'
        owner_id: 1
        createdAt: '2012-02-07 21:12:32'
        updatedAt: '2012-02-07 21:12:32'
      }
    ]
  
  findArticleById: (id)->
    console.log "invoking findArticleById with id=#{id}"
    @dummy_data[id]

  findArticleByTitle: (t)->
    console.log "invoking findArticleByTitle with title like #{t}"
    for d in @dummy_data
      if d.title == t
        return d

  findArticleByOwnerId: (o_id)->
    ret = []
    console.log "invoking findArticleByOwnerId with owner_id=#{o_id}"
    for d in @dummy_data
      if d.owner_id is o_id
        ret.push d
    ret

module.exports = Article
