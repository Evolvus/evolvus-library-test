module.exports.applicationSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "applicationModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64,
    },
    "applicationCode": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20
    },
    "applicationName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "enabled": {
      "type": "boolean",
      "default": true
    },
    "logo": {
      "type": "string"
    },
    "favicon": {
      "type": "string"
    },
    "createdBy": {
      "type": "string"
    },
    "updatedBy": {
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "updatedDate": {
      "type": "string",
      "format": "date-time"
    },
    "description": {
      "type": "string",
      "minLength": 0,
      "maxLength": 255
    }
  },
  // required just means that the object must have these fields. it does not mean
  // that these fields must have values. The values can still be null.
  // To prevent null values use minLength and other attributes
  "required": ["tenantId", "applicationCode", "applicationName", "createdBy", "createdDate"]
};

module.exports.validApplicationObject1 = {
  "tenantId": "IVL",
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.missingTenantApplicationObject = {
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.missingTenantCreatedByApplicationObject = {
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject1 = {
  "tenantId": 123,
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject2 = {
  "tenantId": 123,
  "applicationCode": false,
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject3 = {
  "tenantId": "",
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject4 = {
  "tenantId": "",
  "applicationCode": "D",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject5 = {
  "tenantId": "IVL",
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": 6,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": new Date()
    .toISOString()
};

module.exports.invalidApplicationObject6 = {
  "tenantId": "IVL",
  "applicationCode": "DOCKET",
  "applicationName": "Evolvus Audit Event Capture Service",
  "enabled": false,
  "logo": "smiley.png",
  "favicon": "favicon.png",
  "createdBy": "user1",
  "updatedBy": "",
  "createdDate": new Date()
    .toISOString(),
  "updatedDate": "null"
};
