const chai = require('chai');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const async = require('async');
const moment = require('moment');
const config = require('../config.js');

chai.use(require('chai-sorted'));
chai.use(require('chai-as-promised'));

const expect = chai.expect;

const allActorColumns = ['actor_id', 'first_name', 'last_name', 'last_update'];
const allCategoryColumns = ['category_id', 'name', 'last_update'];
const allCustomerColumns = [
  'customer_id',
  'store_id',
  'first_name',
  'last_name',
  'email',
  'address_id',
  'active',
  'create_date',
  'last_update'
];
const allFilmColumns = [
  'film_id',
  'title',
  'description',
  'release_year',
  'language_id',
  'original_language_id',
  'rental_duration',
  'rental_rate',
  'length',
  'replacement_cost',
  'rating',
  'special_features',
  'last_update'
];
const allPaymentColumns = [
  'payment_id',
  'customer_id',
  'staff_id',
  'rental_id',
  'amount',
  'payment_date',
  'last_update'
];
const allStaffColumns = [
  'staff_id',
  'first_name',
  'last_name',
  'address_id',
  'picture',
  'email',
  'store_id',
  'active',
  'username',
  'password',
  'last_update'
];

let sqlConnection = null;

const readFile = file =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, file),
      'utf-8',
      (err, data) => (err ? reject(err) : resolve(data))
    );
  });

const executeSql = sql =>
  new Promise((resolve, reject) => {
    sqlConnection.query(sql, (err, results) => {
      if (err) return reject(err);

      if (typeof results === 'null')
        return reject('Exercise has not yet been completed');

      resolve(results);
    });
  });

const readAndExecute = (filename, callback) =>
  readFile(path.join('../sql', `${filename}.sql`)).then(executeSql);

const readAndExecuteSequential = (...files) =>
  files.reduce(
    (promise, file) => promise.then(() => readAndExecute(file)),
    Promise.resolve()
  );
const resetDb = () => readAndExecuteSequential('sakila-schema', 'sakila-data');

const gradeExercise = (results, expectedLength, ...expectedKeys ) => {
  expect(typeof results).to.not.equal('undefined', 'Exercise not yet started.');
  expect(typeof results.fieldCount).to.equal('undefined', 'Exercise not yet started.');
  expect(results.length).to.equal(expectedLength, `Expected ${expectedLength} rows in result set.`);
  expect(results[0]).to.have.keys(expectedKeys.join(',').split(','));
};

describe('SQL Exercises -', function () {
  this.timeout(15000);

  let results = null;

  before(done => {
    sqlConnection = new mysql.createConnection({
      multipleStatements: true,
      host: 'localhost',
      user: config.username,
      password: config.password,
      database: 'sakila'
    });

    sqlConnection.connect();

    readAndExecute('exercises').then(rows => results = rows).then(() => {
      sqlConnection.end();
      done()
    });
  });

  describe('SELECT statements -', () => {
    it('1a - Select all columns from the actor table.', () => {
      gradeExercise(results[0], 200, allActorColumns);
    });
    it('1b. Select only the last_name column from the actor table.', () => {
      gradeExercise(results[1], 200, 'last_name');
    });
    it('1c. Select specific columns from the film table.', () => {
      gradeExercise(results[2], 1000, 'title', 'description', 'rental_duration', 'rental_rate', 'total_rental_cost');
    });
  });

  describe('DISTINCT operator -', () => {
    it('2a - Select all distinct (different) last names from the actor table.', () => {
      gradeExercise(results[3], 121, 'last_name');
    });
    it('2b. Select all distinct (different) postal codes from the address table.', () => {
      gradeExercise(results[4], 597, 'postal_code');
    });
    it('2c. Select all distinct (different) ratings from the film table', () => {
      gradeExercise(results[5], 5, 'rating');
    });
  });

  describe('WHERE clause -', () => {
    it('3a - Select films that play for 3 hours or more.', () => {
      gradeExercise(results[6], 46, 'title', 'description', 'rating', 'length');
    });
    it('3b. Select payments made on or after 05/27/2005', () => {
      gradeExercise(results[7], 15730, 'payment_id', 'amount', 'payment_date');
    });
    it('3c. Select payments made on 05/27/2005', () => {
      gradeExercise(results[8], 167, 'payment_id', 'amount', 'payment_date');
    });
    it('3d. Select customers with first name ending with N and last name beginning with S', () => {
      gradeExercise(results[9], 11, allCustomerColumns);
    });
    it('3e. Select inactive customers with last name beginning with M', () => {
      gradeExercise(results[10], 30, allCustomerColumns);

    });
    it('3f. Select categories where PK is greater than 4 and name field begins with C, S or T.', () => {
      gradeExercise(results[11], 4, allCategoryColumns);
    });
    it('3g. Select staff that have a password', () => {
      gradeExercise(results[12], 1, allStaffColumns.filter(columnName => columnName !== 'password'));
      expect(results[12][0].first_name).to.equal('Mike');
    });
    it('3h. Select staff that do not have a password', () => {
      gradeExercise(results[13], 1, allStaffColumns.filter(columnName => columnName !== 'password'));
      expect(results[13][0].first_name).to.equal('Jon');
    });
  });

  describe('IN operator -', () => {
    it('4a - Select phone/district for addresses in California, England, Taipei, or West Java', () => {
      gradeExercise(results[14], 24, 'phone', 'district');
    });
    it('4b. Select payments made on 05/25/2005, 05/27/2005, and 05/29/2005', () => {
      gradeExercise(results[15], 458, 'amount', 'payment_date', 'payment_id');
    });
    it('4c. Select films rated G, PG-13 or NC-17', () => {
      gradeExercise(results[16], 611, allFilmColumns);
    });
  });

  describe('BETWEEN operator -', () => {
    it('5a - Select payments made between midnight 05/25/2005 and 1 second before midnight 05/26/2005', () => {
      gradeExercise(results[17], 137, allPaymentColumns);
    });
    it('5b. Select films with a description length between 100 and 120', () => {
      gradeExercise(results[18], 262, 'title', 'description', 'release_year', 'total_rental_cost');
    });
  });

  describe('LIKE operator -', () => {
    it('6a - Select films where description begins with "A Thoughtful"', () => {
      gradeExercise(results[19], 45, 'description', 'release_year', 'title');
    });
    it('6b. Select films where description ends with "Boat"', () => {
      gradeExercise(results[20], 84, 'description', 'rental_duration', 'title');
    });
    it('6c. Select films where description contains the word "Database" and longer than 3 hours', () => {
      gradeExercise(results[21], 2, 'description', 'length', 'rental_rate', 'title');
    });
  });

  describe('LIMIT operator -', () => {
    it('7a - Select the first 20 payments', () => {
      gradeExercise(results[22], 20, allPaymentColumns);
    });
    it('7b. Select the 2nd page of payments over $5 where the page size is 1000', () => {
      gradeExercise(results[23], 1000, 'payment_id', 'payment_date', 'amount');
    });
    it('7c. Select the 2nd page of customers where the page size is 100', () => {
      gradeExercise(results[24], 100, allCustomerColumns);
    });
  });

  describe('ORDER BY statement -', () => {
    it('8a - Select films ordered by length in descending order', () => {
      gradeExercise(results[25], 1000, allFilmColumns);
    });
    it('8b. Select distinct ratings ordered by rating in descending order', () => {
      gradeExercise(results[26], 5, 'rating');
    });
    it('8c. Select first 20 payments ordered by payment in descending order', () => {
      gradeExercise(results[27], 20, 'payment_date', 'amount');
    });
    it('8d. Select the first 10 films that have behind the scenes footage, are under 2 hours in length, and a rental duration between 5 and 7, ordered by length in descending order.', () => {
      gradeExercise(results[28], 10, 'title', 'description', 'special_features', 'length', 'rental_duration');
    });
  });

  describe('JOINS -', () => {
    it('9a - Select customer and actor name intersections using a LEFT join', () => {
      gradeExercise(results[29], 620, 'actor_first_name', 'actor_last_name', 'customer_first_name', 'customer_last_name');
    });
    it('9b. Select customer and actor name intersections using a RIGHT join', () => {
      gradeExercise(results[30], 200, 'actor_first_name', 'actor_last_name', 'customer_first_name', 'customer_last_name');
    });
    it('9c. Select customer and actor name intersections using an INNER join', () => {
      gradeExercise(results[31], 43,  'actor_first_name', 'actor_last_name', 'customer_first_name', 'customer_last_name');
    });
    it('9d. Select city and country name, using a LEFT join on country table', () => {
      gradeExercise(results[32], 600, 'city', 'country');
    });
    it('9e. Select films with language info, using a LEFT join on language table', () => {
      gradeExercise(results[33], 1000, 'title', 'description', 'release_year', 'language');
    });
    it('9f. Select staff records complete with address information using 2 LEFT joins', () => {
      gradeExercise(results[34], 2, 'address', 'address2', 'city', 'district', 'first_name', 'last_name', 'postal_code');
    });
  });

});
