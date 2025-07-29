const app = require('./app.js');

const {PORT = 9090} = process.env

app.listen(PORT, () => console.log(`Listening on ${PORT}...`))
/*
app.listen(9090, (err) => { 
    if (err) {
        console.log(`Error:`, err);
    } else { 
        console.log(`listening on 9090`);
    }
})
    */