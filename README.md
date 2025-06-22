# MapTool 地图工具

这是一个基于 Vue 2.0 和 Leaflet 的现代化地图工具项目，专注于地理数据可视化和交互。

## 项目概述

MapTool 是一个功能强大的Web地图工具，支持多种地理数据格式的导入、可视化和交互。项目采用组件化设计，易于扩展和维护。

## 技术栈

- **前端框架**: Vue 2.6.14
- **地图库**: Leaflet 1.9.4
- **UI组件**: Element UI 2.15.14
- **路由**: Vue Router 3.5.1
- **状态管理**: Vuex 3.6.2
- **样式**: SCSS
- **构建工具**: Vue CLI 5.0

## 核心功能

### 🗺️ 地图展示
- 基于 Leaflet 的高性能地图渲染
- 多种底图支持（OpenStreetMap、自定义瓦片等）
- 响应式设计，完美适配桌面端和移动端
- 丰富的地图交互功能

### 📁 文件导入支持
- **GeoJSON 文件** (.geojson, .json) - 矢量数据
- **Shapefile 文件集** (.shp + .shx + .dbf + .prj) - 标准GIS格式
- **TIF 栅格文件** (.tif, .tiff) - 卫星影像、DEM等
- 多文件同时上传和处理

### 🎨 数据可视化
- 矢量数据符号化渲染
- 栅格数据科学色彩方案（viridis）
- 交互式属性查询
- 图层管理和控制

### ⚡ 性能优化
- 大数据集分批处理
- 内存使用监控
- 自动性能策略选择
- 渐进式加载

## 项目结构

```
map-tool/
├── public/                 # 静态资源
│   ├── index.html         # 主页面模板
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码
│   ├── components/        # 公共组件
│   │   ├── LeafletMap.vue # 地图组件
│   │   └── HelloWorld.vue # 示例组件
│   ├── views/            # 页面组件
│   │   ├── HomeView.vue  # 主页
│   │   ├── MapDemo.vue   # 地图演示页
│   │   └── AboutView.vue # 关于页面
│   ├── router/           # 路由配置
│   ├── store/            # Vuex状态管理
│   ├── assets/           # 静态资源
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 核心组件

### LeafletMap 地图组件

**位置**: `src/components/LeafletMap.vue`

这是项目的核心地图组件，基于 Leaflet 构建，提供了完整的地图功能。

#### 组件属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| width | String | '100%' | 地图容器宽度 |
| height | String | '400px' | 地图容器高度 |
| center | Array | [39.9042, 116.4074] | 初始中心点 [纬度, 经度] |
| zoom | Number | 10 | 初始缩放级别 |
| showControls | Boolean | true | 是否显示控制按钮 |
| tileUrl | String | OpenStreetMap | 地图瓦片服务URL |
| attribution | String | '© OpenStreetMap' | 瓦片服务属性 |

#### 组件事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| map-ready | map | 地图初始化完成 |
| map-click | clickInfo | 地图点击事件 |
| zoom-change | zoom | 缩放级别变化 |
| center-change | center | 地图中心变化 |

#### 基本用法

```vue
<template>
  <div>
    <LeafletMap
      :width="'100%'"
      :height="'600px'"
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

## 页面说明

### 主页 (HomeView.vue)
- **路由**: `/`
- **功能**: 项目介绍和导航
- **特色**: 现代化UI设计，渐变色背景

### 地图演示页 (MapDemo.vue)
- **路由**: `/map`
- **功能**: 
  - 完整的地图功能演示
  - 文件导入和数据可视化
  - 交互式控制面板
  - 实时地图状态显示

### 关于页面 (AboutView.vue)
- **路由**: `/about`
- **功能**: 项目信息和版本说明

## 文件格式支持

### 📍 GeoJSON 文件
- **格式**: `.geojson`, `.json`
- **类型**: 矢量数据（点、线、面）
- **特点**: 原生支持，加载速度快
- **适用**: 轻量级地理数据

### 🗂️ Shapefile 文件集
- **格式**: `.shp` + `.shx` + `.dbf` (必需), `.prj` + `.cpg` (可选)
- **类型**: 矢量数据
- **特点**: GIS标准格式，功能完整
- **适用**: 专业GIS数据

### 🌍 TIF 栅格文件
- **格式**: `.tif`, `.tiff`
- **类型**: 栅格数据
- **特点**: 科学色彩方案，地理参考
- **适用**: 卫星影像、DEM、气象数据

## 性能优化

### 智能分级处理
- **小数据集** (< 1,000要素): 完整渲染和交互
- **中等数据集** (1,000-10,000要素): 简化样式
- **大数据集** (> 10,000要素): 分批处理

### 内存管理
- 实时内存监控
- 自动垃圾回收
- 分步数据处理
- 内存警告提示

### 文件大小建议

| 文件类型 | 推荐大小 | 最大支持 |
|---------|---------|---------|
| GeoJSON | < 50MB | 视浏览器而定 |
| Shapefile | < 200MB | 视浏览器而定 |
| TIF | < 100MB | 视浏览器而定 |

## 快速开始

### 1. 环境准备
```bash
# 确保安装 Node.js 14+
node --version
npm --version
```

### 2. 项目安装
```bash
# 克隆项目
git clone [项目地址]
cd map-tool

# 安装依赖
npm install
```

### 3. 开发模式
```bash
# 启动开发服务器
npm run serve

# 项目将在 http://localhost:8080 运行
```

### 4. 生产构建
```bash
# 构建生产版本
npm run build

# 构建文件将在 dist/ 目录
```

## 依赖库配置

### 核心依赖（已安装）
- `leaflet` - 地图核心库
- `plotty` - 栅格数据渲染
- `shpjs` - Shapefile解析
- `jszip` - 文件压缩处理

### CDN 依赖
在 `public/index.html` 中包含：
```html
<!-- geotiff库用于解析TIF文件 -->
<script src="https://unpkg.com/geotiff@latest/dist-browser/geotiff.js"></script>
```

## 使用指南

### 导入数据文件
1. 访问地图演示页面 (`/map`)
2. 根据数据类型选择对应的导入按钮
3. 选择文件（Shapefile需要选择完整文件集）
4. 等待处理完成，数据将自动显示在地图上

### 数据交互
- **点击要素**: 查看属性信息
- **缩放地图**: 鼠标滚轮或控制按钮
- **平移地图**: 鼠标拖拽
- **适应范围**: 点击"适应数据范围"按钮

### 图层管理
- **清除图层**: 点击"清除所有图层"
- **图层切换**: 通过控制面板管理
- **透明度调整**: 栅格数据支持透明度设置

## 浏览器支持

- Chrome >= 60
- Firefox >= 60
- Safari >= 12
- Edge >= 79

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循 Vue 官方风格指南
- 使用 Standard 代码规范

### 组件开发
- 单文件组件 (.vue)
- Props 类型检查
- 事件命名规范
- 响应式设计原则

## 项目特色

✨ **现代化设计**: 简洁美观的界面设计
🚀 **高性能**: 优化的数据处理和渲染
🔧 **易扩展**: 组件化架构，便于功能扩展
📱 **响应式**: 完美适配各种设备
🌍 **专业性**: 支持标准GIS数据格式
⚡ **智能化**: 自动性能优化策略

## 版本信息

- **当前版本**: 0.1.0
- **Vue版本**: 2.6.14
- **Leaflet版本**: 1.9.4

## 许可证

MIT License

---

**注**: 本项目专注于地理数据可视化，适合GIS应用开发、数据分析和地图展示等场景。
