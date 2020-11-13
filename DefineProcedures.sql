use appointmentsystem;

drop procedure if exists createCustomer;
drop procedure if exists createAppointment;
delimiter $$
# insert customer information into database and return their ID
create procedure createCustomer(
	in _first varchar(40),
    in _last varchar(50),
	in _phone varchar(10),
	in _email varchar(40)
)
	begin
		declare id integer;

		insert into customer (cFirst_name, cLast_name, cPhone, cEmail)
        values (_first, _last, _phone, _email);

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
								aStartTime, aEndTime, aValid )
		values (_cust_id, -1, _subject, _notes, "11:59","11:59",false);
        
        select aId as appointment_id
        from appointment
        where aClient_id = _cust_id and aNotes = _notes and aSubject = _subject;
    end$$
    
delimiter ;

call createCustomer("Lebron", "James", "8139907713","emas@sd.com")
call createAppointment(3, "none", "none");
select * from appointment; 
