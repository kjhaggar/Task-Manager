const express = require('express');
const app = express();
const path = require('path');

var distDir = __dirname + "/dist/TMS";
app.use(express.static(distDir));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/TMS/index.html'));
});

app.listen(process.env.PORT || 4200, function(){
    console.log('Your client is running');
});
