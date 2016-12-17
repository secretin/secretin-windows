import Secretin from 'secretin';
import alt from '../utils/alt';
import secretin from '../utils/secretin';

class AppUIActions {
  constructor() {
    this.generateActions(
      'loginUserSuccess',
      'loginUserFailure',
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
}

export default alt.createActions(AppUIActions);
