/*
    Convert raw data to first normal form
*/
DROP TABLE IF EXISTS normalization.first_normal;
CREATE TABLE normalization.first_normal AS (
	SELECT 
    survey_timestamp, age, 
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
    distraction_amount, worried_amount, concentration_amount, comparison_frequency, comparison_amount, validation_frequency, 
    depression_frequency, fluctuation_frequency, sleep_frequency
    FROM raw.plainsville, UNNEST(STRING_TO_ARRAY(platforms, ', ')) WITH ORDINALITY AS U1 (platform, platform_num),
    UNNEST(STRING_TO_ARRAY(affiliations, ', ')) WITH ORDINALITY AS U2 (affiliation, affiliation_num)
);