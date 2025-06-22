<template>
  <div class="home">
    <!-- 欢迎横幅 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">MapTool 地图工具</h1>
        <p class="hero-subtitle">专业的GIS数据可视化平台，支持多种地理数据格式导入与展示</p>
        <div class="hero-features">
          <span class="hero-tag">GeoJSON</span>
          <span class="hero-tag">Shapefile</span>
          <span class="hero-tag">TIF栅格</span>
        </div>
        <div class="hero-buttons">
          <router-link to="/map" class="btn btn-primary">
            🚀 立即体验
          </router-link>
          <!-- <a href="/large-shapefile-guide.html" class="btn btn-secondary" target="_blank">
            📖 使用指南
          </a> -->
        </div>
      </div>
      <div class="hero-image">
        <div class="map-preview">
          <div class="map-placeholder">
            <i class="map-icon">🗺️</i>
            <p>拖拽文件即可可视化</p>
            <div class="file-types">
              <span>.geojson</span>
              <span>.shp</span>
              <span>.tif</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心功能 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📂</div>
            <h3>多格式数据导入</h3>
            <p>支持GeoJSON、Shapefile、TIF等主流GIS数据格式，拖拽即可导入</p>
            <div class="feature-tags">
              <span>GeoJSON</span>
              <span>Shapefile</span>
              <span>TIF</span>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>智能数据可视化</h3>
            <p>自动识别数据类型，矢量数据样式化，栅格数据科学色彩渲染</p>
            <div class="feature-tags">
              <span>矢量渲染</span>
              <span>栅格可视化</span>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>大数据性能优化</h3>
            <p>智能分层渲染，内存管理优化，支持百万级要素流畅显示</p>
            <div class="feature-tags">
              <span>分批渲染</span>
              <span>内存优化</span>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>交互式数据探索</h3>
            <p>点击查看要素属性，图层管理，缩放适应，多图层叠加显示</p>
            <div class="feature-tags">
              <span>属性查询</span>
              <span>图层管理</span>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>跨平台响应式</h3>
            <p>完美适配桌面端和移动端，随时随地进行地理数据分析</p>
            <div class="feature-tags">
              <span>桌面端</span>
              <span>移动端</span>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛠️</div>
            <h3>开发者友好</h3>
            <p>Vue组件化设计，简单API，详细文档，快速集成到项目中</p>
            <div class="feature-tags">
              <span>Vue组件</span>
              <span>API简洁</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 支持的数据格式 -->
    <section class="formats-section">
      <div class="container">
        <h2 class="section-title">支持的数据格式</h2>
        <div class="formats-grid">
          <div class="format-card">
            <div class="format-icon">📍</div>
            <h3>GeoJSON</h3>
            <p class="format-description">标准地理数据交换格式</p>
            <ul class="format-features">
              <li>✅ 点、线、面几何要素</li>
              <li>✅ 属性数据完整保留</li>
              <li>✅ 文件大小 < 50MB</li>
              <li>✅ 无需额外配置</li>
            </ul>
            <div class="format-extensions">.geojson .json</div>
          </div>
          <div class="format-card">
            <div class="format-icon">🗂️</div>
            <h3>Shapefile</h3>
            <p class="format-description">GIS行业标准矢量格式</p>
            <ul class="format-features">
              <li>✅ 完整文件集支持</li>
              <li>✅ 投影信息自动识别</li>
              <li>✅ 文件集 < 200MB</li>
              <li>✅ 智能性能优化</li>
            </ul>
            <div class="format-extensions">.shp .shx .dbf .prj</div>
          </div>
          <div class="format-card">
            <div class="format-icon">🌍</div>
            <h3>TIF栅格</h3>
            <p class="format-description">栅格数据专业可视化</p>
            <ul class="format-features">
              <li>✅ 卫星影像、DEM数据</li>
              <li>✅ 科学色彩方案渲染</li>
              <li>✅ 文件大小 < 100MB</li>
              <li>✅ 地理参考自动识别</li>
            </ul>
            <div class="format-extensions">.tif .tiff</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="tech-section">
      <div class="container">
        <h2 class="section-title">技术架构</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <div class="tech-logo vue">Vue</div>
            <p>Vue 2.6.14</p>
            <span class="tech-desc">前端框架</span>
          </div>
          <div class="tech-item">
            <div class="tech-logo leaflet">Leaflet</div>
            <p>地图引擎</p>
            <span class="tech-desc">地图渲染</span>
          </div>
          <div class="tech-item">
            <div class="tech-logo shpjs">shpjs</div>
            <p>Shapefile解析</p>
            <span class="tech-desc">矢量数据</span>
          </div>
          <div class="tech-item">
            <div class="tech-logo plotty">plotty</div>
            <p>栅格渲染</p>
            <span class="tech-desc">TIF可视化</span>
          </div>
          <div class="tech-item">
            <div class="tech-logo geotiff">GeoTIFF</div>
            <p>栅格解析</p>
            <span class="tech-desc">地理栅格</span>
          </div>
          <div class="tech-item">
            <div class="tech-logo element">Element</div>
            <p>UI组件</p>
            <span class="tech-desc">用户界面</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="quickstart-section">
      <div class="container">
        <h2 class="section-title">快速开始</h2>
        <div class="quickstart-steps">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>准备数据</h3>
            <p>准备GeoJSON、Shapefile或TIF格式的地理数据文件</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>导入数据</h3>
            <p>点击上传按钮或直接拖拽文件到地图区域</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>数据可视化</h3>
            <p>系统自动渲染数据，支持属性查询和图层管理</p>
          </div>
        </div>
        <div class="quickstart-actions">
          <router-link to="/map" class="btn btn-primary btn-large">
            🚀 开始使用
          </router-link>
          <a href="/large-shapefile-guide.html" class="btn btn-outline" target="_blank">
            📖 查看指南
          </a>
        </div>
      </div>
    </section>

    <!-- 性能特性 -->
    <section class="performance-section">
      <div class="container">
        <h2 class="section-title">性能优化</h2>
        <div class="performance-grid">
          <div class="performance-item">
            <div class="performance-icon">🚀</div>
            <h3>智能渲染</h3>
            <p>根据数据量自动选择最佳渲染策略</p>
            <ul>
              <li>小数据集：完整交互</li>
              <li>中等数据集：简化样式</li>
              <li>大数据集：分批渲染</li>
            </ul>
          </div>
          <div class="performance-item">
            <div class="performance-icon">💾</div>
            <h3>内存管理</h3>
            <p>实时监控内存使用，自动垃圾回收</p>
            <ul>
              <li>分步文件读取</li>
              <li>及时清理临时数据</li>
              <li>内存使用警告</li>
            </ul>
          </div>
          <div class="performance-item">
            <div class="performance-icon">⚡</div>
            <h3>异步处理</h3>
            <p>避免UI冻结，保持流畅体验</p>
            <ul>
              <li>分批数据处理</li>
              <li>进度提示反馈</li>
              <li>可中断操作</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'HomeView',
  components: {}
}
</script>

