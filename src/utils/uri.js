/**
 * Class For URI String.
 * For Expanding Future Functionality.
 */
class MarvelAPI {
  baseURI = 'https://gateway.marvel.com:443/v1/public/';
  makeURI(apiName, query, value, ts, publicKey, hash) {
    return (
      this.baseURI +
      apiName +
      `?${query}=${value}&ts=${ts}&apikey=${publicKey}&hash=${hash}`
    );
  }
}
export default MarvelAPI;
