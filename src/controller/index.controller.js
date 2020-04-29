const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'peliculasapi',
    port: '5432'
});

// CRUD ACTORES

const obtenerActores = async (req, res)=>{
    const resultado = await pool.query('SELECT * FROM Actores a ORDER BY a.IDACT');
    res.status(200).json(resultado.rows);
}

const obtenerActorPorID = async(req, res)=>{
    const resultado = await pool.query('SELECT * FROM Actores WHERE IDAct = $1', [req.params.id]);
    res.status(200).json(resultado.rows);
}

const agregarActor = async (req, res)=>{
    try{
        console.log(req.file.path);

        let actor = req.body;

        const sqlTemplate = "INSERT INTO Actores (Nombre, Nacimiento, Sexo, Foto) values ($1, $2, $3, $4)";
        const parametros = [actor.nombre, actor.nacimiento, actor.sexo, req.file.path];
        await pool.query(sqlTemplate, parametros);
        res.status(200).json({
            message: "Se ha agregado el actor correctamente.",
            body: {
                actor: {
                    nombre: actor.nombre,
                    nacimiento: actor.nacimiento,
                    sexo: actor.sexo,
                    foto: req.file.path
                }
            }
        });
    }catch(err){
        console.log(err);
        fs.unlink(req.file.path, ()=>{console.log('Se ha eliminado la foto.')});
        res.status(406).json('Ha ocurrido un error.');
    }
}

const editarActor = async (req, res)=>{
    try{
        const resultado = await pool.query('SELECT * FROM Actores WHERE IDAct = $1', [req.params.id]);

        let actor = resultado.rows[0];
        actor.nombre = req.body.nombre;
        actor.nacimiento = req.body.nacimiento;
        actor.sexo = req.body.sexo;

        if(req.file === undefined)
        {
            const resultado = await pool.query('UPDATE Actores SET Nombre = $1, Nacimiento = $2, Sexo = $3 WHERE IDAct = $4', [
                actor.nombre,
                actor.nacimiento,
                actor.sexo,
                actor.idact
            ]);
            console.log(resultado);
            res.status(200).json(`Se ha editado el usuario con id ${actor.idact} correctamente.`);
        } 
        else{
            fs.unlink(actor.foto, ()=>{console.log('Se ha eliminado la foto antigua.')});
            const resultado = await pool.query('UPDATE Actores SET Nombre = $1, Nacimiento = $2, Sexo = $3, Foto = $4 WHERE IDAct = $5', [
                actor.nombre,
                actor.nacimiento,
                actor.sexo,
                req.file.path,
                actor.idact
            ]);
            console.log(resultado);
            res.status(200).json(`Se ha editado el usuario con id ${actor.idact} correctamente.`);
        }
    }
    catch(err){
        console.log(err);
        fs.unlink(req.file.path, ()=>{console.log('Se ha eliminado la foto.')});
        res.status(406).json('Ha ocurrido un error.');
    }
}

const eliminarActor = async (req, res)=>{
    try{
        let resultado = await pool.query('DELETE FROM ActoresPeliculas WHERE IDActor = $1', [req.params.id]);

        const actor = await pool.query('SELECT * FROM Actores WHERE IDAct = $1', [req.params.id]);
        fs.unlink(actor.rows[0].foto, ()=>{console.log('Se ha eliminado la foto del usuario ademas.')});

        resultado = await pool.query('DELETE FROM Actores WHERE IDAct = $1', [req.params.id]);
        console.log(resultado);
        res.status(200).json({
            message: "Se ha eliminado el actor correctamente."
        });
    } catch(err){
        console.log(err);
        res.status(406).json('Ha ocurrido un error.');
    }
}

// CRUD ACTORES

// CRUD PELICULAS

const obtenerPeliculas = async (req, res) => {
    const resultado = await pool.query('SELECT * FROM Peliculas ORDER BY IDPeli');
    res.status(200).json(resultado.rows);    
}

const obtenerPeliculaPorID = async (req, res) => {
    const resultado = await pool.query('SELECT * FROM Peliculas WHERE IDPeli = $1',[req.params.id]);
    res.status(200).json(resultado.rows);    
}

const agregarPelicula = async (req, res)=>{
    try{
        let pelicula = req.body;

        const sqlTemplate = "INSERT INTO Peliculas (Titulo, Genero, Estreno, Foto) values ($1, $2, $3, $4)";
        const parametros = [pelicula.titulo, pelicula.genero, pelicula.estreno, req.file.path];
        await pool.query(sqlTemplate, parametros);
        res.status(200).json({
            message: "Se ha agregado la pelicula correctamente.",
            body: {
                pelicula: {
                    titulo: pelicula.titulo,
                    genero: pelicula.genero,
                    estreno: pelicula.estreno,
                    foto: req.file.path
                }
            }
        });
    }catch(err){
        console.log(err);
        fs.unlink(req.file.path, ()=>{console.log('Se ha eliminado la foto.')});
        res.status(406).json('Ha ocurrido un error. Compruebe que otra pelicula no posea el titulo que introdujo.');
    }
}

