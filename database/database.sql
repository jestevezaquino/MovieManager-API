-- DDL --

create database PeliculasAPI;

create table Actores(
    IDAct serial,
    Nombre text,
    Nacimiento date,
    Sexo char,
    Foto text,
    constraint pk_actores primary key(IDAct),
    constraint ck_sexo check(sexo in('M','F'))
);

create table Peliculas(
    IDPeli serial,
    Titulo text,
    Genero text,
    Estreno date,
    Foto text,
    constraint pk_peliculas primary key(IDPeli),
    constraint idx_titulo UNIQUE(Titulo)
);

create table ActoresPeliculas(
    IDActor int,
    IDPelicula int,
    constraint pk_ActoresPeliculas primary key(IDActor, IDPelicula),
    constraint fk_IDActor foreign key(IDActor) references Actores(IDAct),
    constraint fk_IDPeliculas foreign key (IDPelicula) references Peliculas(IDPeli) 
);

-- DML --

insert into actores(nombre,nacimiento,sexo,foto) 
values ('Jesús Estévez','1999-03-09','M','src/jesus.jpg'), ('Daysi Aquino','1965-09-13','F','src/daysi.jpg');

insert into peliculas(titulo,genero,estreno,foto) 
values('La Mascara', 'Comedia', '1998-04-03', 'asdf'), ('Bad Boys', 'Acción', '2006-02-01', 'fdsa');