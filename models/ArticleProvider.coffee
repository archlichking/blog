class ArticleProvider
  constructor: (@seq)->
    @UserProvider = new (require('models/UserProvider'))(seq)
    @articleDao = @seq.import __dirname + '/template/article_seq_template'

  findArticleById: (a_id, callback)->
    console.log a_id
    @articleDao.find({where: {id:a_id}}).on 'success', (a)->
      callback null, a

  findArticlesByUserId: (u_id, callback)->
    userProvider =  @UserProvider
    @articleDao.findAll({where: {userid: u_id}, order: 'createdAt DESC', limit: 10}).on 'success', (as)->
      for a in as
        # set article owner
        userProvider.findUserById a.USERId, (error, u)->
          a.username = u.name
      callback null, as 

  addArticle: (title, body, u_id, callback)->
    @articleDao.build({title:title, body:body, USERId:u_id}).save().on('success', (article)->
      if article
        callback null, article
      else
        callback 'Save Blog Failed', null
    ).on('error', (error)->
      callback 'internal error', error
    )

module.exports = ArticleProvider
