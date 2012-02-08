module.exports = (seq, DataTypes)->
  seq.define 'USER', 
    {
      name: {type: DataTypes.STRING, allowNull: false},
      email: {type: DataTypes.STRING, allowNull: false},
      password: {type: DataTypes.STRING, allowNull: false},
      status: {type: DataTypes.STRING, allowNull: true}
    }
