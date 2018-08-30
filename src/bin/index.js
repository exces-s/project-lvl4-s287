import app from '..';

const port = process.env.PORT;
console.log(port);

app.listen(port, () => console.log('Server Start'));
