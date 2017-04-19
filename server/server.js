import 'babel-polyfill';
import express from 'express';
import Acho from 'acho';
import path from 'path';

const app = express();
const acho = Acho({
  outputType: type => (`[${type}] » `),
  outputMessage: message => (`${Date()} :: ${message}`)
});
let port;

if (process.env.NODE_ENV === 'production') {
  acho.color = false;
  acho.level = 'info';
  port = process.env.PORT;
  const WEB_DIR = path.join(__dirname, 'public');

  app.use(express.static(WEB_DIR));

  app.get('*', (req, res) => {
    res.sendFile(path.join(WEB_DIR, 'index.html'));
  });
} else {
  acho.color = true;
  acho.level = 'debug';
  port = process.env.APIPORT;
  app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the LibreDMS API Server');
  });
  app.get('/api', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is where the API is hosted');
  });
}

const server = app.listen(port, () => {
  acho.info('LibreDMS API Server listening at http://%s:%s',
    server.address().address, server.address().port);
});

export default server;
