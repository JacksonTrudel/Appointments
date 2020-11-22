# SQL commands to create and populate the MySQL database for
# COP 4331 Appointment Scheduling Project
#
# delete the database if it already exists
drop database if exists AppointmentSystem;

#create a new database named COP4710
create database AppointmentSystem;

#switch to the new database
use AppointmentSystem;


#create the schemas for the four relations in this database
create table workday (
  wId integer auto_increment,
  wDate date not null,
  wOpenTime time not null,
  wCloseTime time not null,
  index(wId)
);

create table customer (
  cId integer auto_increment,
  cFirst_name varchar(40) not null,
  cLast_name varchar(50) not null,
  cPhone varchar(10) not null,
  cEmail varchar(40) not null,
  index(cId)
);

create table appointment (
  aId integer auto_increment,
  aClient_id integer not null,
  aWorkday_id integer,
  aSubject varchar(40) not null,
  aNotes varchar(120) not null,
  aStartTime time,
  aEndTime time,
  aValid boolean not null,
  foreign key (aClient_id) references customer(cId),
  foreign key (aWorkday_id) references workday(wId),
  index(aId)
);

create table availabilityBlackout (
  aId integer auto_increment,
  aWorkday_id integer not null,
  aStartTime time not null,
  aEndTime time not null,
  index(aId)
);

# Dictionary for dDayKey:
#             1 - Sunday
#             2 - Monday
#             3 - Tuesday
#             ...
#             6 - Friday
#             7 - Saturday
create table defaultAvailabilityDay (
  dDayKey integer not null,
  dStartTime time not null,
  dEndTime time not null,
  dUnavailable boolean not null,
  index(dDayKey)
);

create table duration (
	dLength integer not null
);