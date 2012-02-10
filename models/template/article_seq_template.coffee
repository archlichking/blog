module.exports = (seq, DataTypes)->
  seq.define 'ARTICLE', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
  }
