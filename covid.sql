

CREATE TABLE state(state_id	INTEGER,state_name	TEXT,population	INTEGER);
INSERT INTO state(state_id,state_name,population) VALUES
(1,'andhre','5cr'),
(2,'telangana','3cr'),
(3,'tamilnaadu','7cr'),
(4,'assam','2cr');
SELECT* FROM state;

CREATE TABLE district(district_id	INTEGER,district_name	TEXT,state_id	INTEGER,
cases	INTEGER,cured	INTEGER,active	INTEGER,deaths	INTEGER);

INSERT INTO district(district_id,district_name,state_id,cases,cured,active,deaths)VALUES
(1,'prakasham',1,100,90,5,5),
(2,'nellore',1,200,150,40,10),
(3,'medchal',2,500,400,70,30),
(4,'mahabalipuram',3,70,60,7,3);
SELECT * FROM district;

