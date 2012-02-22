module.exports = (seq, DataTypes)->
  seq.define 'article', {
    title: DataTypes.STRING
    body: DataTypes.TEXT
    readTimes: DataTypes.INTEGER
    commentTimes: DataTypes.INTEGER
  }
