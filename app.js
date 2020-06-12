const morgan = require('morgan');
const express = require('express');

const app = express();
const store = require('./store.js');
const cors = require('cors');

app.use(morgan('common'));

app.use(cors());

app.get('/apps', (req, res) => {

    const { search = "", genres = "", sort = ""} = req.query;

    if(sort){
        if(!['Rating', 'App'].includes(sort)){
            return res
                .status(400)
                .send('Sort must be Rating or App');
        }
    }

    if(genres){
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
            return res
            .status(400)
            .send('Genre must be Action, Puzzle, Strategy, Casual, Arcade or Card')
        }
    }
    
    let results = store
        .filter(app => app
                        .App
                        .toLowerCase()
                        .includes(search.toLowerCase()));


    if(sort === 'Rating'){
        results.sort((a, b) => {
            return a[sort] > b[sort] ? -1 : a[sort] < b[sort] ? 1 : 0;
        })
    }

    if(sort === 'App'){
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        })
    }

    if(genres){
        console.log(genres)
        results = results.filter(app => app.Genres.includes(genres))
    }

    res.json(results)
                                        
})

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
})