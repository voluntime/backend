-- Voluntime

-- volunteer
create table if not exists volunteer(
    username        text not null,
    name            text not null,
    email           text not null unique,
    password        text not null,
    zipcode         int not null,
    organization    text,
    verified        bool default false,
    bio             text,

    primary key (username)
);

-- Post
create table if not exists post(
    id              int generated always as identity,
    created         timestamp not null,
    begins          timestamp not null,
    ends            timestamp not null,
    organizer       text not null,
    organization    text,
    title           text not null,
    body            text not null,
    event_location  text not null,
    event_type      text not null,
    goal            int not null,

    foreign key (organizer) references volunteer (username),
    primary key (id)
);

-- Post like
create table if not exists post_like(
    volunteer       text,
    post            int,

    foreign key (volunteer) references volunteer (username),
    foreign key (post) references post (id),
    primary key (volunteer, post)
);

-- Interaction with post
create table if not exists volunteered(
    volunteer       text,
    post            int,
    comment         text,
    fufilled        bool default false,

    foreign key (volunteer) references volunteer (username),
    foreign key (post) references post (id),
    primary key (volunteer, post)
);

-- Event type 'Enum'
create table if not exists event_type(
    event_type      text,

    primary key(event_type)
);

-- Insert enumerated types
insert into event_type values('Service') on conflict do nothing;
insert into event_type values('Good') on conflict do nothing;


drop view if exists full_post;
create view full_post as select p.*, o.name, o.verified, count(v.volunteer) volunteers, count(l.volunteer) likes from post p join volunteer o on o.username = p.organizer left join volunteered v on v.post = p.id left join post_like l on l.post = p.id group by p.id, o.username;