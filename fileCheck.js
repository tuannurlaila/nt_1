// middlewares/fileCheck.js
const path = require('path');
const fs = require('fs');
const config = require('../config');

function checkPageExists(req, res, next) {
    const pageNumber = req.params.number;
    const filePath = path.join(config.pagesPath, `page${pageNumber}.html`);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.status(404).send(`Page ${pageNumber} not found`);
            return;
        }
        next();
    });
}

module.exports = { checkPageExists };