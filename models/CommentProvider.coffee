class CommentProvider
  constructor: (@seq)->
    @commentDao = @seq.import __dirname + '/template/comment_seq_template'

  findCommentsByArticleId: (start, amount, a_id, callback)->
    @commentDao.findAll({where: {ARTICLEId: a_id}, order: 'id DESC', limit: amount, offset: start}).on 'success', (comments)->
      callback null, comments

  countAllByArticle: (a_id, callback)->
    @commentDao.count({where: {ARTICLEId:a_id}}).on 'success', (c)->
      callback null, c

  addComment: (body, a_id, callback)->
    @commentDao.build({body: body, ARTICLEId: a_id}).save().on('success', (comment)->
        if comment
          callback null, comment
        else
          callback 'Save Comment Failed', null
      ).on('error', (error)->
        callback 'internal error', error
      )

module.exports = CommentProvider
