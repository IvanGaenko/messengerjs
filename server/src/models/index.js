import Sequelize, { DataTypes } from 'sequelize';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.config.js')[env];

const { addAssociations } = require('./addAssociations');
const { syncModels } = require('./syncModels');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const db = {};

const modelDefiners = [
  require('./User.model'),
  require('./RefreshSession.model'),
  // require('./Conversation.model'),
  // require('./Message.model'),
  // require('./UserToConversation.model'),
];

for (const modelDefiner of modelDefiners) {
  const model = modelDefiner(sequelize, DataTypes);
  db[model.name] = model;
}

// addAssociations(sequelize);
// syncModels(sequelize);
addAssociations(db);
syncModels(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes;
module.exports = db;
