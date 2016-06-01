//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');
var pg = require('pg');
var app = express();

//client id and client secret here, taken from .env (which you need to create)
dotenv.load();

//connect to database
var conString = process.env.DATABASE_CONNECTION_URL;

//Configures the Template engine
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', saveUninitialized: true, resave: true}));

//set environment ports and start application
app.set('port', process.env.PORT || 3000);

//routes
app.get('/', function(req, res){
  res.render('wip');
});

app.get('/wip', function(req, res){
  res.render('index');
});

//routes
app.get('/mood/total', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT SUM(cast("Hospitalization No." as float)) AS total \
              FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012 \
              WHERE "Hospitalization Rate" NOT LIKE \'§\' AND "Hospitalization Rate" NOT LIKE \'‐‐‐\'';

    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});

app.get('/mood/years', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT "Year", SUM(cast("Hospitalization No." as float)) AS total \
              FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012 \
              WHERE "Hospitalization Rate" NOT LIKE \'§\' AND "Hospitalization Rate" NOT LIKE \'‐‐‐\' \
              GROUP BY "Year"';

    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});


app.get('/mood/race', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT "Year" AS year, "Race" AS race, SUM(cast("Hospitalization No." as float)) AS rate \
              FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012 \
              WHERE "Hospitalization Rate" NOT LIKE \'§\' AND "Hospitalization Rate" NOT LIKE \'‐‐‐\' \
              GROUP BY "Year", "Race" \
              ORDER BY "Year" ASC, "Race" ASC';

    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});

app.get('/anxiety/race', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT "Year" AS year, "Race" AS race, SUM(cast("Hospitalization No." as float)) AS rate \
      FROM cogs121_16_raw.hhsa_anxiety_disorder_by_race_2010_2012 \
      WHERE "Hospitalization Rate" <> \'§\' AND "Hospitalization Rate" <> \'‐‐‐\' \
      GROUP BY "Year", "Race" \
      ORDER BY "Year" ASC, "Race" ASC';

    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});


app.get('/schizophrenia/race', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT \'2010\' AS year, \'White\' AS race, SUM(cast("2010 White Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2010 White Hospitalization Rate" <> \'§\' AND "2010 White Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2010\' AS year, \'Black\' AS race, SUM(cast("2010 Black Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2010 Black Hospitalization Rate" <> \'§\' AND "2010 Black Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2010\' AS year, \'Hispanic\' AS race, SUM(cast("2010 Hispanic Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2010 Hispanic Hospitalization Rate" <> \'§\' AND "2010 Hispanic Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2010\' AS year, \'API\' AS race, SUM(cast("2010 API Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2010 API Hospitalization Rate" <> \'§\' AND "2010 API Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2010\' AS year, \'Other\' AS race, SUM(cast("2010 Other Race Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2010 Other Race Hospitalization Rate" <> \'§\' AND "2010 Other Race Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2011\' AS year, \'White\' AS race, SUM(cast("2011 White Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2011 White Hospitalization Rate" <> \'§\' AND "2011 White Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2011\' AS year, \'Black\' AS race, SUM(cast("2011 Black Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2011 Black Hospitalization Rate" <> \'§\' AND "2011 Black Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2011\' AS year, \'Hispanic\' AS race, SUM(cast("2011 Hispanic Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2011 Hispanic Hospitalization Rate" <> \'§\' AND "2011 Hispanic Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2011\' AS year, \'API\' AS race, SUM(cast("2011 API Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2011 API Hospitalization Rate" <> \'§\' AND "2011 API Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2011\' AS year, \'Other\' AS race, SUM(cast("2011 Other Race Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2011 Other Race Hospitalization Rate" <> \'§\' AND "2011 Other Race Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2012\' AS year, \'White\' AS race, SUM(cast("2012 White Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2012 White Hospitalization Rate" <> \'§\' AND "2012 White Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2012\' AS year, \'Black\' AS race, SUM(cast("2012 Black Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2012 Black Hospitalization Rate" <> \'§\' AND "2012 Black Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2012\' AS year, \'Hispanic\' AS race, SUM(cast("2012 Hispanic Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2012 Hispanic Hospitalization Rate" <> \'§\' AND "2012 Hispanic Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2012\' AS year, \'API\' AS race, SUM(cast("2012 API Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2012 API Hospitalization Rate" <> \'§\' AND "2012 API Hospitalization Rate" <> \'‐‐‐\' \
    UNION \
    SELECT \'2012\' AS year, \'Other\' AS race, SUM(cast("2012 Other Race Hospitalization No." as float)) AS total \
    FROM cogs121_16_raw.hhsa_schizophrenia_and_other_psychotic_disorders_2010_2012 \
    WHERE "2012 Other Race Hospitalization Rate" <> \'§\' AND "2012 Other Race Hospitalization Rate" <> \'‐‐‐\' \
    ORDER BY year ASC, race ASC';

    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});

app.get('/race', function(req, res){
  pg.connect(conString, function(err, client, done) {

    if(err) {
    return console.error('error fetching client from pool', err);
    }

    var q = 'SELECT "Area" AS area, "Race" AS race, SUM("Population") AS population \
              FROM cogs121_16_raw.hhsa_san_diego_demographics_county_popul_by_race_2012_norm \
              WHERE "Area" <> \'County Total\' \
              GROUP BY "Area", "Race" \
              ORDER BY "Area" ASC, "Race" ASC';


    client.query( q, function(err, result) {
    //call `done()` to release the client back to the pool
      done();

      if(err) {
        return console.error('error running query', err);
      }
      res.json(result.rows);
      client.end();
      return { delphidata: result };
    });
  });
  return { delphidata: "No data found" };
});




http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
