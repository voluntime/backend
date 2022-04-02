-- get user with username
SELECT USERNAME, NAME, ZIPCODE, ORGANIZATION, VERIFIED, BIO FROM VOLUNTEER WHERE USERNAME = $1;

-- get post with id
SELECT * FROM FULL_POST WHERE ID = $1;

-- get post via id
select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1, l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1, v.volunteer = $2) as volunteered from full_post p where p.id = $1;


<<<<<<< HEAD
=======
    -- on a specific DAY
    select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.begins::date = date $3;
>>>>>>> 3c3dc165e30534fe808b4dac64b3d1c8bb14f79a

-- -- Get all events:
-- select *, TRUE as like from full_post fp
--     where exists(select 1 from post_like where post = fp.id)
-- UNION
-- select *, FALSE as like from full_post fp
--     where not exists(select 1 from post_like where post = fp.id);

--     -- Location?

--     -- on a specific DAY
--     select *, exists(select 1 from full_post fp join post_like l on fp.id = l.post where l.volunteer = 'adam') as like, exists(select 1 from full_post join volunteered v on id = v.post where v.volunteer = 'adam') as volunteered from full_post p where fp.id = p.id and p.begins::date = date 'today';

--     -- with an  event_type of
--     select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.event_type = $3;

--     -- with a duration less than or equal to
--     select *, exists(select 1 from full_post join post_like l on id = l.post where id = $1 and l.volunteer = $2) as like, exists(select 1 from full_post join volunteered v on id = v.post where id = $1 and v.volunteer = $2) as volunteered from full_post p where p.ends - p.begins <= INTERVAL $3;



-- select *,
--     exists(select 1 from full_post fp join post_like l on fp.id = l.post where l.volunteer = 'adam') as like,
--     exists(select 1 from full_post join volunteered v on id = v.post where v.volunteer = 'adam') as volunteered 
--     from full_post p where fp.id = p.id and p.begins::date = date 'today';



-- GET IF A PERSON HAS LIKED OR VOLUNTEERED FOR A POST
select full_post.*, v.volunteered, l.liked from
(
    select id, TRUE as liked from full_post fp
        where exists(select 1 from post_like where post = fp.id and post_like.volunteer = $1)
    union
    select id, FALSE as liked from full_post fp
        where not exists(select 1 from post_like where post = fp.id and post_like.volunteer = $1)
) l
join
(
    select id, TRUE as volunteered from full_post fp
        where exists(select 1 from volunteered where post = fp.id and volunteered.volunteer = $1)
    union
    select id, FALSE as volunteered from full_post fp
        where not exists(select 1 from volunteered where post = fp.id and volunteered.volunteer = $1)
) v
on l.id = v.id join full_post on l.id = full_post.id;