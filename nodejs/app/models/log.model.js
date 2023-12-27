module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define("logs", {
      priority: {
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      }
    });
  
    return Log;
  };
  