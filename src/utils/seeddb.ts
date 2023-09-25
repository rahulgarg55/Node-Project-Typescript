const { Seeder } = require('mongo-seeding');
require("dotenv").config();
const path = require('path');


const url = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

const config = {
    database: url,
  };

const seeder = new Seeder(config);
console.log("Connected To DB.");
console.log("Look Path :", path.resolve("./_seed_data/"));

const collections = seeder.readCollectionsFromPath(path.resolve("./_seed_data/"));


async function Seed() {
    try {
        await seeder.import(collections);
        console.log("Data imported");
      } catch (err) {
        console.log(err);
      }
}

Seed();