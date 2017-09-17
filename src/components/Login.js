import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { Button, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

const Login = ({ form: { getFieldProps }, onLogin, authenticating, error }) => (
  <form>
    <List renderHeader={() => '用脉脉账号登录'} style={{ width: '100%' }}>
      <InputItem
        {...getFieldProps('username')}
        clear
        error={error}
        placeholder="用户名/手机号"
        autoFocus
      />
      <InputItem
        {...getFieldProps('password')}
        clear
        placeholder="密码"
        autoFocus
        error={error}
        type="password"
      />
    </List>
    <WhiteSpace />
    {error ? <div style={{ color: 'red' }}>{error}</div> : null}
    <WhiteSpace />
    <Button type="primary" size="small" disabled={authenticating} onClick={onLogin}>登录</Button>
  </form>
);

const onLogin = ({ form: { validateFields }, startAuth, endAuth, setError, onAuthenticated }) => () => {
  validateFields((error, credentials) => {
    startAuth();

    const body = Object.keys(credentials).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(credentials[key]);
    }).join('&');

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body,
    }).then((res) => {
      endAuth();
      if (res.status >= 200 && res.status < 300) {
        onAuthenticated();
      } else {
        onAuthenticated();
      }
    }, error => {
      console.info(error);
      endAuth();
      setError('用户名或密码错误!');
    });
  });
};

export default compose(
  createForm(),
  withStateHandlers({
    authenticating: false,
    error: undefined,
  }, {
    startAuth: () => () => ({ authenticating: true }),
    endAuth: () => () => ({ authenticating: false }),
    setError: () => (error) => ({ error }),
  }),
  withHandlers({ onLogin }),
)(Login);
