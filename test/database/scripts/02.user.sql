--------------------------------
-- user schema and tables
--------------------------------

CREATE SCHEMA "user";

CREATE SEQUENCE "user".user_id_seq;

CREATE OR REPLACE FUNCTION "user".user_id
(OUT result bigint) AS $$
DECLARE
  our_epoch bigint := 1466352806721;
  seq_id bigint;
  now_millis bigint;
  shard_id int := 0;
BEGIN
  SELECT nextval('"user".user_id_seq') % 128
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
-- user notes:
--------------------------------

CREATE TABLE "user".user
(
  id BIGINT NOT NULL DEFAULT "user".user_id(),
  username VARCHAR,
  password VARCHAR,
  id_token VARCHAR,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".user
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

--------------------------------
-- profile notes:
--------------------------------

CREATE TABLE "user".profile
(
  user_id BIGINT NOT NULL REFERENCES "user".user,
  name VARCHAR,
  age INTEGER,
  lover_id BIGINT REFERENCES "user".user,
  car_id BIGINT,
  created bigint DEFAULT unix_now(),
  last_updated bigint DEFAULT unix_now(),
  PRIMARY KEY (user_id)
)
WITH (
  OIDS=FALSE
);

CREATE TRIGGER last_updated
  BEFORE UPDATE
  ON "user".profile
  FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();
