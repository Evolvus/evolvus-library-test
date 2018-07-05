const debug = require("debug")("evolvus-library-test:jsonSchemaTest");
const jsonSchemaTestData = require("./jsonSchemaTestData");
const validate = require("jsonschema")
  .validate;
const chai = require("chai");
const expect = chai.expect;

//
// begin tests on the library to see how it behaves
// to see output, set debug variable before running grunt
// DEBUG=evolvus* grunt
//

it("should pass valid Object", () => {
  var testObject = jsonSchemaTestData.validApplicationObject1;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result,valid is: " + JSON.stringify(result.valid));
  debug("result is: " + JSON.stringify(result));

  expect(result.valid, "The result must be valid")
    .to.equal(true);
});


it("should fail validate on undefined Object", () => {
  //
  // we expect validate to return failure for undefined Object
  // but it throws a TypeError exception which has to be caught
  // So when using the validate method make sure we first check for
  // undefined before we call
  // typeof object === 'undefined'
  //
  var testObject;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on null Object", () => {
  // For a null object it errors out saying object is not of a type(s) object
  // result.errors[0].message
  var testObject = null;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result is: " + JSON.stringify(result.errors[0].stack));
  expect(result.valid, "Must fail validation")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on a non Object", () => {
  // we expect validate to return failure for an integer
  // but it throws a TypeError exception which has to be caught
  var testObject = 5;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result is: " + JSON.stringify(result.errors[0].stack));
  expect(result.valid, "Must fail validation for non-objects")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on an Object with one missing attibute(s)", () => {
  // we expect validate to return failure for an integer
  // but it throws a TypeError exception which has to be caught
  var testObject = jsonSchemaTestData.missingTenantApplicationObject;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result is: " + JSON.stringify(result.errors[0].stack));
  expect(result.valid, "Must fail validation when mandatory attributes are missing")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on an Object with multiple(2) missing attibute(s)", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.missingTenantCreatedByApplicationObject;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("Error Message[1]: " + JSON.stringify(result.errors[1].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when mandatory attributes are missing")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(2);
});

it("should fail validate on an Object with attribute of different type", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject1;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when attribute type is different")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on an Object with attribute(s) of different type(2)", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject2;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("Error Message[1]: " + JSON.stringify(result.errors[1].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when attribute type is different")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(2);
});

it("should fail validate on an Object with invalid attribute size", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject3;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when attribute type is different")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should fail validate on an Object with invlid attribute(s) size -2", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject4;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("Error Message[1]: " + JSON.stringify(result.errors[1].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when attribute type is different")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(2);
});

it("should fail validate on an Object with invalid boolean type", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject5;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  debug("result is: " + JSON.stringify(result));
  expect(result.valid, "Must fail validation when attribute type is different")
    .to.equal(false);
  expect(result.errors, "Must have errors")
    .to.have.lengthOf(1);
});

it("should pass validate on an Object with null attribute type", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject6;
  var result = validate(testObject, jsonSchemaTestData.applicationSchema);
  debug("result is: " + JSON.stringify(result));
  //  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  expect(result.valid, "Must not fail validation when attribute type is null")
    .to.equal(true);
});

it("should not allow white space characters", () => {
  // The errors[stack] object gives the list of errors
  // enable debug to see complete result value
  var testObject = jsonSchemaTestData.invalidApplicationObject7;
  var result = validate(testObject, jsonSchemaTestData.applicationSchemaRegex);
  debug("result is: " + JSON.stringify(result));
  //  debug("Error Message[0]: " + JSON.stringify(result.errors[0].stack));
  expect(result.valid, "Must fail validation when attribute type is null")
    .to.equal(false);
});
