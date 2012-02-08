User = require './User'
Article = require './Article'
Comment = require './Comment'

dummy_user = new User()
dummy_article = new Article()
dummy_comment = new Comment()

dummy_user.findUserById 1, (error, u)->
  console.log u

dummy_comment.findCommentsByArticleId 1, (error, c)->
  console.log c

dummy_article.findArticleById 1, (error, a)->
  console.log a

dummy_article.findArticleByTitle 'welcome', (error, a)->
  console.log a.body

dummy_article.findArticleByOwnerId 1, (error, a)->
  console.log a.length
