import Immutable, { Record } from 'immutable';
import alt from '../utils/alt';
import makeImmutable from '../utils/makeImmutable';

import AppUIActions from '../actions/AppUIActions';

const AppUIState = new Record({
  loading: false,
  connected: false,
  errors: new Immutable.Map(),
  windowsSecretId: 'undefined',
  passwordsList: new Immutable.List(),
});

class AppUIStore {
  constructor() {
    this.bindActions(AppUIActions);

    this.state = new AppUIState();
  }

  onLoginUser() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  onLoginUserSuccess({ windowsSecretId, passwordsList }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: true,
        errors: new Immutable.Map(),
        windowsSecretId,
        passwordsList: new Immutable.List(passwordsList),
      })
    );
  }

  onLoginUserFailure({ error }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: false,
        errors: new Immutable.Map(error),
      })
    );
  }

  onGeneratePassword() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  onGeneratePasswordSuccess({ passwordsList }) {
    this.setState(
      this.state.merge({
        loading: false,
        passwordsList,
      })
    );
  }

  static getPasswordsList() {
    return this.getState().get('passwordsList');
  }

  static getWindowsSecretId() {
    return this.getState().get('windowsSecretId');
  }
}

export default alt.createStore(makeImmutable(AppUIStore), 'AppUIStore');
