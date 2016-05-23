-- Total mood disorders
SELECT SUM(cast("Hospitalization No." as float)) AS total
FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012
WHERE "Hospitalization Rate" <> '§' AND "Hospitalization Rate" <> '‐‐‐'

-- Mood disorders by year
SELECT "Year", SUM(cast("Hospitalization No." as float)) AS total
FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012
WHERE "Hospitalization Rate" <> '§' AND "Hospitalization Rate" <> '‐‐‐'
GROUP BY "Year"

-- AVG hospitalization rate per race per year
SELECT "Year" AS year, "Race" AS race, AVG(cast("Hospitalization Rate" as float)) AS rate
FROM cogs121_16_raw.hhsa_mood_disorders_by_race_2010_2012
WHERE "Hospitalization Rate" <> '§' AND "Hospitalization Rate" <> '‐‐‐'
GROUP BY "Year", "Race"
ORDER BY "Year" ASC, "Race" ASC

-- Race data per area
SELECT "Area" AS area, "Race" AS race, SUM("Population") AS population
FROM cogs121_16_raw.hhsa_san_diego_demographics_county_popul_by_race_2012_norm
GROUP BY "Area", "Race"
ORDER BY "Area" ASC, "Race" ASC
