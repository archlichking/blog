class ArticleProvider
  constructor: (@seq)->
    @UserProvider = new (require('models/UserProvider'))(seq)
    @articleDao = @seq.import __dirname + '/template/article_seq_template'

  findArticleById: (a_id, callback)->
    @articleDao.find(a_id).on 'success', (a)->
      callback null, a

  findArticlesByUserId: (u_id, callback)->
    userProvider =  @UserProvider
    @articleDao.findAll({where: {userid: u_id}}).on 'success', (as)->
      for a in as
        # set article owner
        userProvider.findUserById a.USERId, (error, u)->
          a.username = u.name
      callback null, as 

module.exports = ArticleProvider
