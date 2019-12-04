<template>
  <div id="app">
    <LoginDialog @loginSuccess="loginSuccess" @loginClose="loginClose"/>
  </div>
</template>

<script>
import LoginDialog from './components/Login';

export default {
  name: 'Login',
  methods:{
    /*登录成功*/
    loginSuccess(){
      this.$emit('loginSuccess');
      this.loginClose();
    },
    /*关闭*/
    loginClose(){
      this.$emit('loginClose')
    },
  },
  components: {
    LoginDialog,
  }
}
</script>

<style>
</style>
