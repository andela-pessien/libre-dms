import 'babel-polyfill';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

let port;

routes(app);

switch (process.env.NODE_ENV) {
  case 'production':
    port = process.env.PORT;
    app.use(morgan('tiny'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(path.join(__dirname, 'public'), 'index.html'));
    });
    break;

  default:
    port = process.env.APIPORT;
    app.use(morgan('dev'));
    app.get('/', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Welcome to the LibreDMS API Server');
    });
}

const server = app.listen(port, () => {
  console.log('LibreDMS API Server listening on', port);
});

export default server;
