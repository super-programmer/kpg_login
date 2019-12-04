import kpgLogin from './components/Login'
import LoginApi from './api/login'
kpgLogin.install = Vue => Vue.component(kpgLogin.name, kpgLogin);
kpgLogin.LoginApi = LoginApi;
export default kpgLogin;
