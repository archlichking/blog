module.exports = (seq, DataTypes)->
  seq.define 'comment', {
    body: DataTypes.STRING
    email: DataTypes.STRING
  }
