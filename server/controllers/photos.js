import axios from 'axios';
import btoa from 'btoa';

export default {
  /**
   * Method that gets a random photo from Unsplash
   * @param {Object} req The request from the client
   * @param {Object} res The response from the server
   * @returns {void}
   */
  random(req, res) {
    const width = req.query.width || 1280;
    const height = req.query.height || 800;
    const type = req.query.type || 'nature';

    axios({
      method: 'get',
      url: `https://source.unsplash.com/random/${width}x${height}/?${type}`,
      responseType: 'arraybuffer'
    })
    .then((response) => {
      const arr = new Uint8Array(response.data);
      let raw = '';
      arr.forEach((charCode) => {
        raw += String.fromCharCode(charCode);
      });
      return res.status(200).json({
        uri: `data:image/jpeg;base64,${btoa(raw)}`
      });
    }, error => (
      res.status(500).json({
        message: 'Could not retrieve photo from Unsplash',
        error
      })
    ));
  }
};
