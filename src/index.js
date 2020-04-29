const express = require('express');
const cors = require('cors');
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));
app.use(cors());

// routes
app.use(require('./routes/index'));

app.listen(4000);
console.log('Server on port 4000');