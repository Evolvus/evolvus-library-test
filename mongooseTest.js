/*
 * The following jshint comment is needed to compile test cases
 * which use expect(..).is..empty - expression
 */
/*jshint expr: true */
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
        return testData.save("IVL", testData.validObject2);
      })
      .then((res) => {
        return testData.save("IVL", testData.validObject3);
      })
      .then((res) => {
        return testData.save("IVL", testData.validObject4);
      })
      .then((res) => {
        done();
      });
  });
});

it("should save a valid object", (done) => {
  let testObject = testData.validObject1;
  testData.save("IVL", testObject)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.a('object');
      done();
    });
});

it("should update valid object", (done) => {
  var testObject = testData.validObject2;
  testObject.description = "Changed";
  testData.update("IVL", {
      "wfEntity": testObject.wfEntity,
      "wfEntityAction": testObject.wfEntityAction
    }, testObject)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.have.property("n")
        .to.equal(1);
      expect(result)
        .to.have.property("nModified")
        .to.equal(1);
      done();
    });
});

it("should fail update when filter is wrong", (done) => {
  var testObject = testData.validObject2;
  testObject.description = "Changed";
  testObject.updatedBy = "SYSTEM";
  testData.update("IVL", {
      "wfEntity": "XYZ",
      "wfEntityAction": testObject.wfEntityAction
    }, testObject)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.have.property("n")
        .to.equal(0);
      expect(result)
        .to.have.property("nModified")
        .to.equal(0);
      done();
    });
});

it("should update fail to update if the filter columns are invalid", (done) => {
  var testObject = testData.validObject3;
  testObject.description = "Changed";
  testObject.updatedBy = "SYSTEM";
  testData.update("IVL", {
      "wfXYZ": "XYZ",
      "wfEntityAction": testObject.wfEntityAction
    }, testObject)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.have.property("n")
        .to.equal(0);
      expect(result)
        .to.have.property("nModified")
        .to.equal(0);
      done();
    });
});

it("should find one object on searching by valid tenant", (done) => {
  testData.findOne("IVL", {})
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an("object")
        .and.not.to.eql({});
      done();
    });
});

// returns null not empty object when not data is found
it("should find null on searching by invalid valid tenant", (done) => {
  testData.findOne("IVL1", {})
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.null;
      done();
    });
});

it("should find null on searching by invalid attribute", (done) => {
  testData.findOne("IVL", {
      "XWZ": "1"
    })
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.null;
      done();
    });
});
