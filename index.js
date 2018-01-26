console.log("hello world");
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const dbConfig = require("./../config.js");

/**
 * Constructs a database connection and object mappings using Sequelize.
 * @param {*} userOptions - additional options to pass to Sequelize constructor.
 */
function createClient(userOptions = {}) {
  // generate configuration object
  const config = Object.assign(
    {},
    dbConfig,
    {
      operatorsAliases: false,
      typeValidation: true,
      logging: sql => {
        // log.info(sql);
      },
      // Ensure BIGINT values are always returned as Strings regardless of magnitude.
      // If bigNumberStrings is false, sequelize returns Numbers for values up to 2^53
      // but Strings for larger values (which exceed Number.MAX_SAFE_Integer in JavaScript).
      // For more info: https://github.com/mysqljs/mysql
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    },
    userOptions
  );

  // instantiate a sequelize db instance
  const db = new Sequelize(config);

  // load models and fill models map with model objects
  const models = {};
  fs
    .readdirSync(__dirname)
    .filter(
      file =>
        // ignore directories or files with out extensions
        file.indexOf(".") !== 0 &&
        // ignore this file
        file !== basename &&
        // ignore db config file
        file !== "config.js" &&
        // ignore test files
        file.slice(-8) !== ".test.js" &&
        // ensure it's a js file
        file.slice(-3) === ".js"
    )
    .forEach(file => {
      // Read the model file
      const model = db.import(path.join(__dirname, file));
      log.info(`Loading ${model.name}`);
      models[model.name] = model;
    });

  // build associations
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      log.info(`Creating associations for ${modelName}`);
      models[modelName].associate(models);
    }
  });

  return {
    db,
    models
  };
}

const { db, models } = createClient();

module.exports = {
  Sequelize,
  /**
   * @deprecated - Import 'db' instead.
   */
  sequelize: db,
  models,
  createClient
};
