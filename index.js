var exports = module.exports = {};
var Promise = require('bluebird');
var _ = require('lodash');
var isNumeric = require("isnumeric");

var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

exports.abbreviateNumber = function(value) {
  var newValue = value;
  if (value >= 10000) {
    newValue = exports.nFormatter(value, 1);
  } else if (value >= 1000) {
    //return Utils.nFormatter(value, 1);
    newValue = value.toLocaleString();
  } else {
    newValue = value + '';
  }
  return newValue;
}

exports.nFormatter = function(num, digits) {
  var si = [
      { value: 1E18, symbol: "E" },
      { value: 1E15, symbol: "P" },
      { value: 1E12, symbol: "T" },
      { value: 1E9, symbol: "G" },
      { value: 1E6, symbol: "M" },
      { value: 1E3, symbol: "k" }
    ],
    rx = /\.0+$|(\.[0-9]*[1-9])0+$/,
    i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, "$1");
}

exports.isEmail = function(input) {
  console.log('checking email' + input);

  if (!input) {
    return false;
  }

  try {
    return validator.isEmail(input);
  } catch (err) {
    logger.error(err);
    return false;
  }
};

exports.isPhone2 = function(input) {
  console.log('checking phone ' + input);
  if (!input) {
    return false;
  }
  try {
    var phone = Phone(input);
    if (!phone.length) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    logger.error(err);
    return false;
  }
};

exports.isUsername = function(input) {
  if (!input) {
    return false;
  }

  if (input.indexOf('@') != 0) {
    return false;
  }

  var constraints = {
    username: {
      length: {
        minimum: 1,
        maximum: 15,
        message: "must be 1-15 characters"
      }
    }
  };
  var result = validate({
    username: input.substring(1)
  }, constraints);

  return !result;
};

exports.isValidPwd = function(input) {
  console.log('checking pwd ' + input);
  if (!input) {
    return false;
  }
  var constraints = {
    password: {
      length: {
        minimum: 6,
        message: "must be at least 6 characters"
      }
    }
  };
  var result = validate({
    password: input
  }, constraints);

  return !result;
};

exports.isPhone = function(input, iso2) {
  console.log('checking phone: ' + input);
  console.log('checking iso: ' + iso2);
  if (!iso2) {
    iso2 = 'US';
  }

  if (!input) {
    return false;
  }

  try {
    var phoneNumber = phoneUtil.parseAndKeepRawInput(input, iso2);
    console.log('phone number type:')
    console.log(phoneUtil.getNumberType(phoneNumber));
    if (phoneUtil.getNumberType(phoneNumber) == -1) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.isPhoneString = function(input, iso2) {
  console.log('checking phone: ' + input);
  console.log('checking iso: ' + iso2);
  if (!iso2) {
    iso2 = 'US';
  }

  if (!input) {
    return false;
  }

  try {
    var phonestring = input.replace(/[\(\)\-\+\s]/g, "");
    console.log('phone number:')
    console.log(phonestring);
    if (phonestring.match(/^\d+$/)) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.isInteger = function(input) {

  console.log('checking is integer: ' + input);
  if (!input) {
    return false;
  }
  try {
    var er = /^-?[0-9]+$/;
    return er.test(input);
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.isNotEmpty = function(a) {

  if (_.isObject(a)) {
    return !_.isEmpty(a);
  } else {
    return (a === undefined || a == null || a.length <= 0) ? false : true;
  }
}

exports.generateRandomPass = function(plength) {

  var keylistalpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var keylistint = "123456789";
  var keylistspec = "!@#_";
  var temp = '';
  var len = plength / 2;
  var len = len - 1;
  var lenspec = plength - len - len;

  for (var i = 0; i < len; i++)
    temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length));

  for (var i = 0; i < lenspec; i++)
    temp += keylistspec.charAt(Math.floor(Math.random() * keylistspec.length));

  for (var i = 0; i < len; i++)
    temp += keylistint.charAt(Math.floor(Math.random() * keylistint.length));

  temp = temp.split('').sort(function() {
    return 0.5 - Math.random()
  }).join('');

  return temp;
}