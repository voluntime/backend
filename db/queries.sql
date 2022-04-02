-- get user with username
SELECT USERNAME, NAME, ZIPCODE, ORGANIZATION, VERIFIED, BIO FROM VOLUNTEER WHERE USERNAME = $1;

-- get post with id
SELECT * FROM FULL_POST WHERE ID = $1;

-- get post via id
select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1, l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1, v.volunteer = $2) as volunteered from full_post p where p.id = $1;

-- Get all events:
    -- Location?

    -- on a specific DAY
    select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.begins::date = date $3;

    -- with an  event_type of
    select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.event_type = $3;

    -- with a duration less than or equal to
    select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.ends - p.begins <= INTERVAL $3;
