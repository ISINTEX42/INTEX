CREATE OR REPLACE PROCEDURE import_raw()
LANGUAGE plpgsql
AS $$
BEGIN
/*
Recreate raw schema and table as necessary
*/
CREATE SCHEMA IF NOT EXISTS raw;
DROP TABLE IF EXISTS raw.plainsville;
CREATE TABLE raw.plainsville(
	survey_timestamp TIMESTAMP,
	age NUMERIC,
	gender TEXT,
	relationship_status TEXT,
	occupation_status TEXT,
	affiliations TEXT,
	is_media_user TEXT,
	platforms TEXT,
	media_usage TEXT,
	purpose_frequency INTEGER,
	distraction_frequency INTEGER,
	restless_amount INTEGER,
	distraction_amount INTEGER,
	worried_amount INTEGER,
	concentration_amount INTEGER,
	comparison_frequency INTEGER,
	comparison_amount INTEGER,
	validation_frequency INTEGER,
	depression_frequency INTEGER,
	fluctuation_frequency INTEGER,
	sleep_frequency INTEGER
);
END; $$