insert into volunteer(username, name, email, password, zipcode) values('trey_time', 'Trey Moen', 'trey@moen.ai', 'poop', 97132);
insert into volunteer(username, name, email, password, zipcode) values('adam', 'Adam Hearn', 'ahearn19@georgefox.edu', 'poop', 97132);
insert into volunteer(username, name, email, password, zipcode) values('blake', 'Blake Bryan', 'bbryan19@georgefox.edu', 'poop', 97132);

insert into post(created, begins, ends, organizer, title, body, event_location, event_type, goal) values (now(), now(), now(), 'trey_time', 'Help Adam Graduate', 'Please please please', 'Newberg, OR', 'Service', 1);

insert into post_like(post, volunteer) values(1, 'adam');
insert into volunteered(post, volunteer) values(1, 'adam');


select *, exists(select 1 from full_post join post_like l on id = l.post where id = 1 and l.volunteer = 'adam') as like, exists(select 1 from full_post join volunteered v on id = v.post where id = 1 and v.volunteer = 'adam') as volunteered from full_post p where p.id = 1;


