require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');

const server = express();
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

server.use(express.static('public'));
server.use(express.urlencoded({ extended: false }));
server.locals.attendees = [];
server.locals.numberOfAttendees = 0;

// Set up view engine
server.engine('html', async (filePath, options, callback) => {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        let renderedContent = content.toString();
        const arr = ['settings', '_locals', 'cache'];
        for (const op in options) {
            if (arr.indexOf(`${op}`) === -1) {
                const subContent = renderedContent.replace(
                    `{{${op}}}`,
                    `${options[op]}`,
                );
                renderedContent = subContent;
            }
        }
        return callback(null, renderedContent);
    } catch (err) {
        return callback(err);
    }
});
server.set('views', './views');
server.set('view engine', 'html');

// Routing
server.get('/', (req, res) => {
    res.render('index', {
        title: 'Hội nghị ABC',
        heading: 'Trang giới thiệu thông tin về hội nghị',
    });
});
server.get('/register', (req, res) => {
    res.render('register', {
        title: 'Trang đăng ký thông tin tham gia',
        heading: 'Form đăng ký thông tin',
    });
});
server.post('/register', (req, res) => {
    const { name, email, phoneNumber } = req.body;
    const id = server.locals.numberOfAttendees + 1;
    const attendee = {
        id,
        name,
        email,
        phoneNumber,
    };

    server.locals.attendees.push(attendee);
    server.locals.numberOfAttendees++;
    res.end();
});

// Start the server
server.listen(port, () => {
    console.log(`Server is listening on ${hostname}:${port}.`);
});
