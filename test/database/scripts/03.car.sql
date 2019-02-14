--------------------------------
-- car schema and tables
--------------------------------

CREATE SCHEMA "car";

CREATE SEQUENCE "car".car_id_seq;

CREATE OR REPLACE FUNCTION "car".car_id
(OUT result bigint) AS $$
DECLARE
  our_epoch bigint := 1466352806721;
  seq_id bigint;
  now_millis bigint;
  shard_id int := 0;
BEGIN
  SELECT nextval('"car".car_id_seq') % 128
  INTO seq_id;
  SELECT FLOOR(EXTRACT(EPOCH FROM current_timestamp) * 1000)
  INTO now_millis;
  result :=
  (now_millis - our_epoch) << 12; 
result := result |
(shard_id << 7);
  result := result |
(seq_id);
END;
$$ LANGUAGE PLPGSQL;

--------------------------------
-- car notes:
--------------------------------

CREATE TABLE "car".car
(
  id BIGINT NOT NULL DEFAULT "car".car_id(),
  car_name VARCHAR NOT NULL,
  owner_id BIGINT,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
