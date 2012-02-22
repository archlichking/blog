module.exports = (seq, DataTypes) ->
  seq.define 'category',
    {
      name: {type: DataTypes.STRING, allowNull: false}
    }
