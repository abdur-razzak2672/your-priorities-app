"use strict";

module.exports = function(sequelize, DataTypes) {
  var Endorsement = sequelize.define("Endorsement", {
    value: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'endorsements',
    classMethods: {
      associate: function(models) {
        Endorsement.belongsTo(models.Post);
        Endorsement.belongsTo(models.User);
      }
    }
  });

  return Endorsement;
};
