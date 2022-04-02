-- Voluntime

-- volunteer
create table if not exists volunteer(
    username        text not null,
    name            text not null,
    email           text not null unique,
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
    volunteer       text not null,
    organization    text,
    title           text not null,
    body            text not null,
    event_location  text not null,
    event_type      text not null,
    goal            int,

    foreign key (volunteer) references volunteer (username),
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
    fufilled        bool default false,

    foreign key (volunteer) references volunteer (username),
    foreign key (post) references post (id),
    primary key (volunteer, post)
);