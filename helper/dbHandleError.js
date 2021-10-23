"use strict";

// get unique error field name

const uniqueMessage = (error) => {
  let output;

  try {
    let fieldName = Object.keys(error.keyValue)[0];

    output =
      fieldName.charAt(0).toUpperCase() +
      fieldName.slice(1) +
      " already exists";
  } catch (error) {
    output = "Unique field already exists";
  }

  return output;
};

// get the error message from object
module.exports.errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      case 11000:
        message = uniqueMessage(error);
        break;
      case 11001:
        break;
      default:
        message = "Some thing went wrong";
    }
  } else {
    message = error.message;
  }
  //   console.log(message);

  return message;
};
