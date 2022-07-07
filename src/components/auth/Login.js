/* eslint jsx-a11y/anchor-is-valid: 0 */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { defineMessages, injectIntl } from 'react-intl';

import { LIVE_FRANZ_API } from '../../config';
import { API_VERSION } from '../../environment-remote';
import { serverBase } from '../../api/apiBase'; // TODO: Remove this line after fixing password recovery in-app
import Form from '../../lib/Form';
import { required, email } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/button';
import Link from '../ui/Link';

import { globalError as globalErrorPropType } from '../../prop-types';
import { H1 } from '../ui/headline';

const messages = defineMessages({
  headline: {
    id: 'login.headline',
    defaultMessage: 'Sign in',
  },
  emailLabel: {
    id: 'login.email.label',
    defaultMessage: 'Email address',
  },
  passwordLabel: {
    id: 'login.password.label',
    defaultMessage: 'Password',
  },
  submitButtonLabel: {
    id: 'login.submit.label',
    defaultMessage: 'Sign in',
  },
  invalidCredentials: {
    id: 'login.invalidCredentials',
    defaultMessage: 'Email or password not valid',
  },
  customServerQuestion: {
    id: 'login.customServerQuestion',
    defaultMessage: 'Using a custom Ferdium server?',
  },
  customServerSuggestion: {
    id: 'login.customServerSuggestion',
    defaultMessage: 'Try importing your Franz account',
  },
  tokenExpired: {
    id: 'login.tokenExpired',
    defaultMessage: 'Your session expired, please login again.',
  },
  serverLogout: {
    id: 'login.serverLogout',
    defaultMessage: 'Your session expired, please login again.',
  },
  signupLink: {
    id: 'login.link.signup',
    defaultMessage: 'Create a free account',
  },
  passwordLink: {
    id: 'login.link.password',
    defaultMessage: 'Reset password',
  },
});

class Login extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isTokenExpired: PropTypes.bool.isRequired,
    isServerLogout: PropTypes.bool.isRequired,
    signupRoute: PropTypes.string.isRequired,
    // passwordRoute: PropTypes.string.isRequired, // TODO: Uncomment this line after fixing password recovery in-app
    error: globalErrorPropType.isRequired,
  };

  form = (() => {
    const { intl } = this.props;
    return new Form({
      fields: {
        email: {
          label: intl.formatMessage(messages.emailLabel),
          value: '',
          validators: [required, email],
        },
        password: {
          label: intl.formatMessage(messages.passwordLabel),
          value: '',
          validators: [required],
          type: 'password',
        },
      },
    },
    intl,
  )})();

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: form => {
        this.props.onSubmit(form.values());
      },
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.props;
    const {
      isSubmitting,
      isTokenExpired,
      isServerLogout,
      signupRoute,
      // passwordRoute, // TODO: Uncomment this line after fixing password recovery in-app
      error,
    } = this.props;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <Link to='/auth/welcome'><img src="./assets/images/logo.svg" className="auth__logo" alt="" /></Link>
          <H1>{intl.formatMessage(messages.headline)}</H1>
          {isTokenExpired && (
            <p className="error-message center">
              {intl.formatMessage(messages.tokenExpired)}
            </p>
          )}
          {isServerLogout && (
            <p className="error-message center">
              {intl.formatMessage(messages.serverLogout)}
            </p>
          )}
          <Input field={form.$('email')} focus />
          <Input field={form.$('password')} showPasswordToggle />
          {error.code === 'invalid-credentials' && (
            <>
              <p className="error-message center">
                {intl.formatMessage(messages.invalidCredentials)}
              </p>
              {window['ferdium'].stores.settings.all.app.server !==
                LIVE_FRANZ_API && (
                <p className="error-message center">
                  {intl.formatMessage(messages.customServerQuestion)}{' '}
                  <Link
                    to={`${window[
                      'ferdium'
                    ].stores.settings.all.app.server.replace(
                      API_VERSION,
                      '',
                    )}/import`}
                    target="_blank"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {intl.formatMessage(messages.customServerSuggestion)}
                  </Link>
                </p>
              )}
            </>
          )}
          {isSubmitting ? (
            <Button
              className="auth__button is-loading"
              buttonType="secondary"
              label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
              loaded={false}
              disabled
            />
          ) : (
            <Button
              type="submit"
              className="auth__button"
              label={intl.formatMessage(messages.submitButtonLabel)}
            />
          )}
        </form>
        <div className="auth__links">
          <Link to={signupRoute}>
            {intl.formatMessage(messages.signupLink)}
          </Link>
          <Link
            // to={passwordRoute} // TODO: Uncomment this line after fixing password recovery in-app
            to={`${serverBase()}/user/forgot`} // TODO: Remove this line after fixing password recovery in-app
            target='_blank' // TODO: Remove this line after fixing password recovery in-app
          >
            {intl.formatMessage(messages.passwordLink)}
          </Link>
        </div>
      </div>
    );
  }
}

export default injectIntl(inject('actions')(observer(Login)));
