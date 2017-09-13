import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { Button, List, InputItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';

const Login = ({ form: { getFieldProps }, onLogin, authenticated, error }) => (
  <div>
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
    <Button type="primary" size="small" disabled={authenticated} onClick={onLogin}>登录</Button>
  </div>
);

const onLogin = ({ form: { validateFields }, startAuth, endAuth, setError, onAuthenticated }) => () => {
  validateFields((error, value) => {
    console.log(error, value);
    startAuth();
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setError('用户名或密码错误!');
      } else {
        onAuthenticated();
      }
      endAuth();
    }, 1000);
  });
};

export default compose(
  createForm(),
  withStateHandlers({
    authenticated: false,
    error: undefined,
  }, {
    startAuth: () => () => ({ authenticated: true }),
    endAuth: () => () => ({ authenticated: false }),
    setError: () => (error) => ({ error }),
  }),
  withHandlers({ onLogin }),
)(Login);
