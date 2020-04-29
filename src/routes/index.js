const { Router } = require('express');
const router = Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage: storage});

const { obtenerActores, obtenerActorPorID, agregarActor, editarActor, eliminarActor, obtenerPeliculas, obtenerPeliculaPorID, agregarPelicula, editarPelicula, eliminarPelicula, obtenerActPelis, obtenerActPelisByIDActor, obtenerActPelisByIDPelicula, insertarActorPelicula } = require('../controller/index.controller');

router.get('/actores', obtenerActores);
router.get('/actores/:id', obtenerActorPorID);
router.post('/actores', upload.single('foto'), agregarActor);
router.put('/actores/:id', upload.single('foto'), editarActor);
router.delete('/actores/:id', eliminarActor);
router.get('/peliculas', obtenerPeliculas);
router.get('/peliculas/:id', obtenerPeliculaPorID);
router.post('/peliculas', upload.single('foto'), agregarPelicula);
router.put('/peliculas/:id', upload.single('foto'), editarPelicula);
router.delete('/peliculas/:id', eliminarPelicula);
router.get('/actpelis', obtenerActPelis);
router.get('/actpelis/idactor/:id', obtenerActPelisByIDActor);
router.get('/actpelis/idpelicula/:id', obtenerActPelisByIDPelicula);
router.post('/actpelis/:idactor/:idpelicula', insertarActorPelicula);

module.exports = router;