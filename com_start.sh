coffee -c *.coffee
coffee -c routes/*.coffee
coffee -c models/dummy/*.coffee
coffee -c models/template/*.coffee
coffee -c models/*.coffee

nodemon app.js