const editarPelicula = async (req, res)=>{
    try{
        const resultado = await pool.query('SELECT * FROM Peliculas WHERE IDPeli = $1', [req.params.id]);

        let pelicula = resultado.rows[0];
        pelicula.titulo = req.body.titulo;
        pelicula.genero = req.body.genero;
        pelicula.estreno = req.body.estreno;

        if(req.file === undefined)
        {
            const resultado = await pool.query('UPDATE Peliculas SET Titulo = $1, Genero = $2, Estreno = $3 WHERE IDPeli = $4', [
                pelicula.titulo,
                pelicula.genero,
                pelicula.estreno,
                pelicula.idpeli
            ]);
            console.log(resultado);
            res.status(200).json(`Se ha editado la pelicula con id ${pelicula.idpeli} correctamente.`);
        } 
        else{
            fs.unlink(pelicula.foto, ()=>{console.log('Se ha eliminado la foto antigua.')});
            const resultado = await pool.query('UPDATE Peliculas SET Titulo = $1, Genero = $2, Estreno = $3, Foto = $4 WHERE IDPeli = $5', [
                pelicula.titulo,
                pelicula.genero,
                pelicula.estreno,
                req.file.path,
                pelicula.idpeli
            ]);
            console.log(resultado);
            res.status(200).json(`Se ha editado la pelicula con id ${pelicula.idpeli} correctamente.`);
        }
    }
    catch(err){
        console.log(err);
        fs.unlink(req.file.path, ()=>{console.log('Se ha eliminado la foto.')});
        res.status(406).json('Ha ocurrido un error.');
    }
}

const eliminarPelicula = async (req, res)=>{
    try{

        let resultado = await pool.query('DELETE FROM ActoresPeliculas WHERE IDPelicula = $1', [req.params.id]);

        const pelicula = await pool.query('SELECT * FROM Peliculas WHERE IDPeli = $1', [req.params.id]);
        fs.unlink(pelicula.rows[0].foto, ()=>{console.log('Se ha eliminado la foto del la pelicula.')});

        resultado = await pool.query('DELETE FROM Peliculas WHERE IDPeli = $1', [req.params.id]);
        console.log(resultado);
        res.status(200).json({
            message: "Se ha eliminado la pelicula correctamente."
        });
    } catch(err){
        console.log(err);
        res.status(406).json('Ha ocurrido un error.');
    }
}

// CRUD PELICULAS

// CONSULTAS A LA TABLA ActoresPeliculas (RELACION MUCHO-MUCHO)

const obtenerActPelis = async (req, res) => {
    const resultado = await pool.query('SELECT (IDActor, Nombre, IDPelicula, Titulo) FROM ActoresPeliculas AP JOIN Actores AC ON AP.IDActor = AC.IDAct JOIN Peliculas PC ON AP.IDPelicula = PC.IDPeli');
    console.log(resultado);
    res.status(200).json(resultado.rows);
}

const obtenerActPelisByIDActor = async (req, res) => {
    const resultado = await pool.query('SELECT (IDActor, Nombre, IDPelicula, Titulo) FROM ActoresPeliculas AP JOIN Actores AC ON AP.IDActor = AC.IDAct JOIN Peliculas PC ON AP.IDPelicula = PC.IDPeli WHERE AP.IDActor = $1', [req.params.id]);
    console.log(resultado);
    res.status(200).json(resultado.rows);
}

const obtenerActPelisByIDPelicula = async (req, res) => {
    const resultado = await pool.query('SELECT (IDActor, Nombre, IDPelicula, Titulo) FROM ActoresPeliculas AP JOIN Actores AC ON AP.IDActor = AC.IDAct JOIN Peliculas PC ON AP.IDPelicula = PC.IDPeli WHERE AP.IDPelicula = $1', [req.params.id]);
    console.log(resultado);
    res.status(200).json(resultado.rows);
}

const insertarActorPelicula = async (req, res) => {
    try{
        const resultado = await pool.query('INSERT INTO ActoresPeliculas VALUES($1,$2)',[req.params.idactor,req.params.idpelicula]);
        console.log(resultado);
        res.status(200).json('Se ingreso el registro correctamente.');
    } catch(err){
        console.log(err);
        res.status(406).json('Ocurrio un error. No se completo la accion.');
    }
}

// CONSULTAS A LA TABLA ActoresPeliculas (RELACION MUCHO-MUCHO)


module.exports = {
    obtenerActores,
    agregarActor,
    obtenerActorPorID,
    eliminarActor,
    editarActor,
    obtenerPeliculas,
    obtenerPeliculaPorID,
    agregarPelicula,
    editarPelicula,
    eliminarPelicula,
    obtenerActPelis,
    obtenerActPelisByIDActor,
    obtenerActPelisByIDPelicula,
    insertarActorPelicula
}