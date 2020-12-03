use appointmentsystem;

drop procedure if exists createCustomer;
drop procedure if exists createAppointment;
drop procedure if exists getDefaultAvailability;
drop procedure if exists dateExists;
drop procedure if exists bookAppointment;
drop procedure if exists getAppointmentTimes;
drop procedure if exists searchAppointment;
drop procedure if exists changeAppointmentInformation;
drop procedure if exists viewAppointments;
delimiter $$
# insert customer information into database and return their ID
create procedure createCustomer(
	in _first varchar(40),
    in _last varchar(50),
	in _phone varchar(10),
	in _email varchar(40)
)
	begin
        if not exists (
			select *
			from customer
            where cFirst_name = _first and cLast_name = _last
				and  cPhone = _phone and cEmail = _email)
		then

			insert into customer (cFirst_name, cLast_name, cPhone, cEmail)
			values (_first, _last, _phone, _email);
		end if;
        
		select cId as customer_id
		from customer
		where cFirst_name = _first and cLast_name = _last
				and  cPhone = _phone and cEmail = _email;

    end$$

create procedure createAppointment (
	in _cust_id integer,
    in _subject varchar(40),
    in _notes varchar(120)
)
	begin
		insert into appointment(aClient_id, aWorkday_id, aSubject, aNotes,
								aStartTime, aEndTime, aValid, aCancelled )
		values (_cust_id, null, _subject, _notes, null,null,false, false);
        
        select aId as appointment_id
        from appointment
        where aClient_id = _cust_id and aNotes = _notes and aSubject = _subject;
    end$$
    
create procedure getDefaultAvailability() 
	begin
		select dDayKey as dayKey, dStartTime as startTime, 
		        dEndTime as endTime, dUnavailable as unavailable
		from defaultAvailabilityDay
        order by dDayKey ASC;
    end$$
    
create procedure dateExists(
	in _date date
) 
	begin
		declare _dayId integer;
       
		if exists (
			select *
            from workday 
            where wDate = _date)
         then
			select wId as id, 1 as exsts, DAYOFWEEK(_date) as dayOfWeek
			from workday
			where wDate = _date;
         else
			select DAYOFWEEK(_date) as dayOfWeek, 0 as exsts, -1 as id;
         end if;
         
	
    end$$

create procedure bookAppointment(
	in appt_id integer,
    in _date date,
    in _dayOfWeek integer,
    in _start time,
    in _end time
)
	begin
		declare _defaultStart time;
        declare _defaultEnd time;
        
                                    
		if exists (
			select 1
            from appointment 
            where aId = appt_id)
		then
			if not exists (
				select 1
                from Workday
                where wDate = _date
			)
            then
				set _defaultStart = (select dStartTime
				                    from defaultAvailabilityDay
									where dDayKey = _dayOfWeek);
				set _defaultEnd = (select dEndTime
				                    from defaultAvailabilityDay
									where dDayKey = _dayOfWeek);
                                    
				insert into Workday(wDate, wOpenTime, wCloseTime) 
                values (_date, _defaultStart, _defaultEnd);
            end if;
            
			if not exists (
				select 1 
                from appointment A, Workday W
                where 
					A.aValid = true and A.aCancelled = false and W.wDate = _date and A.aWorkday_id = W.wId
                    and  ((A.aStartTime + interval 5 minute > _start and A.aStartTime - interval 5 minute < _end)
                    or (A.aEndTime + interval 5 minute > _start and A.aEndTime - interval 5 minute < _end)
                    or (w.wOpenTime > _start or W.wCloseTime < _end))
            )
            then 
				update appointment 
                set aValid = 1, aStartTime = _start, aEndTime = _end, aWorkday_id = (select wId from Workday where wDate = _date)
                where aId = appt_id;
                
                select 1 as success, appt_id as id;
            else
				# conflicting appointment exists or the site-owner is unavailable
				select 0 as success;
			end if;
        else
			#booking information is not valid
			select 0 as success;
        end if;
            
    end$$
    
create procedure getAppointmentTimes (
	in _date date
)
	begin
		if exists (
			select 1
            from Workday W, Appointment A
			where W.wId = A.aWorkday_id and W.wDate = _date and A.aValid = true and A.aCancelled = false
		)
        then
			select W.wOpenTime as openTime, W.wCloseTime as closeTime, A.aStartTime as startTime, A.aEndTime as endTime, 1 as existsAppts
			from Workday W, Appointment A
			where W.wId = A.aWorkday_id and W.wDate = _date and A.aValid = true
            order by A.aStartTime asc;
		else
			select W.wOpenTime as openTime, W.wCloseTime as closeTime, 0 as existsAppts
			from Workday W
			where W.wDate = _date;
		end if;
    end$$

create procedure searchAppointment(
	in last_name varchar(50),
    in appt_id integer
) 
	begin
		select C.cFirst_name as _first, C.cLast_name as _last, C.cPhone as _phone,
               C.cEmail as _email, W.wDate as _date, A.aStartTime as _start, A.aEndTime as _end,
               A.aSubject as _subject, A.aNotes as _notes, A.aCancelled as _cancelled
        from Appointment A, Workday W, Customer C
        where C.cLast_name = last_name and C.cId = A.aClient_id and
			A.aId = appt_id and W.wId = A.aWorkday_id and A.aValid = true;
    end$$
    
create procedure changeAppointmentInformation(
	in appt_id integer,
    in _first varchar(40),
    in _last varchar(50),
    in _phone varchar(10),
    in _email varchar(40),
    in _subject varchar(40),
    in _notes varchar(120)
)
	begin
		UPDATE Appointment A, Customer C
        SET A.aSubject = _subject, A.aNotes = _notes, C.cFirst_name = _first,
             C.cLast_name = _last, C.cPhone = _phone, C.cEmail = _email
        WHERE A.aId = appt_id and A.aClient_id = C.cId and A.aValid = true;
        
        if (
			select 1 
            from Appointment A, Customer C
            Where A.aid = appt_id and A.aClient_id = C.cId and A.aSubject = _subject and A.aNotes = _notes and C.cFirst_name = _first and
             C.cLast_name = _last and C.cPhone = _phone and C.cEmail = _email
		)
        then
			select 1 as success;
		else 
			select 0 as success;
		end if;
    end$$
    
create procedure viewAppointments(
	in startDateInclusive date,
    in endDateExclusive date
)
	begin
		select *, dayofweek(W.wDate) as dayOfWeek
        from Workday W, Appointment A, Customer C
        where W.wId = A.aWorkday_id and A.aClient_id = C.cId and 
              W.wDate >= startDateInclusive and W.wDate < endDateExclusive and A.aCancelled = false
		order by W.wDate asc, A.aStartTime asc;
    end$$
    
delimiter ;

