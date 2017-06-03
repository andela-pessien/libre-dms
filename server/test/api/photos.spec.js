import request from 'supertest';
import base64Img from 'base64-img';
import sizeOf from 'image-size';
import server from '../../server';

describe('Photos controller', () => {
  const app = request(server);

  it('should retrieve an Unsplash photo on request', (done) => {
    app
      .get('/api/photo')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body.uri) {
          throw new Error('Expected photo uri to be returned');
        }
        base64Img.img(
          res.body.uri,
          '',
          'randomUnsplashPhoto',
          (decodeError, imageFilePath) => {
            if (decodeError) {
              throw new Error(
                'Expected a valid base64 encoded image to be retrieved'
              );
            }
            const photoDimensions = sizeOf(imageFilePath);
            if (
            photoDimensions.width !== 1280 ||
            photoDimensions.height !== 800) {
              throw new Error('Expected a default resolution of 1280x800');
            }
            done();
          });
      });
  });

  it('should retrieve a photo with the requested dimensions', (done) => {
    app
      .get('/api/photo?width=720&height=1280&type=landscape')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        if (!res.body.uri) {
          throw new Error('Expected photo uri to be returned');
        }
        base64Img.img(
          res.body.uri,
          '',
          'randomUnsplashPhoto',
          (decodeError, imageFilePath) => {
            if (decodeError) {
              throw new Error(
                'Expected a valid base64 encoded image to be retrieved'
              );
            }
            const photoDimensions = sizeOf(imageFilePath);
            if (
            photoDimensions.width !== 720 ||
            photoDimensions.height !== 1280) {
              throw new Error('Expected resolution to be 720x1280');
            }
            done();
          });
      });
  });
});
