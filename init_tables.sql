insert into defaultAvailabilityDay (dDayKey, dStartTime, dEndTime, dUnavailable)
  values (0, "080000", "170000", true), (1, "080000", "170000", false), (2, "080000", "170000", false),
    (3, "080000", "170000", false), (4, "080000", "170000", false), (5, "080000", "170000", false), (6, "080000", "170000", true);

call createCustomer("Jackson", "Trudel", "8139902213","jtrudel22@gmail.com");

insert into duration (dLength) values (15), (30), (45), (60);

select * from customer;
select * from appointment;
select * from duration;