import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';

import Select from '../components/utilities/Select';
import Button from '../components/utilities/Button';
import AppUIStore from '../stores/AppUIStore';
import AppUIActions from '../actions/AppUIActions';

class Layout extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.instanceOf(Immutable.List),
    windowsSecretId: PropTypes.string,
  };

  static defaultProps = {
    loading: false,
    passwordsList: new Immutable.List(),
    windowsSecretId: '',
  };

  static getStores() {
    return [AppUIStore];
  }

  static getPropsFromStores() {
    const { windowsSecretId, data, loading } = AppUIStore.getState();
    return {
      windowsSecretId,
      data,
      loading,
    };
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      windowsPassword: '',
    };
  }

  componentDidMount() {
    this.setDefaultPassword(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps, this.props)) {
      this.setDefaultPassword(nextProps);
    }
  }

  setDefaultPassword(props) {
    if (!props.data && !props.data.get('fields')) {
      return;
    }

    const windowsPassword = props.data
      .get('fields')
      .sortBy(field => field.date)
      .reverse()
      .first();
    this.setState({ windowsPassword });
  }

  handleChange({ content }) {
    this.setState({
      windowsPassword: content,
    });
  }

  handleClick() {
    // copyToClipboard(this.props.content, { debug: true });
    // eslint-disable-next-line
    ipcRenderer.sendSync('changeClipboard', this.state.windowsPassword);
  }

  render() {
    return (
      <form className="user-connect form">
        <h2 className="user-connect-title">
          Windows
          <small>Passwords</small>
        </h2>
        {this.state.windowsPassword ? (
          <div>
            <Select
              label="Passwords"
              value={this.state.windowsPassword}
              options={this.props.data
                .get('fields')
                .sortBy(field => field.date)
                .reverse()
                .map(password => [
                  password.get('content'),
                  moment(password.get('date')).format('dddd DD MMMM YYYY'),
                ])
                .toList()}
              onChange={this.handleChange}
              actions={
                new Immutable.List([
                  <a
                    disabled={this.props.loading}
                    onClick={() =>
                      AppUIActions.generatePassword({
                        windowsSecretId: this.props.windowsSecretId,
                        data: this.props.data,
                      })}
                    tabIndex="-1"
                  >
                    Generate password
                  </a>,
                ])
              }
            />
            <Button onClick={this.handleClick} disabled={this.props.loading}>
              Copy
            </Button>
          </div>
        ) : (
          <Button
            onClick={() =>
              AppUIActions.generatePassword({
                windowsSecretId: this.props.windowsSecretId,
                data: this.props.data,
              })}
            disabled={this.props.loading}
          >
            Generate your first password
          </Button>
        )}
      </form>
    );
  }
}

export default connectToStores(Layout);
