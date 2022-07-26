const Artist = require("../models/artist");

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Artist.find(buildQuery(criteria))
    .sort({ [sortProperty]: 1 })
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Artist.count()]).then((result) => {
    return {
      all: result[0],
      count: result[1],
      offset,
      limit,
    };
  });
};

const buildQuery = (criteria) => {
  const query = {};

  if (criteria.name) {
    query.$text = { $search: criteria.name };
    // to use the above command
    // must create an index for the searched property in this case the name
    // to create the index
    // 1 - open the mongo shell on the terminal using the "mongo" command
    // if it's not working make sure you add it to the environment variables
    // 2 - switch to the desired database
    // 3 - type: "db.<the name of the collection in this case artists">.createIndex({ <the property name>: <type of index in this case text>})
    // done
  }

  if (criteria.age) {
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max,
    };
  }
  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max,
    };
  }

  return query;
};
