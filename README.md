# MapTool 地图工具

这是一个基于Vue 2.0和Leaflet的地图工具项目，包含以下主要功能：

## 主要组件

### 1. LeafletMap 地图组件
- **位置**: `src/components/LeafletMap.vue`
- **功能**: 基于Leaflet的Vue地图组件
- **特性**:
  - 支持自定义地图中心点和缩放级别
  - 内置地图控制按钮（放大、缩小、重置视图）
  - 支持添加和管理标记点
  - 响应式设计，适配移动端
  - 丰富的事件回调（点击、缩放、移动等）

### 2. CollapsiblePanel 伸缩面板
- **位置**: `src/components/CollapsiblePanel.vue`
- **功能**: 伸缩面板，点击伸缩按钮往一个方向左右或上下伸缩，按钮位置可配置在上下左右四个位置

## 页面结构

### 地图演示页面
- **路由**: `/map`
- **文件**: `src/views/MapDemo.vue`
- **功能**: 
  - 展示LeafletMap组件的各种功能
  - 支持GeoJSON和Shapefile文件导入
  - 提供交互式控制面板
  - 实时显示地图状态信息
  - 多文件上传支持（Shapefile文件集）

## 技术栈

- **前端框架**: Vue 2.6.14
- **地图库**: Leaflet
- **UI组件**: Element UI
- **路由**: Vue Router
- **状态管理**: Vuex
- **样式**: SCSS
- **文件处理**: 
  - 原生File API
  - shpjs（Shapefile解析）
  - geotiff.js（TIF文件解析）
  - plotty.js（栅格数据渲染）

## LeafletMap 组件使用方法

### 基本用法

```vue
<template>
  <div>
    <LeafletMap
      :width="'100%'"
      :height="'400px'"
      :center="[39.9042, 116.4074]"
      :zoom="10"
      @map-ready="onMapReady"
      @map-click="onMapClick"
    />
  </div>
</template>

<script>
import LeafletMap from '@/components/LeafletMap.vue'

export default {
  components: {
    LeafletMap
  },
  methods: {
    onMapReady(map) {
      console.log('地图初始化完成', map)
    },
    onMapClick(clickInfo) {
      console.log('地图点击', clickInfo)
    }
  }
}
</script>
```

### 组件属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| width | String | '100%' | 地图容器宽度 |
| height | String | '400px' | 地图容器高度 |
| center | Array | [39.9042, 116.4074] | 初始中心点坐标 [纬度, 经度] |
| zoom | Number | 10 | 初始缩放级别 |
| showControls | Boolean | true | 是否显示控制按钮 |
| tileUrl | String | OpenStreetMap | 地图瓦片服务URL |
| attribution | String | '© OpenStreetMap contributors' | 瓦片服务属性说明 |

### 组件事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| map-ready | map | 地图初始化完成 |
| map-click | clickInfo | 地图点击事件 |
| zoom-change | zoom | 缩放级别变化 |
| center-change | center | 地图中心变化 |
| map-error | error | 地图初始化错误 |

### 组件方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| addMarker | latlng, options | marker | 添加标记点 |
| clearMarkers | - | - | 清除所有标记点 |
| setView | latlng, zoom | - | 设置地图中心点 |
| getMap | - | map | 获取地图实例 |

## 文件导入功能

### 支持的文件格式

#### 1. GeoJSON文件 📍
- **格式**: `.geojson`, `.json`
- **数据类型**: 矢量数据（点、线、面）
- **特点**: 完全支持，无需额外配置
- **使用**: 直接选择文件即可加载
- **大小限制**: 建议 < 50MB

#### 2. Shapefile文件 🗂️
- **格式**: `.shp` + `.shx` + `.dbf` (必需), `.prj` + `.cpg` (可选)
- **数据类型**: 矢量数据（点、线、面）
- **特点**: 需要完整文件集，需要配置shpjs库
- **使用**: 同时选择所有相关文件
- **大小限制**: 文件集总大小 < 200MB，单文件 < 50MB
- **性能优化**: 自动根据要素数量选择渲染策略

#### 3. TIF文件 🌍
- **格式**: `.tif`, `.tiff`
- **数据类型**: 栅格数据（卫星影像、DEM、气象数据等）
- **特点**: 使用plotty框架渲染，支持科学色彩方案
- **使用**: 选择单个TIF文件

### 配置依赖库

#### TIF文件支持（必需）
```bash
# 安装plotty库用于栅格数据渲染
npm install plotty --save
```

