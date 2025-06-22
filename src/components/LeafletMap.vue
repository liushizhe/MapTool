<template>
  <div class="leaflet-map-container">
    <!-- 地图容器 -->
    <div 
      :id="mapId" 
      class="leaflet-map"
      :style="{ width: width, height: height }"
    ></div>
    
    <!-- 地图控制面板 -->
    <div class="map-controls" v-if="showControls">
      <div class="control-group">
        <button @click="zoomIn" class="control-btn" title="放大">
          <span>+</span>
        </button>
        <button @click="zoomOut" class="control-btn" title="缩小">
          <span>-</span>
        </button>
        <button @click="resetView" class="control-btn" title="重置视图">
          <span>⌂</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'LeafletMap',
  props: {
    // 地图容器宽度
    width: {
      type: String,
      default: '100%'
    },
    // 地图容器高度
    height: {
      type: String,
      default: '400px'
    },
    // 初始中心点坐标 [纬度, 经度]
    center: {
      type: Array,
      default: () => [39.9042, 116.4074] // 默认北京坐标
    },
    // 初始缩放级别
    zoom: {
      type: Number,
      default: 10
    },
    // 是否显示控制按钮
    showControls: {
      type: Boolean,
      default: true
    },
    // 地图瓦片服务URL
    tileUrl: {
      type: String,
      default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    // 瓦片服务属性说明
    attribution: {
      type: String,
      default: '© OpenStreetMap contributors'
    }
  },
  data() {
    return {
      map: null, // Leaflet地图实例
      mapId: `leaflet-map-${Math.random().toString(36).substr(2, 9)}`, // 唯一地图ID
      markers: [] // 标记点数组
    }
  },
  mounted() {
    // 组件挂载后初始化地图
    this.initMap()
  },
  beforeDestroy() {
    // 组件销毁前清理地图资源
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    /**
     * 初始化Leaflet地图
     */
    initMap() {
      try {
        // 检查Leaflet是否可用
        if (typeof L === 'undefined') {
          throw new Error('Leaflet库未正确加载')
        }
        
        // 创建地图实例
        this.map = L.map(this.mapId, {
          center: this.center,
          zoom: this.zoom,
          zoomControl: false // 禁用默认缩放控件，使用自定义控件
        })

        // 添加瓦片图层
        L.tileLayer(this.tileUrl, {
          attribution: this.attribution,
          maxZoom: 18
        }).addTo(this.map)

        // 触发地图初始化完成事件
        this.$emit('map-ready', this.map)

        // 监听地图事件
        this.bindMapEvents()

        console.log('Leaflet地图初始化成功')
      } catch (error) {
        console.error('地图初始化失败:', error)
        this.$emit('map-error', error)
      }
    },

    /**
     * 绑定地图事件监听
     */
    bindMapEvents() {
      if (!this.map) return

      // 地图点击事件
      this.map.on('click', (e) => {
        this.$emit('map-click', {
          latlng: e.latlng,
          layerPoint: e.layerPoint,
          containerPoint: e.containerPoint
        })
      })

      // 地图缩放事件
      this.map.on('zoomend', () => {
        this.$emit('zoom-change', this.map.getZoom())
      })

      // 地图移动事件
      this.map.on('moveend', () => {
        this.$emit('center-change', this.map.getCenter())
      })
    },

    /**
     * 放大地图
     */
    zoomIn() {
      if (this.map) {
        this.map.zoomIn()
      }
    },

    /**
     * 缩小地图
     */
    zoomOut() {
      if (this.map) {
        this.map.zoomOut()
      }
    },

    /**
     * 重置地图视图到初始状态
     */
    resetView() {
      if (this.map) {
        this.map.setView(this.center, this.zoom)
      }
    },

    /**
     * 添加标记点
     * @param {Array} latlng 坐标 [纬度, 经度]
     * @param {Object} options 标记选项
     */
    addMarker(latlng, options = {}) {
      if (!this.map) return null

      const marker = L.marker(latlng, options).addTo(this.map)
      this.markers.push(marker)

      // 如果有弹窗内容，绑定弹窗
      if (options.popup) {
        marker.bindPopup(options.popup)
      }

      return marker
    },

    /**
     * 清除所有标记点
     */
    clearMarkers() {
      this.markers.forEach(marker => {
        this.map.removeLayer(marker)
      })
      this.markers = []
    },

    /**
     * 设置地图中心点
     * @param {Array} latlng 坐标 [纬度, 经度]
     * @param {Number} zoom 缩放级别
     */
    setView(latlng, zoom) {
      if (this.map) {
        this.map.setView(latlng, zoom || this.map.getZoom())
      }
    },

    /**
     * 获取地图实例（供外部调用）
     */
    getMap() {
      return this.map
    }
  }
}
</script>

<style scoped>
/* 地图容器样式 */
.leaflet-map-container {
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

/* 地图主体样式 */
.leaflet-map {
  height: 100% !important;
}

/* 自定义控制面板样式 */
.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.control-btn:active {
  transform: scale(0.95);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-controls {
    top: 5px;
    right: 5px;
  }
  
  .control-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
}
</style>

<style>
/* 全局Leaflet样式修复 */
.leaflet-container {
  font-family: 'Arial', sans-serif;
}

/* 修复Leaflet标记图标显示问题 */
.leaflet-default-icon-path {
  background-image: url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png');
}

/* 弹窗样式优化 */
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.leaflet-popup-content {
  margin: 12px 16px;
  line-height: 1.4;
}

.leaflet-control-container {
  display: none;
}
</style>
