const { config:
  { zoho:
    { access_token, refresh_token, user_identifier }
  }
} = require('../../infra/config/index')
var file_persistence = {};
var tokens = {
  access_token: access_token,
  user_identifier: user_identifier,
  refresh_token: refresh_token
}

file_persistence.updateOAuthTokens = function (tokenobject) {
  return new Promise(function (resolve, reject) {

    if (tokens.user_identifier == tokenobject.user_identifier) {
      tokens = { ...tokenobject };
    }

    resolve();
  })
}

file_persistence.getOAuthTokens = function (user_identifier) {
  return new Promise(function (resolve, reject) {

    if (tokens.user_identifier == user_identifier) {
      resolve(tokens);
    } else {
      resolve();
    }

  })
}

file_persistence.saveOAuthTokens = function (tokenobject) {
  return file_persistence.updateOAuthTokens(tokenobject);
}

module.exports = file_persistence;

