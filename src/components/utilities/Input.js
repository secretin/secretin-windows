import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import Icon from './Icon';
import Button from './Button';

class Input extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    title: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,

    autoFocus: PropTypes.bool,
    autoSelect: PropTypes.bool,
    autoComplete: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    actions: PropTypes.instanceOf(Immutable.List),
    size: PropTypes.string,
  };

  static defaultProps = {
    type: 'text',
    label: '',
    value: '',
    title: '',
    placeholder: '',
    error: '',
    autoFocus: false,
    autoSelect: false,
    autoComplete: false,
    disabled: false,
    readOnly: false,
    actions: new Immutable.List(),
    size: 'base',
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onTogglePasswordShow = this.onTogglePasswordShow.bind(this);
    this.id = uniqueId(`${this.props.name}_input_`);
    this.state = {
      showPassword: false,
    };
  }

  componentDidMount() {
    if (this.props.autoSelect) {
      setTimeout(() => this.input.select(), 0);
    }
  }

  onChange(e) {
    this.props.onChange({
      name: this.props.name,
      value: e.target.value,
    });
  }

  onTogglePasswordShow() {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  select() {
    this.input.select();
  }

  render() {
    const className = classNames(
      'input',
      `input--type-${this.props.type}`,
      `input--size-${this.props.size}`,
      {
        'input--error': this.props.error,
      }
    );

    const actions = this.props.actions;

    return (
      <div className={className}>
        {this.props.label && (
          <label htmlFor={this.id}>
            {this.props.label}
            {actions.size > 0 && (
              <span className="input-label-actions">{actions}</span>
            )}
          </label>
        )}

        <input
          id={this.id}
          ref={input => {
            this.input = input;
          }}
          name={this.id}
          title={this.props.title}
          type={
            this.props.type === 'password' && this.state.showPassword
              ? 'text'
              : this.props.type
          }
          value={this.props.value}
          onChange={this.onChange}
          placeholder={this.props.placeholder}
          autoComplete={this.props.autoComplete ? null : 'new-password'}
          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
        />
        {this.props.type === 'password' && (
          <div className="input--password-show">
            <Button
              title="Show"
              buttonStyle="icon"
              onClick={this.onTogglePasswordShow}
              tabIndex="-1"
            >
              <Icon
                id={this.state.showPassword ? 'show' : 'hide'}
                size="small"
              />
            </Button>
          </div>
        )}
        {this.props.error && (
          <span className="input-error">{this.props.error}</span>
        )}
      </div>
    );
  }
}

export default Input;
