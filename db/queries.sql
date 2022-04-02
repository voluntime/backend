-- Filters:
    -- Location
    -- Date
    -- Type

-- get user with username
SELECT USERNAME, NAME, ZIPCODE, ORGANIZATION, VERIFIED, BIO FROM VOLUNTEER WHERE USERNAME = $1;

-- get post with id
SELECT * FROM FULL_POST WHERE ID = $1;

-- get post via id
-- select * from full_post p full outer join post_like l on l.post = p.id full outer join volunteered v on v.post = p.id and v.volunteer = l.volunteer where v.volunteer = 'adam' and p.id = 1;

-- get via filter
