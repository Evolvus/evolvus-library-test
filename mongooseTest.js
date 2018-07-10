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

// find returns an empty array for no data found unlike findOne
it("should find null on searching by invalid attribute", (done) => {
  var tenantId = "IVL";
  var filter = { // invalid filter column
    "XYZ": "1"
  };
  var orderby = {
    "createdDate": 1
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.be.empty;
      done();
    });
});

it("should return [4] on searching by valid parameters", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM"
  };
  var orderby = {
    "createdDate": 1
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});


it("should return [2] on searching by valid parameters", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM",
    "wfEntityAction": "AMEND"
  };
  var orderby = {
    "createdDate": 1
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(2);
      done();
    });
});

//should return ROLE when ordered by ENTITY
it("should return [ROLE] on ordering by wfEntity asc", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM",
    "wfEntityAction": "AMEND"
  };
  var orderby = {
    "wfEntity": 1
  };
  var skipCount = 0;
  var limit = 1;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result[0].wfEntity)
        .to.eql("ROLE");
      done();
    });
});

//should return USER when ordered by ENTITY desc
it("should return [USER] on ordering by wfEntity desc", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM",
    "wfEntityAction": "AMEND"
  };
  var orderby = {
    "wfEntity": -1
  };
  var skipCount = 0;
  var limit = 1;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result[0].wfEntity)
        .to.eql("USER");
      done();
    });
});

it("should return [3] on skiping 1 results", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM"
  };
  var orderby = {
    "createdDate": 1
  };
  var skipCount = 1;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(3);
      done();
    });
});

it("should return [] on skiping 5 results", (done) => {
  var tenantId = "IVL"; // invalid tenant
  var filter = {
    "createdBy": "SYSTEM"
  };
  var orderby = {
    "createdDate": 1
  };
  var skipCount = 5;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(0);
      done();
    });
});

it("should return [4] even though orderby attribute is invalid", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter = { // valid filter
    "createdBy": "SYSTEM"
  };
  var orderby = { //invalid orderby attribute
    "createdDate1": 1
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});


it("should return [4] even though there is an empty orderby attribute", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter = { // valid filter
    "createdBy": "SYSTEM"
  };
  var orderby = { // null valid orderby attribute
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});

it("should return [4] even though there is a empty orderby/filter attribute", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter = { // empty filter
  };
  var orderby = { // empty orderby attribute
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});

it("should return [4] even though there is a null filter attribute", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter = null; // null filter
  var orderby = { // empty orderby attribute
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});

it("should return [4] even though there is a undefined filter attribute", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter; // null filter
  var orderby = { // empty orderby attribute
  };
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});

it("should return [4] even though there is a undefined filter/orderby attribute", (done) => {
  var tenantId = "IVL"; // valid tenant
  var filter; // undefined filter
  var orderby; // undefined orderby attribute
  var skipCount = 0;
  var limit = 0;
  testData.find(tenantId, filter, orderby, skipCount, limit)
    .then((result) => {
      debug("result is: " + JSON.stringify(result));
      expect(result)
        .to.be.an('array')
        .and.have.length(4);
      done();
    });
});
