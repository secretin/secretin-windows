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
    passwordsList: PropTypes.instanceOf(Immutable.List),
    windowsSecretId: PropTypes.string,
  }

  static getStores() {
    return [
      AppUIStore,
    ];
  }

  static getPropsFromStores() {
    return {
      passwordsList: AppUIStore.getPasswordsList(),
      windowsSecretId: AppUIStore.getWindowsSecretId(),
      loading: AppUIStore.getState().get('loading'),
    };
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    try {
      this.state = {
        windowsPassword: props.passwordsList.last().value,
      };
    } catch (e) {
      this.state = {
        windowsPassword: '',
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps, this.props)) {
      try {
        this.setState({
          windowsPassword: nextProps.passwordsList.last().value,
        });
      } catch (e) {
        this.setState({
          windowsPassword: '',
        });
      }
    }
  }

  handleChange({ value }) {
    this.setState({
      windowsPassword: value,
    });
  }

  handleClick() {
    // copyToClipboard(this.props.value, { debug: true });
    // eslint-disable-next-line
    ipcRenderer.sendSync('changeClipboard', this.state.windowsPassword);
  }

  render() {
    return (
      <form className="user-connect form">
        <h2 className="user-connect-title">
          Windows
          <small>
            Passwords
          </small>
        </h2>

        {
          this.state.windowsPassword ? (
            <div>
              <Select
                label="Passwords"
                value={this.state.windowsPassword}
                options={
                  this.props.passwordsList.reverse().map(password => ([
                    password.value,
                    `${moment(password.date).format('dddd DD MMMM YYYY')}`,
                  ])).toList()
                }
                onChange={this.handleChange}
                actions={
                  new Immutable.List([
                    <a
                      disabled={this.props.loading}
                      onClick={() => AppUIActions.generatePassword({
                        windowsSecretId: this.props.windowsSecretId,
                        passwordsList: this.props.passwordsList,
                      })}
                      tabIndex="-1"
                    >
                      Generate password
                    </a>,
                  ])
                }
              />
              <Button
                onClick={this.handleClick}
                disabled={this.props.loading}
              >
                Copy
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => AppUIActions.generatePassword({
                windowsSecretId: this.props.windowsSecretId,
                passwordsList: this.props.passwordsList,
              })}
              disabled={this.props.loading}
            >
              Generate your first password
            </Button>
          )
        }
      </form>
    );
  }
}

export default connectToStores(Layout);
