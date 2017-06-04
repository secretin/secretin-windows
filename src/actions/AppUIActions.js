import moment from 'moment';
import Immutable from 'immutable';
import Secretin, { Errors } from 'secretin';
import alt from '../utils/alt';
import secretin from '../utils/secretin';

const DEFAULT_SECRET = new Immutable.Map({
  type: 'windows',
  fields: new Immutable.List([]),
});

class AppUIActions {
  constructor() {
    this.generateActions(
      'loginUserSuccess',
      'loginUserFailure',
      'generatePasswordSuccess',
      'generatePasswordFailure',
    );
  }

  loginUser({ username, password, token }) {
    let windowsSecretId = 'undefined';
    secretin
      .loginUser(username, password, token)
      .then((currentUser) => {
        Object.keys(currentUser.metadatas).forEach((id) => {
          if (currentUser.metadatas[id].type === 'windows') {
            windowsSecretId = id;
          }
        });
        return secretin.getSecret(windowsSecretId);
      })
      .then((raw) => {
        const data = (
          raw.type ?
            Immutable.fromJS(raw) :
            DEFAULT_SECRET.set('fields', Immutable.fromJS(raw))
        );
        this.loginUserSuccess({ windowsSecretId, data });
      })
      .catch((error) => {
        if (error instanceof Errors.UserNotFoundError) {
          return this.loginUserFailure({
            error: { username: 'User not found' },
          });
        } else if (error instanceof Errors.InvalidPasswordError) {
          if (token) {
            return this.loginUserFailure({
              error: { totp: 'Token', token: 'Invalid token' },
            });
          }
          return this.loginUserFailure({
            error: { password: 'Invalid password' },
          });
        } else if (error instanceof Errors.NeedTOTPTokenError) {
          return this.loginUserFailure({
            error: { totp: 'Token' },
          });
        } else if (error instanceof Secretin.Errors.DontHaveSecretError) {
          return secretin.addSecret('Windows', DEFAULT_SECRET, undefined, 'windows')
            .then(secretId => this.loginUserSuccess({
              windowsSecretId: secretId,
              data: DEFAULT_SECRET,
            }));
        }
        throw error;
      });
    return { username };
  }

  generatePassword({ windowsSecretId, data }) {
    const newPassword = Secretin.Utils.PasswordGenerator.generatePassword({ length: 30 });
    const newData = data.update(
      'fields',
      fields => fields.push(new Immutable.Map({ date: moment().format(), content: newPassword })),
    );

    secretin.editSecret(windowsSecretId, newData)
      .then(() => this.generatePasswordSuccess({ data: newData }))
      .catch(() => this.generatePasswordFailure());
    return { windowsSecretId };
  }
}

export default alt.createActions(AppUIActions);
