const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  sequelize.query(`
  `, {
    raw: true,
    type: db.Sequelize.QueryTypes.INSERT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};
