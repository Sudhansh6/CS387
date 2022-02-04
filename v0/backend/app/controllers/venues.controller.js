const { response } = require("express");
const { sequelize } = require("../models");
const db = require("../models");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  sequelize.query(`
  insert into venue (venue_name, city_name, country_name, capacity) 
  values ('${req.body.venue_name}', '${req.body.city_name}', '${req.body.country_name}', '${req.body.capacity}')
  `, {
    raw: true,
    quote: false,
    type: db.Sequelize.QueryTypes.INSERT
  }).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(`There was an error while fetching data from the database - ${err}`);
  });
};
