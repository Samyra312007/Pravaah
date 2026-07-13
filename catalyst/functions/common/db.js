const catalyst = require("zcatalyst-sdk-node");

function getDb(req) {
  const app = catalyst.initialize(req);
  return app.datastore().getTable("CaseMaster");
}

function getTable(req, tableName) {
  const app = catalyst.initialize(req);
  return app.datastore().getTable(tableName);
}

function getQuery(req) {
  const app = catalyst.initialize(req);
  return app.datastore().getTable("CaseMaster").getQuery();
}

module.exports = { getDb, getTable, getQuery };
