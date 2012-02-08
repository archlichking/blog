User = require './User'
Article = require './Article'

dummy_user = new User()
dummy_article = new Article()

u = dummy_user.findUserById 1
console.log u.email

a = dummy_article.findArticleById 0
console.log a.title

a = dummy_article.findArticleByTitle 'welcome'
console.log a.body

a = dummy_article.findArticleByOwnerId 1
console.log a.length
