const debug = require("debug")("evolvus-application:db:swesetup");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;
const _ = require("lodash");

const schema = require("./mongooseTestSchema");

// Creates a sweSetups collection in the database
var collection = mongoose.model("sweSetup", schema);

// Saves the sweSetup object to the database and returns a Promise
// The assumption here is that the Object is valid
// tenantId must match object.tenantId,if missing it will get added here
module.exports.save = (tenantId, object) => {
  let result = _.merge(object, {
    "tenantId": tenantId
  });
  let saveObject = new collection(result);
  return saveObject.save();
};

module.exports.find = (tenantId, filter, orderby, skipCount, limit) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });

  return collection.find(query)
    .sort(orderby)
    .skip(skipCount)
    .limit(limit);
};

module.exports.findOne = (tenantId, filter) => {
  let query = _.merge(filter, {
    "tenantId": tenantId
  });
  return collection.findOne(query);
};


// multi record update
module.exports.update = (tenantId, key, update) => {
  let query = {
    "tenantId": tenantId,
    "wfEntity": key.wfEntity,
    "wfEntityAction": key.wfEntityAction
  };
  return collection.update(query, update);
};

// updates only the first record
module.exports.update = (tenantId, key, update) => {
  let query = _.merge({
    "tenantId": tenantId
  }, key);
  debug("update query: " + JSON.stringify(query));
  return collection.update(query, update);
};

// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = (tenantId) => {
  let query = {
    "tenantId": tenantId
  };
  return collection.remove(query);
};

module.exports.validObject1 = {
  tenantId: "IVL",
  wfEntity: "USER",
  wfEntityAction: "CREATE",
  enabled: "true",
  description: "",
  wfType: "AA",
  createdBy: "SYSTEM",
  updatedBy: "",
  createdDate: Date.now(),
  updatedDate: Date.now()
};

module.exports.validObject2 = {
  "tenantId": "IVL",
  "wfEntity": "USER",
  "wfEntityAction": "AMEND",
  "enabled": "true",
  "description": "",
  "wfType": "AA",
  "createdBy": "SYSTEM",
  "updatedBy": "",
  "createdDate": Date.now(),
  "updatedDate": Date.now()
};


module.exports.validObject3 = {
  tenantId: "IVL",
  wfEntity: "ROLE",
  wfEntityAction: "CREATE",
  enabled: "true",
  description: "",
  wfType: "AA",
  createdBy: "SYSTEM",
  updatedBy: "",
  createdDate: Date.now(),
  updatedDate: Date.now()
};


module.exports.validObject4 = {
  tenantId: "IVL",
  wfEntity: "ROLE",
  wfEntityAction: "AMEND",
  enabled: "true",
  description: "",
  wfType: "AA",
  createdBy: "SYSTEM",
  updatedBy: "",
  createdDate: Date.now(),
  updatedDate: Date.now()
};