<style scoped>
/* 整体布局 */
.home {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  text-align: left;
}

.hero-title {
  font-size: 3.5em;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3em;
  margin-bottom: 20px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.hero-tag {
  padding: 8px 16px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 14px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-3px);
}

/* 地图预览 */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-preview {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.map-icon {
  font-size: 4em;
  margin-bottom: 15px;
}

.file-types {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.file-types span {
  padding: 4px 8px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  font-weight: 600;
}

/* 功能特性区域 */
.features-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 60px;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 16px;
  margin-bottom: 20px;
}

.feature-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-tags span {
  padding: 4px 12px;
  border-radius: 15px;
  background: #e3f2fd;
  color: #1976d2;
  font-size: 12px;
  font-weight: 600;
}

/* 技术栈区域 */
.tech-section {
  padding: 20px 0;
  background: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.tech-item {
  padding: 30px;
}

.tech-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-weight: bold;
  font-size: 16px;
  color: white;
}

.tech-logo.vue {
  background: #4fc08d;
}

.tech-logo.leaflet {
  background: #199900;
}

.tech-logo.shpjs {
  background: #409eff;
}

.tech-logo.plotty {
  background: #cf649a;
}

.tech-logo.geotiff {
  background: #2c3e50;
}

.tech-logo.element {
  background: #409eff;
}

.tech-item p {
  color: #7f8c8d;
  font-weight: 500;
}

.tech-desc {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #7f8c8d;
}

/* 快速开始区域 */
.quickstart-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.quickstart-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 50px;
}

.step-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.step-number {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 10px;
}

.step-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.step-card p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 16px;
}

.quickstart-actions {
  text-align: center;
}

/* 性能特性区域 */
.performance-section {
  padding: 20px 0;
  background: #f8f9fa;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.performance-item {
  background: white;
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.performance-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.performance-icon {
  font-size: 3em;
  margin-bottom: 20px;
}

.performance-item h3 {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

.performance-item p {
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 16px;
}

.performance-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.performance-item ul li {
  margin-bottom: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 20px 20px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5em;
  }
  
  .hero-subtitle {
    font-size: 1.1em;
  }
  
  .hero-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .map-preview {
    width: 300px;
    height: 200px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .formats-grid {
    grid-template-columns: 1fr;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quickstart-steps {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 2em;
  }
  
  .hero-features {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .file-types {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2em;
  }
  
  .hero-subtitle {
    font-size: 1em;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .btn-large {
    padding: 15px 30px;
    font-size: 16px;
  }
  
  .feature-card,
  .format-card,
  .performance-item {
    padding: 30px 20px;
  }
  
  .map-preview {
    width: 280px;
    height: 180px;
  }
}

/* 数据格式区域 */
.formats-section {
  padding: 20px 0;
  background: white;
}

.formats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.format-card {
  background: #f8f9fa;
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.format-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  border-color: #3498db;
}

.format-icon {
  font-size: 3.5em;
  margin-bottom: 20px;
}

.format-card h3 {
  font-size: 1.8em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
}

.format-description {
  color: #7f8c8d;
  font-size: 16px;
  margin-bottom: 25px;
  font-style: italic;
}

.format-features {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
  text-align: left;
}

.format-features li {
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 14px;
}

.format-extensions {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  display: inline-block;
}

/* 按钮样式增强 */
.btn-large {
  padding: 18px 40px;
  font-size: 18px;
  font-weight: 700;
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-outline:hover {
  background: #3498db;
  color: white;
  transform: translateY(-3px);
}
</style>
