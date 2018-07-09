const debug = require("debug")("evolvus-library-test:mongooseTest");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const testData = require("./mongooseTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/Test";

chai.use(chaiAsPromised);

before((done) => {
  const options = {
    autoIndex: false, // Don't build indexes
    autoReconnect: true,
    //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections

    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 1000,
    socketTimeoutMS: 1000,
    keepAlive: true,
    // try so many times...here keeping it low, should be higher in production
    reconnectTries: 3,
    useNewUrlParser: true,
    appname: "mongooseTest"
  };
  mongoose.connect(MONGO_DB_URL, options);
  let connection = mongoose.connection;
  connection.on('error', (e) => {
    debug("error getting connection:" + JSON.stringify(e));
    done();
  });
  connection.once("open", () => {
    debug("ok got the connection");
    testData.deleteAll("IVL")
      .then((res) => {
        done();
      });
  });
});

it("should save a valid object", (done) => {
  let testObject = testData.validObject1;

  let result = testData.save("IVL", testObject);
  expect(result)
    .to.eventually.have.be.a('object')
    .notify(done);
});

it("should update valid object", (done) => {
  let wfEntity = testData.validObject2.wfEntity;
  let wfEntityAction = testData.validObject2.wfEntityAction;

  testData.save("IVL", testData.validObject2)
    .then((testObject) => {
      debug("result: " + JSON.stringify(testObject));
      testObject.description = "Changed";
      testData.update("IVL", {
          "wfEntity": wfEntity,
          "wfEntityAction": wfEntityAction
        }, testObject)
        .then((result) => {
          debug("result: " + JSON.stringify(result));
          expect(result)
            .to.have.property("n")
            .to.equal(1);
          expect(result)
            .to.have.property("nModified")
            .to.equal(1);
          done();
        });
    });
});


it("should update One valid object", (done) => {
  let wfEntity = testData.validObject3.wfEntity;
  let wfEntityAction = testData.validObject3.wfEntityAction;

  testData.save("IVL", testData.validObject3)
    .then((testObject) => {
      debug("result: " + JSON.stringify(testObject));
      testObject.updatedBy = "SYSTEM";
      testData.update("IVL", {
          "wfEntity": wfEntity,
          "wfEntityAction": wfEntityAction
        }, testObject)
        .then((result) => {
          debug("result: " + JSON.stringify(result));
          expect(result)
            .to.have.property("n")
            .to.equal(1);
          expect(result)
            .to.have.property("nModified")
            .to.equal(1);
          done();
        });
    });
});
