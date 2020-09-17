const xxtea = require("xxtea-node");
const Config = require("./config");

var enXxtea = function (data) {
  try {
    let dataEncrypted;
    dataEncrypted = xxtea.encryptToString(
      JSON.stringify(data),
      Config.KEY_XXTEA
    );
    return dataEncrypted;
  } catch (err) {}
  return null;
};

var deXxtea = function (data) {
  try {
    let dataDecrypted = xxtea.decryptToString(data, Config.KEY_XXTEA);
    return JSON.parse(dataDecrypted);
  } catch (err) {}
  return null;
};
module.exports.EnXxtea = enXxtea;
module.exports.DeXxtea = deXxtea;