#### Shapefile支持（可选）

**方法1：CDN引入（推荐）**
在 `public/index.html` 中添加：
```html
<script src="https://unpkg.com/shpjs@latest/dist/shp.js"></script>
```

**方法2：npm安装**
```bash
npm install shpjs jszip --save
```

然后在 `src/main.js` 中添加：
```javascript
import shp from 'shpjs'
window.shp = shp
```

#### CDN依赖（已配置）
在 `public/index.html` 中已包含：
```html
<!-- geotiff库用于解析TIF文件 -->
<script src="https://unpkg.com/geotiff@latest/dist-browser/geotiff.js"></script>
```

### 使用方法

1. **GeoJSON文件**：点击"选择GeoJSON文件"按钮，选择单个文件
2. **Shapefile文件**：点击"选择Shapefile文件集"按钮，同时选择所有相关文件
3. **TIF文件**：点击"选择TIF栅格文件"按钮，选择单个TIF文件
4. 文件加载后会自动显示在地图上
5. 点击要素可查看属性信息（矢量数据）
6. 使用"清除所有图层"按钮可移除所有数据
7. 使用"适应数据范围"按钮可缩放到数据范围

### TIF文件详细说明

TIF文件是栅格数据格式，适用于：
- **卫星影像** - Landsat、Sentinel等
- **数字高程模型(DEM)** - 地形数据
- **气象数据** - 温度、降水等
- **环境监测** - 植被指数、污染数据等

**渲染特性**：
- 使用viridis色彩方案（科学可视化标准）
- 自动数据范围检测和归一化
- 支持透明度调整
- 地理参考信息自动识别

**性能建议**：
- 文件大小建议小于100MB
- 确保文件包含地理参考信息
- 大文件建议预处理后使用

## 大文件处理优化 🚀

### 自动性能优化策略

系统会根据数据规模自动选择最佳处理策略：

#### 小数据集（< 1000要素）
- **渲染方式**: 完整样式和交互
- **特性**: 详细弹窗、完整点击事件
- **性能**: 最佳用户体验

#### 中等数据集（1000-10000要素）
- **渲染方式**: 简化样式
- **特性**: 简化弹窗（显示主要属性）
- **性能**: 平衡性能和功能

#### 大数据集（> 10000要素）
- **渲染方式**: 分批处理
- **特性**: 轻量化样式，分批渲染
- **性能**: 优先保证流畅性

### 内存管理

- **实时监控**: 自动监控内存使用情况
- **分步处理**: 大文件分步读取，避免内存溢出
- **垃圾回收**: 自动清理临时数据
- **内存警告**: 使用率超过80%时自动提醒

### 文件大小限制

| 文件类型 | 推荐大小 | 最大支持 | 说明 |
|---------|---------|---------|------|
| GeoJSON | < 50MB | 取决于浏览器 | 单文件处理 |
| Shapefile | < 200MB | 取决于浏览器 | 文件集总大小 |
| TIF | < 100MB | 取决于浏览器 | 栅格数据 |

### 优化建议

1. **数据预处理**
   - 简化几何图形（减少顶点数）
   - 删除不必要的属性字段
   - 按区域分割大文件

2. **格式选择**
   - 推荐使用GeoJSON格式（处理更高效）
   - Shapefile适合标准GIS工作流
   - TIF适合栅格数据可视化

3. **分层加载**
   - 将大数据集分成多个小文件
   - 根据需要逐层加载
   - 使用图层管理功能

4. **浏览器优化**
   - 使用Chrome或Firefox最新版本
   - 关闭不必要的标签页和扩展
   - 确保充足的系统内存

### 故障排除

- **浏览器卡死**: 文件过大，建议分割数据
- **内存不足**: 清理浏览器缓存，关闭其他应用
- **加载缓慢**: 等待处理完成，避免重复操作
- **渲染异常**: 清除图层后重新加载

📖 **详细指南**: [大型Shapefile处理指南](/large-shapefile-guide.html)

## Project setup
```
npm install

# 安装TIF文件支持（栅格数据渲染）
npm install plotty --save
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## 项目特色

1. **现代化UI设计**: 采用渐变色导航栏和卡片式布局
2. **响应式设计**: 完美适配桌面端和移动端
3. **组件化开发**: 高度可复用的地图组件
4. **丰富的交互**: 支持多种地图操作和事件处理
5. **详细的文档**: 完整的使用说明和API文档

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 许可证

MIT License
