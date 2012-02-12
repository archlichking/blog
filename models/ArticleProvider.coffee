class ArticleProvider
  constructor: (@seq)->
    @articleDao = @seq.import __dirname + '/template/article_seq_template'

  findArticleById: (a_id, callback)->
    @articleDao.find(a_id).on 'success', (a)->
      callback null, a

  findArticlesByUserId: (u_id, callback)->
    @articleDao.find({where: {userid: u_id}}).on 'success', (as)->
      callback null, as

module.exports = ArticleProvider
