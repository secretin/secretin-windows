import Secretin from 'secretin';
import { SecretinBrowserAdapter } from 'secretin/dist/adapters/browser';

const serverURI = process.env.REACT_APP_API_SECRETIN
  ? process.env.REACT_APP_API_SECRETIN
  : 'http://devapi.secret-in.me:3000';

const secretin = new Secretin(
  SecretinBrowserAdapter,
  Secretin.API.Server,
  serverURI
);

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
