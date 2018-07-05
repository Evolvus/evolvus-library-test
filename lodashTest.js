/*
 * The following jshint comment is needed to compile test cases
 * which use expect(..).is..empty - expression
 */
/*jshint expr: true*/
const debug = require("debug")("evolvus-library-test:lodashTest");
const _ = require("lodash");
const chai = require("chai");
const expect = chai.expect;
const jsonSchemaTestData = require("./jsonSchemaTestData");


it("should merge objects with distinct keys", () => {
  var testObject1 = {
    "tenantId": "IVL"
  };
  var testObject2 = {
    "entityCode": "100",
    "applicationCode": "DOCKET"
  };
  var result = _.merge(testObject1, testObject2);
  debug("result is: " + JSON.stringify(result));

  expect(result, "The result must be a merged object")
    .to.deep.equal({
      "tenantId": "IVL",
      "entityCode": "100",
      "applicationCode": "DOCKET"
    });
});

it("should fetch keys of the object", () => {
  var testObject = jsonSchemaTestData.applicationSchema.properties;
  var result = _.keys(testObject);
  debug("result is: " + JSON.stringify(result));

  expect(result, "The result must be a merged object")
    .to.deep.equal([
      "tenantId",
      "applicationCode",
      "applicationName",
      "enabled",
      "logo",
      "favicon",
      "createdBy",
      "updatedBy",
      "createdDate",
      "updatedDate",
      "description"
    ]);
});

it("should fetch keys of the object matching a property", () => {
  var testObject = jsonSchemaTestData.applicationSchema.properties;
  var result = _.keys(_.pickBy(testObject, (p) => {
    return (p.type == "boolean");
  }));
  debug("result is: " + JSON.stringify(result));

  expect(result, "The result must be a merged object")
    .to.deep.equal([
      "enabled"
    ]);
});

it("should return undefined for missing attribute", () => {
  var testObject = {
    "applicationCode": "PLF",
    "enabled": "true",
    "sort": "enabled,-updateDate"
  };
  var result = _.get(testObject, 'limit');
  debug("result is: " + JSON.stringify(result));
  expect(result, "Must be undefined")
    .to.be.undefined;
});

it("should return default value for missing attribute", () => {
  var testObject = {
    "applicationCode": "PLF",
    "enabled": "true",
    "sort": "enabled,-updateDate"
  };
  var result = _.get(testObject, 'limit', 10);
  debug("result is: " + JSON.stringify(result));
  expect(result, "Must be undefined")
    .to.be.equal(10);
});

it("should return object with select attributes", () => {
  var testObject = {
    "applicationCode": "PLF",
    "enabled": "true",
    "sort": "enabled,-updateDate"
  };
  const filterAttributes = ["enabled", "applicationCode", "createdBy"];

  var result = _.pick(testObject, filterAttributes);
  debug("result is: " + JSON.stringify(result));
  expect(result, "Must be undefined")
    .to.be.deep.equal({
      "applicationCode": "PLF",
      "enabled": "true"
    });
});

it("should create object with chosen attributes", () => {
  var testObject = [
    ["enabled", 1]
  ];

  var result = _.fromPairs(testObject);
  debug("result is: " + JSON.stringify(result));
  expect(result, "Must object with value")
    .to.be.deep.equal({
      "enabled": 1
    });
});

it("should create object with chosen attributes", () => {
  var testObject = "enabled,-updateDate";

  var result = testObject.split(",")
    .reduce((temp, sortParam) => {
      debug("temp: " + JSON.stringify(temp));
      debug("sortParam: " + JSON.stringify(sortParam));

      if (sortParam.charAt(0) == "-") {
        return _.assign(temp, _.fromPairs([
          [sortParam.replace(/-/, ""), -1]
        ]));
      } else {
        return _.assign(_.fromPairs([
          [sortParam.replace(/\+/, ""), 1]
        ]));
      }
    }, {});

  debug("result is: " + JSON.stringify(result));
  expect(result, "Must object with value")
    .to.be.deep.equal({
      "enabled": 1,
      "updateDate": -1
    });
});

it("should return list of extra attributes", () => {
  var testObject = ["*enabled", "createdBy"];
  const filterAttributes = ["enabled", "applicationCode", "createdBy"];

  var result = _.difference(testObject, filterAttributes);
  debug("result is: " + JSON.stringify(result));
  expect(result, "Must be missing attributes")
    .to.be.deep.equal(["*enabled"]);
});
