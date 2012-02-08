module.exports = (seq, DataTypes)->
  seq.define 'COMMENT', {
    body: DataTypes.STRING
  }
