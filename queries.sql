-- Percent of poulation in region
SELECT t1."Education", cast(SUM("Population") as float)/(Total population 444706  ) * 100
FROM cogs121_16_raw.hhsa_san_diego_demographics_education_2012_norm t1
WHERE t1."Area" = (Region 'Carlsbad')
GROUP BY t1."Education"

-- All areas and their populations for the education table
SELECT t1."Area", cast(SUM("Population") as float) AS total
FROM cogs121_16_raw.hhsa_san_diego_demographics_education_2012_norm t1
GROUP BY t1."Area"
