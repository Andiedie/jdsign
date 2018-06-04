<template>
  <div class="wrapper">
    <div class="information-wrapper">
      <img :src="user.avatar" @dblclick="logout" alt="avatar" class="avatar">
      <div class="username">{{user.name}}</div>
    </div>

    <div class="button-wrapper">
      <div :disabled="running" @click="sign" class="start">{{user.isLogin ? '开始签到' : '登录并签到'}}</div>
    </div>

    <div class="log-wrapper">
      <div v-for="(log, index) in logs" :key="index" class="log">
        {{log}}
      </div>
      <div class="nothing" v-if="logs.length === 0">
        <div>暂无日志信息</div>
      </div>
    </div>
  </div>
</template>

<script>
import login from '@/utils/login.js';
import electron from 'electron';
import jobs from '@/utils/jobs';
const {remote: {dialog, session}} = electron;

export default {
  data () {
    return {
      user: {
        avatar: 'static/default-avatar.png',
        name: '未登录',
        isLogin: false
      },
      logs: [],
      running: false
    };
  },
  methods: {
    async logout () {
      session.defaultSession.clearStorageData();
      this.user = {
        avatar: 'static/default-avatar.png',
        name: '未登录',
        isLogin: false
      };
    },
    async sign () {
      if (this.running) return;
      this.running = true;
      if (!this.user.isLogin) {
        let cookies;
        try {
          cookies = await new Promise((resolve, reject) => {
            login(['pt_key', 'pt_pin', 'sid'], (error, cookies) => {
              if (error) reject(error);
              else resolve(cookies);
            });
          });
        } catch (err) {
          return dialog.showErrorBox('获取Cookie时出错', err.message);
        }
        this.$http.setCookie(cookies);
        await this.updateUserInfo();
      }
      console.log('cookies', this.$http.getCookie());
      const total = {
        jd: 0,
        coin: 0,
        cash: 0,
        flow: 0
      };
      for (const { default: job } of jobs) {
        const income = await job();
        total.jd += income.jd || 0;
        total.coin += income.coin || 0;
        total.cash += income.cash || 0;
        total.flow += income.flow || 0;
        this.logs = this.logs.concat(income.logs);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      this.logs.push(`${new Date()} [总收入] ${total.jd}京豆 ${total.coin}钢镚 ${total.cash}现金 ${total.flow}M流量`);
      this.running = false;
    },
    async updateUserInfo () {
      let {data} = await this.$http.get('https://wq.jd.com/user/info/GetUserAllPinInfo', {
        params: {
          sceneval: 2,
          callback: 'hook'
        },
        headers: {
          Referer: 'https://wqs.jd.com/my/accountv2.shtml'
        }
      });
      data = this.$http.parseJsonp('hook', data);
      if (data.errcode === 0) {
        this.user.avatar = data.userdata.renderJDDate['0'].msg.yunMidImageUrl;
        this.user.name = data.userdata.renderJDDate['0'].msg.nickname;
        this.user.isLogin = true;
      }
    }
  },
  mounted () {
    this.updateUserInfo();
  }
};
</script>

<style scoped>
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}
.information-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}
.avatar {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.username {
  text-align: center;
}
.button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}
.start {
  height: 50px;
  width: 150px;
  line-height: 50px;
  text-align: center;
  color: white;
  background: #ff4a56;
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
}
.start:hover {
  background: #ff7680;
}
.start:active {
  background: #f64c59;
}
.start[disabled] {
  cursor: not-allowed;
  background: gray;
}
.log-wrapper {
  flex-grow: 1;
  padding: 0 30px 30px 30px;
  height: 0;
  overflow-y: scroll;
}
.log {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: 5px;
}
.nothing {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
