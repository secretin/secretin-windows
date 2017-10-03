import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import AppUIStore from '../stores/AppUIStore';

import UserConnect from '../components/UserConnect';
import Layout from '../components/Layout';

class App extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    loading: false,
    connected: false,
    errors: new Immutable.Map(),
  };

  static getStores() {
    return [AppUIStore];
  }

  static getPropsFromStores() {
    const state = AppUIStore.getState();
    return {
      loading: state.get('loading'),
      connected: state.get('connected'),
      errors: state.get('errors'),
    };
  }

  render() {
    return (
      <div className="App">
        {this.props.connected ? (
          <Layout />
        ) : (
          <UserConnect
            loading={this.props.loading}
            errors={this.props.errors}
          />
        )}
      </div>
    );
  }
}

export default connectToStores(App);
