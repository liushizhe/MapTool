<template>
  <div class="map-demo">
    <!-- 返回按钮 - 浮动在左上角 -->
    <button @click="goBack" class="back-btn-float" title="返回首页 (Esc)">
      <span class="back-icon">←</span>
    </button>

    <!-- 功能控制面板 -->
    <div class="demo-controls">
      <div class="control-section">
        <div class="file-upload-area">
          <!-- 单文件上传 -->
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept=".geojson,.json"
            class="file-input"
            id="file-input"
          />
          <label for="file-input" class="file-upload-btn">
            <span class="upload-icon">📁</span>
            选择GeoJSON文件
          </label>
          
          <!-- 多文件上传（用于shapefile） -->
          <input 
            type="file" 
            ref="shapefileInput" 
            @change="handleShapefileUpload" 
            accept=".shp,.shx,.dbf,.prj,.cpg"
            multiple
            class="file-input"
            id="shapefile-input"
          />
          <label for="shapefile-input" class="file-upload-btn shapefile-btn">
            <span class="upload-icon">🗂️</span>
            选择Shapefile文件集
          </label>
          
          <!-- TIF文件上传 -->
          <input 
            type="file" 
            ref="tifInput" 
            @change="handleTifUpload" 
            accept=".tif,.tiff"
            class="file-input"
            id="tif-input"
          />
          <label for="tif-input" class="file-upload-btn tif-btn">
            <span class="upload-icon">🌍</span>
            选择TIF栅格文件
          </label>
          
          <div class="file-info" v-if="uploadedFiles.length > 0">
            <div v-for="file in uploadedFiles" :key="file.name" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <span class="file-type">{{ getFileType(file.name) }}</span>
            </div>
          </div>
        </div>
        <div class="button-group">
          <button @click="clearLayers" class="demo-btn secondary">
            清除图层
          </button>
          <button @click="fitToData" class="demo-btn" :disabled="!hasData">
            适应数据范围
          </button>
        </div>
      </div>
    </div>

    <!-- 地图组件 -->
    <div class="map-wrapper">
      <LeafletMap
        ref="leafletMap"
        :width="'100%'"
        :height="'500px'"
        :center="mapCenter"
        :zoom="mapZoom"
        :show-controls="true"
        @map-ready="onMapReady"
        @map-click="onMapClick"
        @zoom-change="onZoomChange"
        @center-change="onCenterChange"
      />
    </div>

    <!-- 点击信息显示 -->
    <!-- <div class="click-info" v-if="lastClickInfo && lastClickInfo.latlng">
      <h3>最后点击位置</h3>
      <p>
        <strong>坐标:</strong> 
        纬度 {{ lastClickInfo.latlng.lat.toFixed(6) }}, 
        经度 {{ lastClickInfo.latlng.lng.toFixed(6) }}
      </p>
    </div> -->

  </div>
</template>

<script>
import LeafletMap from '@/components/LeafletMap.vue'

// 动态导入plotty库
let plotty = null
try {
  plotty = require('plotty')
  if (plotty && typeof plotty === 'object' && plotty.default) {
    plotty = plotty.default
  }
  window.plotty = plotty
} catch (error) {
  console.log('plotty库未安装，将使用CDN版本或提示用户安装')
}

