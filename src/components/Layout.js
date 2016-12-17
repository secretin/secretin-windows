import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import Select from '../components/utilities/Select';
import AppUIStore from '../stores/AppUIStore';

class Layout extends Component {

  static propTypes = {
    passwordsList: PropTypes.instanceOf(Immutable.List),
  }

  static getStores() {
    return [
      AppUIStore,
    ];
  }

  static getPropsFromStores() {
    return {
      passwordsList: AppUIStore.getPasswordsList(),
    };
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      windowsPassword: props.passwordsList.last(),
    };
  }

  handleChange({ name, value }) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="user-connect">
        <h2>
          Secret-in.me
        </h2>
        <Select
          value={this.state.windowsPassword}
          options={this.props.passwordsList}
          size="small"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default connectToStores(Layout);
