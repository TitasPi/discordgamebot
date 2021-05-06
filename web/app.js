const express = require('express');
const path = require('path');
const app = express();
const PORT = 2020;
const IP = '0.0.0.0';

exports.start = function() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => {
        res.render('main', { title: 'Main Page' });
    });

    app.listen(PORT, IP, () => {
        console.log(`Web Server is running at: http://${IP}:${PORT}`);
    });
};