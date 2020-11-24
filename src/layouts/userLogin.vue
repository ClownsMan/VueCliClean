<template>
  <div class="login">
    <a-layout>
      <a-layout-header>
        <h2 class="title">后台管理系统</h2>
      </a-layout-header>
      <a-layout-content>
        <a-row>
          <a-col span="6" offset="14">
            <div class="login-wrapper">
              <a-form
                :form="form"
                class="login-form"
                @submit="handleSubmit"
              >
                <a-form-item
                  label="用户名"
                >
                  <a-input
                    class="login-input"
                    size="large"
                    v-decorator="[
                      'userName',
                      { rules: [{ required: true, message: '请输入用户名' }] }
                    ]"
                    placeholder="用户名"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: #889aa4; font-size:14px;"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item
                  label="密码">
                  <a-input
                    class="login-input"
                    size="large"
                    v-decorator="[
                      'password',
                      { rules: [{ required: true, message: '请输入密码' }] }
                    ]"
                    type="password"
                    placeholder="密码"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: #889aa4;font-size:14px;"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item :span="12">
                    <a-row>
                      <a-button
                        size="large"
                        type="primary"
                        html-type="submit"
                        class="login-form-button"
                      >
                        登录
                      </a-button>
                    </a-row>
                </a-form-item>
              </a-form>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer>
        <div class="tc">平台管理系统v1.0</div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script>
import { timeJudge } from '@/utils/utils';
export default {
  data () {
    return {
      dotsShow: false,
      show: 'login',
      imgSrc: '',
      spinning: false, // 是否显示加载状态
      form: null
    };
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  created () { },
  mounted () { },
  methods: {
    handleSubmit() {
      let token = new Date().getTime();
      localStorage.setItem('token', token)
      this.$router.push('/home')
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #fff;

  .ant-layout-header,
  .ant-layout-content,
  .ant-layout-footer {
    background: #fff;
  }

  .ant-layout-content {
    padding: 50px 0;
    clear: both;
    background-image: url("../../public/loginBg.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .login-wrapper {
      width: 400px;
      height: 400px;
      padding: 30px 50px 0;
      background: #fff;
      border-radius: 10px;

      .login-form {
        position: relative;
        .org-icon {
          z-index: 9999;
          position: absolute;
          left: 10px;
          top: 2px;
        }

        .login-form-button {
          margin-top: 10px;
          width: 220px;
          height: 48px;
          border-radius: 20px;
        }
      }
    }
  }

  .title {
    font-weight: 600;
    font-size: 24px;
  }

  .tc {
    text-align: center;
  }
}
</style>
