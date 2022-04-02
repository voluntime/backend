-- Filters:
    -- Location
    -- Date
    -- Type

-- get user with username
SELECT USERNAME, NAME, ZIPCODE, ORGANIZATION, VERIFIED, BIO FROM VOLUNTEER WHERE USERNAME = $1;

-- get post with id
SELECT * FROM POST WHERE ID = $1;

-- get all posts with filters
SELECT P.*, COUNT(V.VOLUNTEER) VOLUNTEERS, COUNT(L.VOLUNTEER) LIKES FROM POST P NATURAL JOIN VOLUNTEERED V NATURAL JOIN POST_LIKE L WHERE ID = $1 GROUP BY P.ID ;
