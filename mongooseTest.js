const debug = require("debug")("evolvus-library-test:mongooseTest");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const testData = require("./mongooseTestData");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/Test";

chai.use(chaiAsPromised);
