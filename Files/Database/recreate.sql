CREATE OR REPLACE PROCEDURE recreate()
LANGUAGE plpgsql
AS $$
BEGIN
/*
Create schema as necessary
*/
CREATE SCHEMA IF NOT EXISTS normalization;
/*
Convert raw data to first normal form
- age needs rounding and integer cast
- gender needs regex
- is_media_user needs boolean cast
- media_usage needs simplification
- affiliations needs unnesting using string_to_array
- platforms needs unnesting using string_to_array
*/
DROP TABLE IF EXISTS normalization.first_normal;
CREATE TABLE normalization.first_normal AS (
SELECT
survey_timestamp, 
ROUND(age,2)::INTEGER as age, 
CASE 
WHEN gender LIKE 'male' OR gender LIKE 'm' THEN 'Male'
WHEN gender LIKE 'female' OR gender LIKE 'f' THEN 'Female' 
ELSE 'Other'
END AS gender, 
relationship_status, occupation_status, affiliation_num, affiliation, 
CASE WHEN is_media_user='Yes' THEN 'TRUE'::BOOLEAN
ELSE 'FALSE'::BOOLEAN
END AS is_media_user, 
platform_num, platform, 
CASE
WHEN media_usage='Less than an Hour' THEN '<1'
WHEN media_usage='Between 1 and 2 hours' THEN '1-2'
WHEN media_usage='Between 2 and 3 hours' THEN '2-3'
WHEN media_usage='Between 3 and 4 hours' THEN '3-4'
WHEN media_usage='Between 4 and 5 hours' THEN '4-5'
ELSE '5<'
END AS media_usage, 
purpose_frequency, distraction_frequency, restless_amount, 
distraction_amount, worried_amount, concentration_amount, 
comparison_frequency, comparison_amount, validation_frequency, 
depression_frequency, fluctuation_frequency, sleep_frequency
FROM raw.plainsville, UNNEST(STRING_TO_ARRAY(platforms, ', ')) WITH ORDINALITY AS U1 (platform, platform_num),
UNNEST(STRING_TO_ARRAY(affiliations, ', ')) WITH ORDINALITY AS U2 (affiliation, affiliation_num)
);
/*
Convert first to third normal form
- Recreate surveyees, surveyee_info, surveyee_affiliations, surveyee_platforms, and survey_responses
- DROP and CREATE tables
- INSERT from first normal form
*/
-- surveyees
DROP TABLE IF EXISTS normalization.surveyees;
CREATE TABLE normalization.surveyees(
surveyee_id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (START 1 INCREMENT 1),
survey_timestamp TIMESTAMP NOT NULL,
age INTEGER NOT NULL,
gender VARCHAR(30),
PRIMARY KEY (surveyee_id)
);
INSERT INTO normalization.surveyees(survey_timestamp, age, gender)
SELECT DISTINCT survey_timestamp, age, gender
FROM normalization.first_normal;
-- surveyee_info
DROP TABLE IF EXISTS normalization.surveyee_info;
CREATE TABLE normalization.surveyee_info(
surveyee_id INTEGER NOT NULL,
relationship_status VARCHAR(30),
occupation_status VARCHAR(30),
is_media_user BOOLEAN,
media_usage VARCHAR(5),
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
sleep_frequency INTEGER,
survey_city VARCHAR(30),
PRIMARY KEY (surveyee_id)
);
INSERT INTO normalization.surveyee_info(surveyee_id, relationship_status, 
occupation_status, is_media_user, media_usage, purpose_frequency, distraction_frequency, 
restless_amount, distraction_amount, worried_amount, concentration_amount, 
comparison_frequency, comparison_amount, validation_frequency, 
depression_frequency, fluctuation_frequency, sleep_frequency, survey_city)
SELECT DISTINCT s.surveyee_id, fn.relationship_status, fn.occupation_status, 
fn.is_media_user, fn.media_usage, fn.purpose_frequency, fn.distraction_frequency, 
fn.restless_amount, fn.distraction_amount, fn.worried_amount, 
fn.concentration_amount, fn.comparison_frequency, fn.comparison_amount, 
fn.validation_frequency, fn.depression_frequency, fn.fluctuation_frequency, 
fn.sleep_frequency, 'Plainsville' AS survey_city
FROM normalization.first_normal AS fn
INNER JOIN normalization.surveyees AS s ON s.survey_timestamp=fn.survey_timestamp AND s.age=fn.age AND s.gender=fn.gender;
-- surveyee_affiliations
DROP TABLE IF EXISTS normalization.surveyee_affiliations;
CREATE TABLE normalization.surveyee_affiliations(
surveyee_id INTEGER NOT NULL,
affiliation_num INTEGER NOT NULL,
affiliation VARCHAR(30),
PRIMARY KEY (surveyee_id, affiliation_num)
);
INSERT INTO normalization.surveyee_affiliations(surveyee_id, affiliation_num, affiliation)
SELECT DISTINCT s.surveyee_id, fn.affiliation_num, fn.affiliation
FROM normalization.first_normal AS fn
INNER JOIN normalization.surveyees AS s ON s.survey_timestamp=fn.survey_timestamp AND s.age=fn.age AND s.gender=fn.gender;
-- surveyee_platforms
DROP TABLE IF EXISTS normalization.surveyee_platforms;
CREATE TABLE normalization.surveyee_platforms(
surveyee_id INTEGER NOT NULL,
platform_num INTEGER NOT NULL,
platform VARCHAR(30),
PRIMARY KEY (surveyee_id, platform_num)
);
INSERT INTO normalization.surveyee_platforms(surveyee_id, platform_num, platform)
SELECT DISTINCT s.surveyee_id, fn.platform_num, fn.platform
FROM normalization.first_normal AS fn
INNER JOIN normalization.surveyees AS s ON s.survey_timestamp=fn.survey_timestamp AND s.age=fn.age AND s.gender=fn.gender;
-- survey_responses
DROP TABLE IF EXISTS normalization.survey_responses;
CREATE TABLE normalization.survey_responses(
surveyee_id INTEGER NOT NULL,
affiliation_num INTEGER NOT NULL,
platform_num INTEGER NOT NULL,
PRIMARY KEY (surveyee_id, affiliation_num, platform_num)
);
INSERT INTO normalization.survey_responses(surveyee_id, affiliation_num, platform_num)
SELECT DISTINCT s.surveyee_id, fn.affiliation_num, fn.platform_num
FROM normalization.first_normal AS fn
INNER JOIN normalization.surveyees AS s ON s.survey_timestamp=fn.survey_timestamp AND s.age=fn.age AND s.gender=fn.gender;
/*
Cleanup and rename schemas
*/
DROP SCHEMA IF EXISTS data_backup CASCADE;
ALTER SCHEMA normalization RENAME TO data_backup;
ALTER TABLE data_backup.first_normal RENAME TO plainsville_raw;
/*
Creating and inserting into prod
*/
-- surveyees
CREATE TABLE IF NOT EXISTS surveyees(
surveyee_id SERIAL NOT NULL,
survey_timestamp TIMESTAMP NOT NULL,
age INTEGER NOT NULL,
gender VARCHAR(30),
PRIMARY KEY (surveyee_id)
);
INSERT INTO surveyees
SELECT DISTINCT * FROM data_backup.surveyees
ON CONFLICT (surveyee_id) DO UPDATE SET 
survey_timestamp=EXCLUDED.survey_timestamp, age=EXCLUDED.age, gender=EXCLUDED.gender;
-- surveyee_info
CREATE TABLE IF NOT EXISTS surveyee_info(
surveyee_id INTEGER NOT NULL,
relationship_status VARCHAR(30),
occupation_status VARCHAR(30),
is_media_user BOOLEAN,
media_usage VARCHAR(5),
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
sleep_frequency INTEGER,
survey_city VARCHAR(30),
PRIMARY KEY (surveyee_id)
);
INSERT INTO surveyee_info
SELECT DISTINCT * FROM data_backup.surveyee_info
ON CONFLICT (surveyee_id) DO UPDATE SET relationship_status=EXCLUDED.relationship_status, 
occupation_status=EXCLUDED.occupation_status, is_media_user=EXCLUDED.is_media_user, media_usage=EXCLUDED.media_usage, 
purpose_frequency=EXCLUDED.purpose_frequency, distraction_frequency=EXCLUDED.distraction_frequency, 
restless_amount=EXCLUDED.restless_amount, distraction_amount=EXCLUDED.distraction_amount, 
worried_amount=EXCLUDED.worried_amount, concentration_amount=EXCLUDED.concentration_amount, 
comparison_frequency=EXCLUDED.comparison_frequency, comparison_amount=EXCLUDED.comparison_amount, 
validation_frequency=EXCLUDED.validation_frequency, depression_frequency=EXCLUDED.depression_frequency, 
fluctuation_frequency=EXCLUDED.fluctuation_frequency, sleep_frequency=EXCLUDED.sleep_frequency, 
survey_city=EXCLUDED.survey_city;
-- surveyee_affiliations
CREATE TABLE IF NOT EXISTS surveyee_affiliations(
surveyee_id INTEGER NOT NULL,
affiliation_num INTEGER NOT NULL,
affiliation VARCHAR(30),
PRIMARY KEY (surveyee_id, affiliation_num)
);
INSERT INTO surveyee_affiliations
SELECT DISTINCT * FROM data_backup.surveyee_affiliations
ON CONFLICT (surveyee_id, affiliation_num) DO UPDATE SET affiliation=EXCLUDED.affiliation;
-- surveyee_platforms
CREATE TABLE IF NOT EXISTS surveyee_platforms(
surveyee_id INTEGER NOT NULL,
platform_num INTEGER NOT NULL,
platform VARCHAR(30),
PRIMARY KEY (surveyee_id, platform_num)
);
INSERT INTO surveyee_platforms
SELECT DISTINCT * FROM data_backup.surveyee_platforms
ON CONFLICT (surveyee_id, platform_num) DO UPDATE SET platform=EXCLUDED.platform;
-- survey_responses
CREATE TABLE IF NOT EXISTS survey_responses(
surveyee_id INTEGER NOT NULL,
affiliation_num INTEGER NOT NULL,
platform_num INTEGER NOT NULL,
PRIMARY KEY (surveyee_id, affiliation_num, platform_num)
);
INSERT INTO survey_responses
SELECT DISTINCT * FROM data_backup.survey_responses
ON CONFLICT(surveyee_id, affiliation_num, platform_num) DO NOTHING;
END; $$