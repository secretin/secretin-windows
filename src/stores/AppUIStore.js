import Immutable, { Record } from 'immutable';
import alt from '../utils/alt';
import makeImmutable from '../utils/makeImmutable';

import AppUIActions from '../actions/AppUIActions';

const AppUIState = new Record({
  loading: false,
  connected: false,
  errors: new Immutable.Map(),
  windowsSecretId: 'undefined',
  data: null,
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

  onLoginUserSuccess({ windowsSecretId, data }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: true,
        errors: new Immutable.Map(),
        windowsSecretId,
        data,
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

  onGeneratePasswordSuccess({ data }) {
    this.setState(
      this.state.merge({
        loading: false,
        data,
      })
    );
  }
}

export default alt.createStore(makeImmutable(AppUIStore), 'AppUIStore');
