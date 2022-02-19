module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "Watermelon",
    DB: "Lab4",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };