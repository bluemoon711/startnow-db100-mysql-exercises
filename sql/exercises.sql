#                              __
# .--------.--.--.-----.-----.|  |
# |        |  |  |__ --|  _  ||  |
# |__|__|__|___  |_____|__   ||__|
#          |_____|        |__|
#
#        e x e r c i s e s

# Important: Remember to add a semi-colon at the end of each query.

# ---------------------------------------------------------#

## 1. SELECT statements

# 1a. Select all columns from the actor table.
select * from actor;

# 1b. Select only the last_name column from the actor table.
select last_name from actor;

# 1c. Select only the following columns from the film table.
#
# COLUMN NAME           Note
# title                 Exists in film table.
# description           Exists in film table.
# rental_duration       Exists in film table.
# rental_rate           Exists in film table.
# total_rental_cost     rental_duration * rental_rate
SELECT
    title,
    description,
    rental_duration,
    rental_rate,
    rental_duration * rental_rate as total_rental_cost
FROM film;

# ---------------------------------------------------------#


## 2. DISTINCT operator

# 2a. Select all distinct (different) last names from the actor table.
SELECT distinct last_name from actor;

# 2b. Select all distinct (different) postal codes from the address table.
SELECT distinct postal_code from address;

# 2c. Select all distinct (different) ratings from the film table.
select distinct rating from film;


# ---------------------------------------------------------#


## 3. WHERE clause

# 3a. Select the title, description, rating, movie length columns from the films table that last 3 hours or longer.
select title, description, rating, length from film where length >= 180;

# 3b. Select the payment id, amount, and payment date columns from the payments table for payments made on or after 05/27/2005.
select payment_id, amount, payment_date from payment where payment_date >= '2005-05-27';

# 3c. Select the primary key, amount, and payment date columns from the payment table for payments made on 05/27/2005.
select payment_id, amount, payment_date from payment where payment_date BETWEEN '2005-05-27' and '2005-05-28';

# 3d. Select all columns from the customer table for rows that have a last name beginning with "S" and a first name ending with "N".
select * from customer where last_name like "S%" and first_name like "%N";

# 3e. Select all columns from the customer table for rows where the customer is inactive or has a last name ending with "M".
select * from customer where active = '0' or last_name like "%M";

# 3f. Select all columns from the category table for rows where the primary key is greater than 4 and the name field begins with either "C", "S" or "T".
select * from category where category_id > 4 and name like "C%" or name like "S%" or name like "T%";

# 3g. Select all columns minus the password column from the staff table for rows that contain a password.
select staff_id, first_name, last_name, address_id, picture, email, store_id, active, username, last_update 
from staff where password is not null;

# 3h. Select all columns minus the password column from the staff table for rows that do not contain a password.
select staff_id, first_name, last_name, address_id, picture, email, store_id, active, username, last_update 
from staff where password is null;

# ---------------------------------------------------------#


## 4. IN operator

# 4a. Select the phone and district columns from the address table for addresses in California, England, Taipei, or West Java.
select phone, district from address where district='California' or district='England' or district='Taipei' or district='West Java';

# 4b. Select the payment id, amount, and payment date columns from the payment table for payments made on 05/25/2005, 05/27/2005, and 05/29/2005.
# (Use the IN operator and the DATE function, instead of the AND operator as in previous exercises.)
select payment_id, amount, payment_date from payment
where date(payment_date) in ('2005-05-25', '2005-05-27', '2005-05-29');

# 4c. Select all columns from the film table for films rated G, PG-13 or NC-17.
select * from film where rating ='G' or rating ='PG-13' or rating ='NC-17';

# ---------------------------------------------------------#


## 5. BETWEEN operator

# 5a. Select all columns from the payment table for payments made between midnight 05/25/2005 and 1 second before midnight 05/26/2005.
select * from payment where payment_date BETWEEN '2005-05-25 00:00:00' and '2005-05-26 00:00:00';

# 5b. Select the following columns from the film table for films where the length of the description is between 100 and 120.
#
# COLUMN NAME           Note
# title                 Exists in film table.
# description           Exists in film table.
# release_year          Exists in film table.
# total_rental_cost     rental_duration * rental_rate
select title, description, release_year, rental_duration * rental_rate as total_rental_cost from film
where CHAR_LENGTH(description) BETWEEN 100 and 120;

# ---------------------------------------------------------#


## 6. LIKE operator

# 6a. Select the following columns from the film table for rows where the description begins with "A Thoughtful".
# Title, Description, Release Year
select title, description, release_year from film where description like "A thoughtful%";

# 6b. Select the following columns from the film table for rows where the description ends with the word "Boat".
# Title, Description, Rental Duration
select title, description, rental_duration from film where description like "%Boat";

# 6c. Select the following columns from the film table where the description contains the word "Database" and the length of the film is greater than 3 hours.
# Title, Length, Description, Rental Rate
select title, length, description, rental_rate from film where description like "%Database%" and length > 180;

# ---------------------------------------------------------#


## 7. LIMIT Operator

# 7a. Select all columns from the payment table and only include the first 20 rows.
select * from payment limit 20;

# 7b. Select the payment id, payment date and amount columns from the payment table for rows where the payment amount is greater than 5, and only select rows whose zero-based index in the result set is between 1000-2000.
select payment_id, payment_date, amount 
from payment where amount > 5
limit 1000, 1000;

# 7c. Select all columns from the customer table, limiting results to those where the zero-based index is between 101-200.
select * from customer where customer_id BETWEEN 101 and 200;

# ---------------------------------------------------------#


## 8. ORDER BY statement

# 8a. Select all columns from the film table and order rows by the length field in ascending order.
select * from film order by length ASC;

# 8b. Select all distinct ratings from the film table ordered by rating in descending order.
select distinct rating from film order by rating desc;

# 8c. Select the payment date and amount columns from the payment table for the first 20 payments ordered by payment amount in descending order.
select payment_date, amount from payment order by amount desc limit 20;

# 8d. Select the title, description, special features, length, and rental duration columns from the film table for the first 10 films with behind the scenes footage under 2 hours in length and a rental duration between 5 and 7 days, ordered by length in descending order.
select title, description, special_features, length, rental_duration from film 
where length < 120 and rental_duration between 5 and 7 
order by length desc limit 10;

# ---------------------------------------------------------#


## 9. JOINS
# (Take some time to compare results of the next three exercises)

# 9a. Select customer first_name/last_name and actor first_name/last_name columns from performing a left join between the customer and actor column on the last_name column in each table. (i.e. `customer.last_name = actor.last_name`)
# Label customer first_name/last_name columns as customer_first_name/customer_last_name
# Label actor first_name/last_name columns in a similar fashion.
select customer.first_name as customer_first_name, customer.last_name as customer_last_name,
actor.first_name as actor_first_name, actor.last_name as actor_last_name
from customer
left join actor on customer.last_name = actor.last_name;

# 9b. Select the customer first_name/last_name and actor first_name/last_name columns from performing a right join between the customer and actor column on the last_name column in each table. (i.e. `customer.last_name = actor.last_name`)
select customer.first_name as customer_first_name, customer.last_name as customer_last_name,
actor.first_name as actor_first_name, actor.last_name as actor_last_name
from customer
right join actor on customer.last_name = actor.last_name;

# 9c. Select the customer first_name/last_name and actor first_name/last_name columns from performing an inner join between the customer and actor column on the last_name column in each table. (i.e. `customer.last_name = actor.last_name`)
select customer.first_name as customer_first_name, customer.last_name as customer_last_name,
actor.first_name as actor_first_name, actor.last_name as actor_last_name
from customer
inner join actor on customer.last_name = actor.last_name;


# 9d. Select the city name and country name columns from the city table, performing a left join with the country table to get the country name column.
select city, country
from city
left join country on city.country_id = country.country_id;

# 9e. Select the title, description, release year, and language name columns from the film table, performing a left join with the language table to get the "language" column.
# Label the language.name column as "language" (e.g. `select language.name as language`)
select film.title, film.description, film.release_year, language.name as language
from film
left join language on film.language_id = language.language_id;

# 9f. Select the first_name, last_name, address, address2, city name, district, and postal code columns from the staff table, performing 2 left joins with the address table then the city table to get the address and city related columns.
 select staff.first_name as first_name, staff.last_name as last_name, address.address as address, address.address2 as address2,
 address.district as district, address.postal_code as postal_code, city.city as city
 from staff
 left join address on staff.address_id = address.address_id
 left join city on address.city_id = city.city_id;

