const express = require('express');
const fs = require('fs/promises');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`The app is listening on ${PORT}`);
});

// Configure the template engine
app.engine('html', async (filePath, options, callback) => {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const rendered = content
            .toString()
            .replace('{{author}}', `${options.author}`)
            .replace('{{message}}', `${options.message}`);
        return callback(null, rendered);
    } catch (err) {
        callback(err);
    }
});
app.set('view engine', 'html');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Routing
app.get('/', (req, res) => {
    res.render('index', { author: 'Lưu Thiên Vĩ' });
});

app.post('/calculate', (req, res) => {
    const number1 = parseFloat(req.body.number1);
    const number2 = parseFloat(req.body.number2);
    const operation = req.body.operations;

    let outcome = 0;
    switch (operation) {
        case 'add': {
            outcome = number1 + number2;
            break;
        }
        case 'subtract': {
            outcome = number1 - number2;
            break;
        }
        case 'multiply': {
            outcome = number1 * number2;
            break;
        }
        case 'divide': {
            outcome = number1 / number2;
            break;
        }
    }
    app.locals.result = { number1, number2, outcome, operation };
    res.redirect('/');
});

app.get('/data', (req, res) => {
    const data = req.app.locals.result;
    res.json(data);
});
