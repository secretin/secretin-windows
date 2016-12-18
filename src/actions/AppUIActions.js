import moment from 'moment';
import Secretin from 'secretin';
import alt from '../utils/alt';
import secretin from '../utils/secretin';


class AppUIActions {
  constructor() {
    this.generateActions(
      'loginUserSuccess',
      'loginUserFailure',
      'generatePasswordSuccess',
      'generatePasswordFailure',
    );
  }

  loginUser({ username, password }) {
    let windowsSecretId = 'undefined';
    secretin
      .loginUser(username, password)
      .then((currentUser) => {
        Object.keys(currentUser.metadatas).forEach((id) => {
          if (currentUser.metadatas[id].type === 'windows') {
            windowsSecretId = id;
          }
        });
        return secretin.getSecret(windowsSecretId);
      })
      .then(passwordsList => this.loginUserSuccess({ windowsSecretId, passwordsList }))
      .catch((error) => {
        if (error instanceof Secretin.Errors.UserNotFoundError) {
          return this.loginUserFailure({
            error: { username: 'User not found' },
          });
        } else if (error instanceof Secretin.Errors.InvalidPasswordError) {
          return this.loginUserFailure({
            error: { password: 'Invalid password' },
          });
        } else if (error instanceof Secretin.Errors.DontHaveSecretError) {
          return secretin.addSecret('Windows', [], 'windows')
            .then(secretId => this.loginUserSuccess({
              windowsSecretId: secretId,
              passwordsList: [],
            }));
        }
        throw error;
      });
    return { username };
  }

  generatePassword({ windowsSecretId, passwordsList }) {
    const newPassword = Secretin.Utils.PasswordGenerator.generatePassword({ length: 30 });
    const newPasswordsList = passwordsList.push({ date: moment().format('DD/MM/YY HH:mm'), value: newPassword });
    secretin.editSecret(windowsSecretId, newPasswordsList.toJS())
      .then(() => this.generatePasswordSuccess({ passwordsList: newPasswordsList }))
      .catch(() => this.generatePasswordFailure());
    return { windowsSecretId };
  }
}

export default alt.createActions(AppUIActions);