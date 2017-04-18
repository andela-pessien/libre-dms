import 'babel-polyfill';
import express from 'express';
import Acho from 'acho';

const app = express();
const acho = Acho({
  outputType: type => (`[${type}] » `),
  outputMessage: message => (`${Date()} :: ${message}`)
});

if (process.env.NODE_ENV === 'development') {
  acho.color = true;
  acho.level = 'debug';
} else {
  acho.color = false;
  acho.level = 'info';
}

app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('LibreDMS API Server\n');
});

const server = app.listen(process.env.APIPORT || process.env.PORT, () => {
  acho.info('LibreDMS API Server listening at http://%s:%s',
    server.address().address, server.address().port);
});

export default server;
