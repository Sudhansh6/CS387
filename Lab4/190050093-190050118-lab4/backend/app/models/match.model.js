const { Model } = require('sequelize')
module.exports = (sequelize, Sequelize) => {
    class Match extends Model{
      static associate(models){
        // define association here
      }
    }
    Match.init(
      {
        match_id: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        // team2: {
        //   type: Sequelize.STRING
        // },
        // stadium: {
        //   type: Sequelize.STRING
        // },
        // city: {
        //   type: Sequelize.STRING
        // },
        // result: {
        //   type: Sequelize.STRING
        // }
      },
      {
        // options
        sequelize,
        createdAt: false,
        updatedAt: false,
        ModelName: 'Match',
        // tableName: 'sectionB'
        // , underscore = true
      }
    );
  
    return Match;
  };