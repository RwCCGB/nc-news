const app = require('./app.js');

app.listen(9090, (err) => { 
    if (err) {
        console.log(`Error:`, err);
    } else { 
        console.log(`listening on 9090`);
    }
})