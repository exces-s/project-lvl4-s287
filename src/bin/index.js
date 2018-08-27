import app from '..';

const port = process.env.PORT || 5000;
console.log(port);

app.listen(port, () => console.log('Server Start'));
