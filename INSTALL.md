# MapTool 安装指南

## 基础安装

```bash
# 克隆项目
git clone <repository-url>
cd MapTool

# 安装基础依赖
npm install
```

## TIF文件支持安装

为了支持TIF栅格文件的导入和渲染，需要安装plotty库：

```bash
# 安装plotty库
npm install plotty --save
```

### 验证安装

安装完成后，可以通过以下方式验证：

```bash
# 启动开发服务器
npm run serve

# 访问 http://localhost:8080/map
# 尝试上传TIF文件测试功能
```

## 依赖说明

### npm依赖
- `plotty` - 栅格数据可视化渲染库

### CDN依赖（已在index.html中配置）
- `shpjs` - Shapefile文件解析
- `geotiff` - GeoTIFF文件解析

## 故障排除

### plotty库安装失败

如果npm安装plotty失败，可以使用CDN方式：

1. 在 `public/index.html` 中添加：
```html
<script src="https://unpkg.com/plotty@latest/src/plotty.js"></script>
```

2. 系统会自动检测并使用CDN版本

### 常见问题

1. **TIF文件无法加载**
   - 确保已安装plotty库：`npm install plotty`
   - 检查浏览器控制台是否有错误信息

2. **渲染失败**
   - 确保TIF文件包含地理参考信息
   - 检查文件大小（建议<50MB）

3. **性能问题**
   - 减小TIF文件分辨率
   - 使用数据压缩
   - 考虑创建金字塔文件

## 开发环境

- Node.js >= 12.0.0
- npm >= 6.0.0
- 现代浏览器（Chrome >= 60, Firefox >= 60, Safari >= 12, Edge >= 79） 