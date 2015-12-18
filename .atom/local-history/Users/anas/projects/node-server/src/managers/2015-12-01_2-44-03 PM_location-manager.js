var countries = require('./countries.json')
var _ = require('underscore')

function getCountries () {
  return countries.countries
}
exports.getCountries = getCountries;

function findByCode(code) {
  if (!code) {
    return null;
  }

  return _.find(getCountries(), function(country) {
    return code.toLowerCase() === country.code.toLowerCase();
  });
}
exports.findByCode = findByCode;

function findByName(name) {
  if (!name) {
    return null;
  }

  return _.find(getCountries(), function(country) {
    return name.toLowerCase() === country.name.toLowerCase();
  });
}
exports.findByName = findByName;
