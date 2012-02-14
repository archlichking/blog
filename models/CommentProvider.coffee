class CommentProvider
  constructor: (@seq)->
    @commentDao = @seq.import __dirname + '/template/comment_seq_template'

  findCommentsByArticleId: (a_id, callback)->
    @commentDao.findAll({where: {ARTICLEId: a_id}, order: 'createdAt DESC', limit: 10}).on 'success', (comments)->
      callback null, comments

module.exports = CommentProvider
