<template>
  <div id="app">
    <!-- 导航菜单 -->
    <nav class="main-nav">
      <div class="nav-container">
        <!-- <div class="nav-title">MapTool 地图工具</div> -->
        <!-- <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/map" class="nav-link">地图演示</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </div> -->
      </div>
    </nav>
    
    <!-- 页面内容 -->
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

body {
  margin: 0;

  .nav-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .main-content {
    flex: 1;
  }
}

.content {
  position: relative;
  margin: 0 auto;
  height: 100vh;
}

.label {
  position: absolute;
  left: 120px;
  top: 0;
  height: 30px;
  line-height: 30px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: left;
  padding: 0 15px;
  box-sizing: border-box;
  z-index: 1;
  width: 50vw;
}

.behavior-tree-container {
  width: 100%;
  height: 600px;
  margin: 20px auto;
}

.result-display {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>
