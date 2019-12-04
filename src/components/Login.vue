<template>
    <article class="m-model">
        <section class="m-login">
            <header class="m-login-hd">
                <section class="m-login-hd__tit">
                    填写手机
                </section>
                <p class="m-login-hd__tips">
                    请填写手机号码登录
                </p>
                <i class="cubeic-close" @click="loginClose"></i>
            </header>
            <article class="m-login-bd">
                <section class="m-login__phone">
                    <header class="m-login__phone--left">
                        +86
                    </header>
                    <input type="text"
                           v-model.trim="mobile"
                           placeholder="请输入手机号">
                </section>
                <section class="m-login__code">
                    <input type="text" v-model="code"
                           @keyup.13="handleLogin"
                           placeholder="请输入验证码">
                    <button :class="[
                                'm-login__phone--button', mobile && !countting ? 'm-login__phone--button--active' : ''
                            ]"
                            @click="handleGetValidate"
                            :disabled="countting">
                        获取验证码 <span v-if="countting">{{count}}</span>
                    </button>
                </section>
                <div v-if="errMsg.length"
                     class="m-login__validate">
                    {{errMsg}}
                </div>
            </article>
            <footer class="m-login-ft">
                <button class="m-login-ft__button m-login-ft__button--active"
                        @click="handleLogin">立即登录
                </button>
            </footer>
        </section>
    </article>
</template>
<script>
  import Api from '../api/login';
  import qs from 'qs';

  export default {
    name: 'Login',
    data() {
      return {
        loginType: 0,
        mobile: '',
        code: '',
        defineId: 1001,
        recordId: '',
        errMsg: '',
        count: 60,
        countting: false,
        timer: null,
      };
    },
    mounted() {
      if(localStorage.token && !window.JsBridgeGetSubject){
        Api.refreshToken();
      }
    },
    methods: {
      /**
       * 获取验证码
       */
      handleGetValidate() {
        // 检查手机号
        if (!this.checkPhone(this.mobile)) {
          return;
        }

        // 获取验证码
        Api.getValidate(this.defineId, this.mobile).then((rep) => {
          this.recordId = rep.id;

          this.countting = true;
          this.countTime(this.count, (num) => {
            this.count = num;

            if (num === 0) {
              this.countting = false;
              this.count = 60;
            }
          });
        });
      },

      /**
       * 短信验证码登录/社交用户绑定
       */
      async handleLogin() {
        // 检查手机号
        if (!this.checkPhone(this.mobile)) {
          return;
        }

        // 检查验证码
        if (!await this.checkCode(this.code)) {
          return;
        }

        // 登录
        const params = qs.stringify({
          client_id: 'kpg-web',
          client_secret: '12719da91b1745da8d272c6e119f71da',
          grant_type: 'sms_code',
          scope: 'all',
          phone: this.mobile,
          captcha: this.recordId,
        });

        await this.login(params);

      },

      /**
       * 登录
       */
      async login(params) {
        const token = await Api.login(params);
        token.timestamp = new Date().getTime();
        localStorage.token = JSON.stringify(token);
        localStorage.accessToken = token.access_token;
        Api.refreshToken();
        this.loginSuccess();
      },

      /**
       * 检查手机号
       */
      checkPhone(phone) {
        if (!phone) {
          this.errMsg = '请输入手机号';
          return false;
        }

        const reg = /^1\d{10}$/;
        if (!reg.test(phone)) {
          this.errMsg = '请输入正确的手机号';
          return false;
        }

        return true;
      },

      /**
       * 检查验证码
       */
      async checkCode(code) {
        if (!code) {
          this.errMsg = '请输入验证码';
          return false;
        }

        if (code.length !== 6 || !this.recordId) {
          this.errMsg = '请输入正确的验证码';
          return false;
        }

        const rep = await Api.checkValidate(this.recordId, `{"code": "${code}"}`);
        if (!rep.passed) {
          this.errMsg = rep.reason;
          if (rep.chance === 0) {
            this.errMsg = '请重新获取验证码';
            this.reset();
          }
          return false;
        }

        return true;
      },

      /**
       * 倒计时
       */
      countTime(num, fn) {
        let number = num;
        this.timer = setInterval(() => {
          number -= 1;
          fn(number);
          if (number === 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      },

      /**
       * 重置验证码
       */
      reset() {
        this.count = 60;
        this.code = '';
        this.recordId = '';
        this.countting = false;
        clearInterval(this.timer);
      },
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
  };
</script>

<style scoped>
    @import "../assets/styles/login.css";
</style>