export default {
  name: 'MapDemo',
  components: {
    LeafletMap
  },
  data() {
    return {
      // 地图配置
      mapCenter: [39.9042, 116.4074], // 北京坐标
      mapZoom: 10,
      
      // 地图状态信息
      currentZoom: 10,
      currentCenter: { lat: 39.9042, lng: 116.4074 },
      lastClickInfo: null,
      
      // 文件上传相关
      uploadedFiles: [], // 已上传的文件列表
      shapefileFiles: {}, // shapefile文件集
      loadedLayers: [], // 已加载的图层
      totalFeatures: 0, // 要素总数
      hasData: false // 是否有数据
    }
  },
  methods: {
    /**
     * 地图初始化完成回调
     */
    onMapReady(map) {
      try {
        console.log('地图组件初始化完成', map)
        this.map = map
      } catch (error) {
        console.error('地图初始化回调出错:', error)
      }
    },

    /**
     * 地图点击事件处理
     */
    onMapClick(clickInfo) {
      try {
        if (clickInfo && clickInfo.latlng) {
          this.lastClickInfo = clickInfo
          console.log('地图点击:', clickInfo)
        } else {
          console.warn('点击事件信息不完整:', clickInfo)
        }
      } catch (error) {
        console.error('处理地图点击事件时出错:', error)
        this.lastClickInfo = null
      }
    },

    /**
     * 缩放级别变化处理
     */
    onZoomChange(zoom) {
      this.currentZoom = zoom
    },

    /**
     * 地图中心变化处理
     */
    onCenterChange(center) {
      this.currentCenter = center
    },

    /**
     * 处理GeoJSON文件上传
     */
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.uploadedFiles = [file]
      const fileExtension = file.name.split('.').pop().toLowerCase()

      try {
        if (fileExtension === 'geojson' || fileExtension === 'json') {
          this.loadGeoJSON(file)
        } else {
          this.$message({
            message: '请选择GeoJSON格式文件',
            type: 'error'
          })
        }
      } catch (error) {
        console.error('文件处理错误:', error)
        this.$message({
          message: '文件处理失败: ' + error.message,
          type: 'error'
        })
      }
    },

    /**
     * 处理Shapefile文件集上传
     */
    handleShapefileUpload(event) {
      const files = Array.from(event.target.files)
      if (files.length === 0) return

      this.uploadedFiles = files
      this.shapefileFiles = {}

      // 计算总文件大小
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)
      console.log('Shapefile文件集总大小:', this.formatFileSize(totalSize))

      // 检查文件大小限制
      const maxTotalSize = 200 * 1024 * 1024 // 200MB
      if (totalSize > maxTotalSize) {
        this.$message({
          message: `文件集过大 (${this.formatFileSize(totalSize)})，建议使用小于200MB的Shapefile`,
          type: 'warning',
          duration: 8000
        })
        return
      }

      // 按扩展名分类文件
      files.forEach(file => {
        const extension = file.name.split('.').pop().toLowerCase()
        this.shapefileFiles[extension] = file
        
        // 检查单个文件大小
        if (file.size > 50 * 1024 * 1024) { // 50MB
          console.warn(`文件 ${file.name} 较大 (${this.formatFileSize(file.size)})，可能影响性能`)
        }
      })

      // 检查必需的文件
      const requiredFiles = ['shp', 'shx', 'dbf']
      const missingFiles = requiredFiles.filter(ext => !this.shapefileFiles[ext])

      if (missingFiles.length > 0) {
        this.$message({
          message: `缺少必需的文件: ${missingFiles.map(ext => '.' + ext).join(', ')}`,
          type: 'error'
        })
        return
      }

      try {
        // 显示加载提示
        this.$message({
          message: '正在处理Shapefile，大文件可能需要较长时间...',
          type: 'info',
          duration: 3000
        })
        
        this.loadShapefileSet(this.shapefileFiles)
      } catch (error) {
        console.error('Shapefile处理错误:', error)
        this.$message({
          message: 'Shapefile处理失败: ' + error.message,
          type: 'error'
        })
      }
    },

    /**
     * 加载GeoJSON文件
     */
    async loadGeoJSON(file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const geojsonData = JSON.parse(e.target.result)
          await this.addGeoJSONLayerOptimized(geojsonData, file.name)
        } catch (error) {
          console.error('GeoJSON解析错误:', error)
          this.$message({
            message: 'GeoJSON文件格式错误',
            type: 'error'
          })
        }
      }
      reader.readAsText(file)
    },

    /**
     * 加载Shapefile文件集
     */
    async loadShapefileSet(files) {
      console.log("loadShapefileSet", files)
      
      let shpBuffer = null
      let shxBuffer = null
      let dbfBuffer = null
      let prjText = null
      
      try {
        // 显示详细的加载进度
        console.log('开始读取Shapefile文件...')
        
        // 分步骤读取文件，避免同时加载所有文件到内存
        console.log('正在读取.shp文件...')
        this.$message({
          message: '正在读取几何数据(.shp)...',
          type: 'info',
          duration: 2000
        })
        shpBuffer = await this.fileToArrayBufferWithProgress(files.shp, 'SHP')
        
        console.log('正在读取.shx文件...')
        this.$message({
          message: '正在读取索引数据(.shx)...',
          type: 'info',
          duration: 2000
        })
        shxBuffer = await this.fileToArrayBufferWithProgress(files.shx, 'SHX')
        
        console.log('正在读取.dbf文件...')
        this.$message({
          message: '正在读取属性数据(.dbf)...',
          type: 'info',
          duration: 2000
        })
        dbfBuffer = await this.fileToArrayBufferWithProgress(files.dbf, 'DBF')
        
        // 可选文件
        if (files.prj) {
          console.log('正在读取.prj文件...')
          prjText = await this.fileToText(files.prj)
        }

        console.log('文件读取完成，开始解析Shapefile...')
        this.$message({
          message: '文件读取完成，正在解析数据...',
          type: 'info',
          duration: 3000
        })

        // 解析shapefile（优化内存使用）
        const geojsonData = await this.parseShapefileOptimized({
          shp: shpBuffer,
          shx: shxBuffer,
          dbf: dbfBuffer,
          prj: prjText
        }, files.shp.name)
        
        console.log("geojsonData解析完成", geojsonData ? geojsonData.features?.length : 0, "个要素")
        
        if (geojsonData) {
          // 清理缓冲区以释放内存
          shpBuffer = null
          shxBuffer = null
          dbfBuffer = null
          
          // 强制垃圾回收（如果可用）
          if (window.gc) {
            window.gc()
          }
          
          await this.addGeoJSONLayerOptimized(geojsonData, files.shp.name.replace('.shp', ''))
          
          // 清理内存
          this.cleanupAfterLargeData()
        }
        
      } catch (error) {
        console.error('Shapefile解析错误:', error)
        
        // 清理内存
        shpBuffer = null
        shxBuffer = null
        dbfBuffer = null
        prjText = null
        
        // 提供具体的错误信息和建议
        let errorMessage = 'Shapefile解析失败'
        if (error.message.includes('内存')) {
          errorMessage = '文件过大导致内存不足，建议使用更小的文件或将数据分割'
        } else if (error.message.includes('shpjs')) {
          errorMessage = '缺少shpjs库，请查看使用指南进行配置'
        } else if (error.message.includes('格式')) {
          errorMessage = 'Shapefile格式错误，建议转换为GeoJSON格式'
        }
        
        this.$message({
          message: errorMessage,
          type: 'error',
          duration: 8000
        })
        
        throw error
      }
    },

    /**
     * 文件转ArrayBuffer（带进度提示）
     */
    fileToArrayBufferWithProgress(file, fileType) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
          console.log(`${fileType}文件读取完成:`, this.formatFileSize(file.size))
          resolve(e.target.result)
        }
        
        reader.onerror = (e) => {
          console.error(`${fileType}文件读取失败:`, e)
          reject(new Error(`${fileType}文件读取失败`))
        }
        
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            if (progress % 20 === 0) { // 每20%显示一次进度
              console.log(`${fileType}文件读取进度: ${progress}%`)
            }
          }
        }
        
        reader.readAsArrayBuffer(file)
      })
    },

    /**
     * 文件转文本
     */
    fileToText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    },

    /**
     * 优化的Shapefile解析方法
     */
    async parseShapefileOptimized(buffers, fileName) {
      try {
        // 检查shpjs库是否通过CDN加载
        if (typeof window.shp === 'undefined') {
          throw new Error('shpjs库未加载。请在index.html中添加CDN链接，详见使用指南。')
        }
        
        console.log('检测到shpjs库，开始解析shapefile')
        console.log('文件大小:', {
          shp: this.formatFileSize(buffers.shp.byteLength),
          shx: this.formatFileSize(buffers.shx.byteLength),
          dbf: this.formatFileSize(buffers.dbf.byteLength)
        })
        
        // shpjs库通过CDN加载时，通常是一个函数
        if (typeof window.shp === 'function') {
          console.log('使用shpjs解析shapefile...')
          
          // 创建包含所有文件的对象
          const shapefileData = {
            shp: buffers.shp,
            shx: buffers.shx,
            dbf: buffers.dbf
          }
          
          // 如果有投影文件，也包含进去
          if (buffers.prj) {
            shapefileData.prj = buffers.prj
          }
          
          // 使用Promise包装，避免阻塞UI
          const geojsonData = await new Promise((resolve, reject) => {
            try {
              // 使用setTimeout让出控制权，避免UI冻结
              setTimeout(async () => {
                try {
                  const result = await window.shp(shapefileData)
                  resolve(result)
                } catch (error) {
                  reject(error)
                }
              }, 100)
            } catch (error) {
              reject(error)
            }
          })
          
          // 验证解析结果
          if (!geojsonData) {
            throw new Error('Shapefile解析结果为空')
          }
          
          const featureCount = geojsonData.features ? geojsonData.features.length : 0
          console.log('shapefile解析成功，要素数量:', featureCount)
          
          // 检查要素数量
          if (featureCount > 50000) {
            console.warn(`要素数量较多 (${featureCount})，可能影响性能`)
            this.$message({
              message: `数据包含${featureCount}个要素，渲染可能需要较长时间`,
              type: 'warning',
              duration: 5000
            })
          }
          
          return geojsonData
        } else {
          throw new Error('shpjs库格式不正确，请检查CDN链接')
        }
      } catch (error) {
        console.error('Shapefile解析错误:', error)
        
        // 提供更友好的错误信息
        if (error.message.includes('shpjs库未加载')) {
          this.$message({
            message: '请先配置shpjs库。查看"Shapefile使用指南"了解配置方法。',
            type: 'warning',
            duration: 5000
          })
        } else if (error.message.includes('内存不足') || error.name === 'RangeError') {
          throw new Error('内存不足，文件过大')
        }
        
        throw error
      }
    },

    /**
     * 优化的GeoJSON图层添加方法（分批处理大数据集）
     */
    async addGeoJSONLayerOptimized(geojsonData, fileName) {
      if (!this.map) return

      // 使用全局Leaflet
      const L = window.L
      if (!L) {
        console.error('Leaflet库未加载')
        this.$message({
          message: 'Leaflet库未正确加载',
          type: 'error'
        })
        return
      }

      const featureCount = this.countFeatures(geojsonData)
      console.log(`开始添加GeoJSON图层: ${fileName}, 要素数量: ${featureCount}`)

      try {
        let layer

        // 根据要素数量选择不同的处理策略
        if (featureCount > 10000) {
          // 大数据集：分批处理
          console.log('使用分批处理模式（大数据集）')
          this.$message({
            message: `正在渲染${featureCount}个要素，请稍候...`,
            type: 'info',
            duration: 5000
          })
          
          layer = await this.createLayerBatched(geojsonData, L)
        } else if (featureCount > 1000) {
          // 中等数据集：简化样式
          console.log('使用简化样式模式（中等数据集）')
          this.$message({
            message: `正在渲染${featureCount}个要素...`,
            type: 'info',
            duration: 3000
          })
          
          layer = this.createLayerSimplified(geojsonData, L)
        } else {
          // 小数据集：正常处理
          console.log('使用正常处理模式（小数据集）')
          layer = this.createLayerNormal(geojsonData, L)
        }

        // 添加到地图
        layer.addTo(this.map)
        
        // 记录图层信息
        this.loadedLayers.push({
          name: fileName,
          layer: layer,
          type: 'vector',
          featureCount: featureCount
        })

        // 更新统计信息
        this.updateDataStats()
        this.hasData = true

        // 适应数据范围
        this.fitToData()

        console.log('GeoJSON图层加载成功:', fileName)
        this.$message({
          message: `成功加载 ${fileName} (${featureCount}个要素)`,
          type: 'success'
        })
        
      } catch (error) {
        console.error('图层添加错误:', error)
        this.$message({
          message: '图层添加失败: ' + error.message,
          type: 'error'
        })
        throw error
      }
    },

    /**
     * 创建分批处理的图层（大数据集）
     */
    async createLayerBatched(geojsonData, L) {
      const layerGroup = L.layerGroup()
      const features = geojsonData.features || [geojsonData]
      const batchSize = 1000 // 每批处理1000个要素
      
      for (let i = 0; i < features.length; i += batchSize) {
        const batch = features.slice(i, i + batchSize)
        const batchGeoJSON = {
          type: 'FeatureCollection',
          features: batch
        }
        
        const batchLayer = L.geoJSON(batchGeoJSON, {
          style: {
            color: '#3388ff',
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.2
          },
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 3,
              color: '#3388ff',
              weight: 1,
              opacity: 0.6,
              fillOpacity: 0.3
            })
          }
        })
        
        layerGroup.addLayer(batchLayer)
        
        // 让出控制权，避免UI冻结
        if (i % (batchSize * 5) === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }
      
      return layerGroup
    },

    /**
     * 创建简化样式的图层（中等数据集）
     */
    createLayerSimplified(geojsonData, L) {
      return L.geoJSON(geojsonData, {
        style: {
          color: '#3388ff',
          weight: 1,
          opacity: 0.7,
          fillOpacity: 0.3
        },
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 4,
            color: '#3388ff',
            weight: 1,
            opacity: 0.7,
            fillOpacity: 0.4
          })
        },
        onEachFeature: (feature, layer) => {
          // 简化的弹窗，只显示主要属性
          if (feature.properties) {
            const props = feature.properties
            const mainProps = Object.keys(props).slice(0, 3) // 只显示前3个属性
            const content = mainProps.map(key => `${key}: ${props[key]}`).join('<br>')
            layer.bindPopup(content)
          }
        }
      })
    },

    /**
     * 创建正常样式的图层（小数据集）
     */
    createLayerNormal(geojsonData, L) {
      return L.geoJSON(geojsonData, {
        style: (feature) => {
          return {
            color: '#3388ff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3
          }
        },
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 5,
            color: '#3388ff',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.5
          })
        },
        onEachFeature: (feature, layer) => {
          try {
            if (feature.properties) {
              const props = feature.properties
              const content = Object.keys(props)
                .map(key => `<strong>${key}:</strong> ${props[key]}`)
                .join('<br>')
              layer.bindPopup(content)
            }
            
            layer.on('click', (e) => {
              try {
                this.lastClickInfo = {
                  latlng: e.latlng,
                  properties: feature.properties
                }
                L.DomEvent.stopPropagation(e)
              } catch (error) {
                console.error('处理要素事件时出错:', error)
              }
            })
          } catch (error) {
            console.error('处理要素事件时出错:', error)
          }
        }
      })
    },

    /**
     * 计算要素数量
     */
    countFeatures(geojsonData) {
      if (geojsonData.type === 'FeatureCollection') {
        return geojsonData.features.length
      } else if (geojsonData.type === 'Feature') {
        return 1
      }
      return 0
    },

    /**
     * 更新数据统计信息
     */
    updateDataStats() {
      this.totalFeatures = this.loadedLayers.reduce((total, layer) => {
        return total + layer.featureCount
      }, 0)
    },

    /**
     * 清除所有图层
     */
    clearLayers() {
      if (!this.map) return

      this.loadedLayers.forEach(layerInfo => {
        this.map.removeLayer(layerInfo.layer)
      })

      this.loadedLayers = []
      this.totalFeatures = 0
      this.hasData = false
      this.uploadedFiles = []
      this.shapefileFiles = {}

      // 重置文件输入
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
      if (this.$refs.shapefileInput) {
        this.$refs.shapefileInput.value = ''
      }
      if (this.$refs.tifInput) {
        this.$refs.tifInput.value = ''
      }

      // 清理内存
      this.forceGarbageCollection()

      this.$message({
        message: '已清除所有图层',
        type: 'success'
      })
    },

    /**
     * 适应数据范围
     */
    fitToData() {
      if (!this.map || this.loadedLayers.length === 0) return

      try {
        const L = window.L
        if (!L) {
          console.error('Leaflet库未加载')
          return
        }

        // 收集所有图层的边界
        let allBounds = null
        
        this.loadedLayers.forEach(layerInfo => {
          if (layerInfo.type === 'raster' && layerInfo.bounds) {
            // 栅格图层使用预定义的边界
            const bounds = L.latLngBounds(layerInfo.bounds)
            if (!allBounds) {
              allBounds = bounds
            } else {
              allBounds.extend(bounds)
            }
          } else if (layerInfo.type === 'vector' || !layerInfo.type) {
            // 矢量图层使用图层边界
            const bounds = layerInfo.layer.getBounds()
            if (!allBounds) {
              allBounds = bounds
            } else {
              allBounds.extend(bounds)
            }
          }
        })

        if (allBounds) {
          this.map.fitBounds(allBounds, { padding: [20, 20] })
        }
      } catch (error) {
        console.error('适应数据范围失败:', error)
      }
    },

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    /**
     * 格式化中心点坐标显示
     */
    formatCenter(center) {
      if (!center) return '未知'
      return `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
    },

    /**
     * 处理TIF文件上传
     */
    handleTifUpload(event) {
      const file = event.target.files[0]
      console.log("handleTifUpload", file)
      if (!file) return

      this.uploadedFiles = [file]
      const fileExtension = file.name.split('.').pop().toLowerCase()

      try {
        if (fileExtension === 'tif' || fileExtension === 'tiff') {
          this.loadTifFile(file)
        } else {
          this.$message({
            message: '请选择TIF格式文件',
            type: 'error'
          })
        }
      } catch (error) {
        console.error('TIF文件处理错误:', error)
        this.$message({
          message: 'TIF文件处理失败: ' + error.message,
          type: 'error'
        })
      }
    },

    /**
     * 加载TIF文件
     */
    async loadTifFile(file) {
      try {
        console.log('开始加载TIF文件:', file.name, '大小:', this.formatFileSize(file.size))
        
        // 检查文件大小
        const maxFileSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxFileSize) {
          throw new Error(`文件过大 (${this.formatFileSize(file.size)})，建议使用小于100MB的文件`)
        }
        
        // 检查plotty库是否可用（支持npm安装和CDN两种方式）
        let plottyLib = null
        if (typeof window.plotty !== 'undefined') {
          plottyLib = window.plotty
        } else if (typeof plotty !== 'undefined') {
          plottyLib = plotty
        }
        
        if (!plottyLib) {
          throw new Error('plotty库未加载。请通过npm安装或在index.html中添加CDN链接。')
        }

        // 检查geotiff库是否可用
        if (typeof window.GeoTIFF === 'undefined') {
          throw new Error('geotiff库未加载。请在index.html中添加geotiff CDN链接。')
        }

        console.log('plotty库检测成功，类型:', typeof plottyLib)

        // 读取文件为ArrayBuffer
        console.log('正在读取文件...')
        const arrayBuffer = await this.fileToArrayBuffer(file)
        
        // 解析GeoTIFF
        console.log('正在解析GeoTIFF...')
        const tiff = await window.GeoTIFF.fromArrayBuffer(arrayBuffer)
        const image = await tiff.getImage()
        
        // 获取地理信息
        const bbox = image.getBoundingBox()
        const width = image.getWidth()
        const height = image.getHeight()
        
        console.log('TIF文件信息:', {
          width,
          height,
          bbox,
          pixelCount: width * height
        })

        // 检查数据大小
        const pixelCount = width * height
        const maxPixels = 10000000 // 1000万像素
        if (pixelCount > maxPixels) {
          console.warn(`数据量较大 (${pixelCount} 像素)，可能影响性能`)
          this.$message({
            message: `数据量较大，正在处理中，请稍候...`,
            type: 'info',
            duration: 3000
          })
        }

        // 读取栅格数据
        console.log('正在读取栅格数据...')
        const rasters = await image.readRasters()
        
        if (!rasters || rasters.length === 0) {
          throw new Error('无法读取栅格数据')
        }

        console.log('栅格数据读取完成，波段数:', rasters, bbox, width, height)

        // 使用plotty渲染栅格数据
        await this.renderTifWithPlotty(rasters[0], bbox, width, height, file.name, plottyLib)
        
      } catch (error) {
        console.error('TIF文件加载错误:', error)
        
        // 提供更友好的错误信息
        if (error.message.includes('plotty库未加载')) {
          this.$message({
            message: '请先安装plotty库：npm install plotty，或在index.html中添加CDN链接。',
            type: 'warning',
            duration: 5000
          })
        } else if (error.message.includes('geotiff库未加载')) {
          this.$message({
            message: '请先配置geotiff库。需要在index.html中添加相关CDN链接。',
            type: 'warning',
            duration: 5000
          })
        } else if (error.message.includes('文件过大')) {
          this.$message({
            message: error.message,
            type: 'warning',
            duration: 5000
          })
        } else {
          this.$message({
            message: 'TIF文件加载失败: ' + error.message,
            type: 'error'
          })
        }
        
        throw error
      }
    },

    /**
     * 使用plotty渲染TIF数据
     */
    async renderTifWithPlotty(rasterData, bbox, width, height, fileName, plottyLib) {
      try {
        const L = window.L
        if (!L) {
          throw new Error('Leaflet库未加载')
        }

        console.log('开始渲染TIF数据:', {
          fileName,
          width,
          height,
          dataLength: rasterData.length,
          dataType: rasterData.constructor.name
        })

        // 验证数据完整性
        if (!rasterData || rasterData.length === 0) {
          throw new Error('栅格数据为空')
        }

        if (rasterData.length !== width * height) {
          throw new Error(`数据长度不匹配：期望 ${width * height}，实际 ${rasterData.length}`)
        }

        // 创建canvas元素
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        // 安全地计算数据的最小值和最大值，避免栈溢出
        console.log('正在计算数据范围...')
        let min = Infinity
        let max = -Infinity
        let validCount = 0
        
        // 分批处理大数据集，避免栈溢出
        const batchSize = 10000
        for (let i = 0; i < rasterData.length; i += batchSize) {
          const endIdx = Math.min(i + batchSize, rasterData.length)
          
          for (let j = i; j < endIdx; j++) {
            const value = rasterData[j]
            // 跳过无效值（NaN、Infinity等）
            if (isFinite(value)) {
              if (value < min) min = value
              if (value > max) max = value
              validCount++
            }
          }
          
          // 每处理一定数量的数据，让出控制权
          if (i % 100000 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0))
          }
        }
        
        console.log('数据范围计算完成:', { 
          min, 
          max, 
          validCount, 
          totalCount: rasterData.length,
          validRatio: (validCount / rasterData.length * 100).toFixed(2) + '%'
        })

        // 检查数据有效性
        if (validCount === 0 || !isFinite(min) || !isFinite(max)) {
          throw new Error('数据中没有有效的数值')
        }
        
        if (min === max) {
          console.warn('数据值都相同，调整范围以便显示')
          max = min + 1
        }
        
        console.log('正在创建plotty实例...')
        plottyLib.addColorScale("mycolorscale", ["#ff0000", "#00ff00", "#0000ff"], [0, 0.5, 1]);
        // 创建plotty实例
        const plot = new plottyLib.plot({
          canvas: canvas,
          data: rasterData,
          width: width,
          height: height,
          domain: [min, max],
          colorScale: 'mycolorscale' // 使用viridis色彩方案
        })
        
        console.log('正在渲染到canvas...')
        
        // 渲染到canvas
        plot.render()
        
        console.log('正在创建图像覆盖层...')
        
        // 创建图像覆盖层
        const imageBounds = [
          [bbox[1], bbox[0]], // 西南角 [lat, lng]
          [bbox[3], bbox[2]]  // 东北角 [lat, lng]
        ]
        
        const imageOverlay = L.imageOverlay(canvas.toDataURL(), imageBounds, {
          opacity: 0.8,
          interactive: true
        })
        
        // 添加到地图
        imageOverlay.addTo(this.map)
        
        // 记录图层信息
        this.loadedLayers.push({
          name: fileName,
          layer: imageOverlay,
          type: 'raster',
          bounds: imageBounds
        })

        this.hasData = true

        // 适应数据范围
        this.map.fitBounds(imageBounds)

        console.log('TIF图层渲染成功:', fileName)
        this.$message({
          message: `成功加载栅格数据 ${fileName}`,
          type: 'success'
        })
        
      } catch (error) {
        console.error('plotty渲染错误:', error)
        this.$message({
          message: 'TIF文件渲染失败: ' + error.message,
          type: 'error'
        })
        throw error
      }
    },

    /**
     * 获取文件类型
     */
    getFileType(fileName) {
      const extension = fileName.split('.').pop().toLowerCase()
      switch (extension) {
        case 'geojson':
        case 'json':
          return '矢量数据'
        case 'shp':
        case 'shx':
        case 'dbf':
        case 'prj':
        case 'cpg':
          return '矢量数据'
        case 'tif':
        case 'tiff':
          return '栅格数据'
        default:
          return '未知类型'
      }
    },

    /**
     * 文件转ArrayBuffer（兼容性方法）
     */
    fileToArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    },

    /**
     * 监控内存使用情况
     */
    checkMemoryUsage() {
      if (performance.memory) {
        const memory = performance.memory
        const used = Math.round(memory.usedJSHeapSize / 1024 / 1024)
        const total = Math.round(memory.totalJSHeapSize / 1024 / 1024)
        const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        
        console.log(`内存使用情况: ${used}MB / ${total}MB (限制: ${limit}MB)`)
        
        // 如果内存使用超过80%，发出警告
        if (used / limit > 0.8) {
          console.warn('内存使用率较高，建议清理图层或使用更小的数据文件')
          this.$message({
            message: '内存使用率较高，建议清理图层或使用更小的数据文件',
            type: 'warning',
            duration: 8000
          })
        }
        
        return { used, total, limit }
      }
      return null
    },

    /**
     * 强制垃圾回收（如果可用）
     */
    forceGarbageCollection() {
      if (window.gc) {
        console.log('执行垃圾回收...')
        window.gc()
      } else if (window.CollectGarbage) {
        console.log('执行垃圾回收（IE）...')
        window.CollectGarbage()
      }
    },

    /**
     * 清理大数据处理后的内存
     */
    cleanupAfterLargeData() {
      // 清理可能的循环引用
      this.lastClickInfo = null
      
      // 强制垃圾回收
      this.forceGarbageCollection()
      
      // 检查内存使用情况
      setTimeout(() => {
        this.checkMemoryUsage()
      }, 1000)
    },

    /**
     * 返回首页
     */
    goBack() {
      try {
        // 如果有数据加载，询问用户是否确认离开
        if (this.loadedLayers.length > 0) {
          this.$confirm('当前有已加载的地图数据，返回首页将清除所有数据。是否继续？', '确认返回', {
            confirmButtonText: '确定返回',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 用户确认返回
            console.log('用户确认返回，清理地图数据...')
            this.clearLayers()
            this.$router.push('/')
            console.log('返回首页')
          }).catch(() => {
            // 用户取消返回
            console.log('用户取消返回')
          })
        } else {
          // 没有数据，直接返回
          this.$router.push('/')
          console.log('返回首页')
        }
      } catch (error) {
        console.error('返回首页失败:', error)
        // 降级方案：直接使用浏览器导航
        window.location.href = '/'
      }
    },

    /**
     * 键盘事件处理
     */
    handleKeyDown(event) {
      try {
        // 按Esc键返回首页
        if (event.key === 'Escape') {
          event.preventDefault()
          this.goBack()
        }
      } catch (error) {
        console.error('键盘事件处理失败:', error)
      }
    }
  },
  beforeDestroy() {
    // 组件销毁前清理
    try {
      this.clearLayers()
      this.lastClickInfo = null
      this.cleanupAfterLargeData()
      
      // 移除键盘事件监听
      document.removeEventListener('keydown', this.handleKeyDown)
    } catch (error) {
      console.error('组件销毁清理时出错:', error)
    }
  },
  
  mounted() {
    // 组件挂载后检查内存
    setTimeout(() => {
      this.checkMemoryUsage()
    }, 1000)
    
    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeyDown)
  }
}
</script>

<style scoped>
/* 演示页面整体样式 */
.map-demo {
  /* max-width: 1200px; */
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 页面标题样式 */
.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 2.5em;
}

.demo-header p {
  color: #7f8c8d;
  font-size: 1.1em;
  line-height: 1.6;
}

/* 控制面板样式 */
.demo-controls {
  padding: 0 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-section h3 {
  color: #2c3e50;
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 1.3em;
}

/* 文件上传区域样式 */
.file-upload-area {
  padding: 15px 0;
}

.file-input {
  display: none;
}

.file-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  font-size: 14px;
  margin-right: 20px;
}

.file-upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.shapefile-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.shapefile-btn:hover {
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.tif-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
}

.tif-btn:hover {
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.upload-icon {
  font-size: 16px;
}

.file-info {
  margin-top: 10px;
  padding: 8px 12px;
  background: #e8f4fd;
  border: 1px solid #b8daff;
  border-radius: 6px;
  font-size: 13px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #dee2e6;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  font-weight: 500;
  color: #004085;
}

.file-size {
  color: #6c757d;
  margin-left: 8px;
}

.file-type {
  color: #6c757d;
  margin-left: 8px;
}

.supported-formats {
  margin-bottom: 15px;
}

.supported-formats p {
  font-size: 12px;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

.sample-link {
  color: #007bff;
  text-decoration: none;
  font-style: normal;
  font-weight: 500;
}

.sample-link:hover {
  text-decoration: underline;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.demo-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #e9ecef;
  color: #495057;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.demo-btn.primary {
  background: #007bff;
  color: white;
}

.demo-btn.primary:hover {
  background: #0056b3;
}

.demo-btn.secondary {
  background: #6c757d;
  color: white;
}

.demo-btn.secondary:hover {
  background: #545b62;
}

.demo-btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.demo-btn:disabled {
  background: #e9ecef !important;
  color: #6c757d !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 信息显示样式 */
.info-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #007bff;
}

.info-item .label {
  position: static !important;
  font-weight: 500;
  color: #495057 !important;
  background: transparent !important;
  border: none !important;
  width: auto !important;
  height: auto !important;
  line-height: normal !important;
  left: auto !important;
  top: auto !important;
  z-index: auto !important;
  padding: 0 !important;
}

.info-item .value {
  font-family: 'Courier New', monospace;
  color: #007bff;
  font-weight: bold;
}

/* 地图容器样式 */
.map-wrapper {
  flex: 1;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
}

/* 点击信息显示样式 */
.click-info {
  background: #e8f4fd;
  border: 1px solid #b8daff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
}

.click-info h3 {
  color: #004085;
  margin-bottom: 10px;
}

.click-info p {
  color: #004085;
  margin-bottom: 10px;
}

/* 要素弹窗样式 */
.feature-popup h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.feature-popup p {
  margin: 5px 0;
  font-size: 13px;
  line-height: 1.4;
}

.feature-popup strong {
  color: #495057;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-demo {
    padding: 15px;
  }
  
  .back-btn-float {
    top: 15px;
    left: 15px;
    width: 45px;
    height: 45px;
  }
  
  .back-icon {
    font-size: 16px;
  }
  
  .demo-controls {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-left: 70px; /* 移动端调整边距 */
  }
  
  .button-group {
    justify-content: center;
  }
  
  .demo-header h1 {
    font-size: 2em;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .demo-controls {
    margin-left: 0; /* 小屏幕取消边距，让按钮浮动在内容上方 */
    margin-top: 60px; /* 为浮动按钮留出顶部空间 */
  }
}

/* 浮动返回按钮样式 */
.back-btn-float {
  position: fixed;
  top: 12px;
  left: 20px;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.back-btn-float:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.back-btn-float:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3), 0 4px 15px rgba(102, 126, 234, 0.3);
}

.back-btn-float:active {
  transform: translateY(-1px) scale(1.05);
}

/* 为按钮添加微妙的脉冲效果 */
.back-btn-float::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.3;
  animation: pulse 2s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
  line-height: 1;
}
</style>
