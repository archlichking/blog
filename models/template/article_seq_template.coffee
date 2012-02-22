module.exports = (seq, DataTypes)->
  seq.define 'article', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }
