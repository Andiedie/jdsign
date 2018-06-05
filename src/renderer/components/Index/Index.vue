<template>
  <div class="wrapper">
    <div class="information-wrapper">
      <img :src="user.avatar" @dblclick="logout" alt="avatar" class="avatar">
      <div class="username">{{user.name}}</div>
    </div>

    <div class="button-wrapper">
      <div :disabled="running" @click="sign" class="start">{{user.isLogin ? '开始签到' : '登录'}}</div>
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
const {remote} = electron;
const {dialog, session, Menu, MenuItem, app} = remote;

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
    createMenu () {
      const menu = new Menu();
      menu.append(new MenuItem({
        label: '退出登录',
        click: () => {
          this.logout();
        }
      }));
      menu.append(new MenuItem({
        label: '打开控制台',
        click: () => {
          remote.getCurrentWebContents().openDevTools();
        }
      }));
      menu.append(new MenuItem({
        label: `Version: ${app.getVersion()}`,
        enabled: false
      }));
      window.addEventListener('contextmenu', e => {
        e.preventDefault();
        menu.popup(remote.getCurrentWindow());
      });
    },
    async logout () {
      session.defaultSession.clearStorageData();
      this.user = {
        avatar: 'static/default-avatar.png',
        name: '未登录',
        isLogin: false
      };
    },
    async login () {
      let cookies;
      try {
        cookies = await new Promise((resolve, reject) => {
          login(['pt_key', 'pt_pin', 'sid'], (error, cookies) => {
            if (error) reject(error);
            else resolve(cookies);
          });
        });
      } catch (err) {
        throw err;
      }
      console.log('cookies', this.$http.getCookie());
      this.$http.setCookie(cookies);
      await this.updateUserInfo();
    },
    async sign () {
      if (this.running) return;
      if (!this.user.isLogin) {
        try {
          await this.login();
        } catch (err) {
          if (err.message !== 'Not login') {
            return dialog.showErrorBox('登录时出错', err.message);
          }
        }
        return;
      }
      this.running = true;
      const total = {
        jd: 0,
        coin: 0,
        cash: 0,
        flow: 0
      };
      for (const { default: job } of jobs) {
        let income;
        try {
          income = await job();
        } catch (err) {
          this.logs.push(`[错误] ${err.message}`);
          continue;
        }
        total.jd += income.jd || 0;
        total.coin += income.coin || 0;
        total.cash += income.cash || 0;
        total.flow += income.flow || 0;
        this.logs = this.logs.concat(income.logs);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      this.logs.push(`[总收入] ${total.jd}京豆 ${total.coin}钢镚 ${total.cash}现金 ${total.flow}M流量`);
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
  async mounted () {
    this.createMenu();
    try {
      await this.login();
    } catch (err) {
      console.log(err);
    }
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
