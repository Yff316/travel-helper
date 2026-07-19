/**
 * 出行助手 - Roche 插件
 * 版本: 1.0.0
 * 功能: 底部导航、图片导入、城市选择、日期选择、酒店推荐等
 */

window.RochePlugin.register({
  id: "travel-helper",
  name: "出行助手",
  version: "1.0.0",
  apps: [
    {
      id: "travel-helper-home",
      name: "出行助手",
      icon: "flight",
      iconImage: "",
      async mount(container, roche) {
        // ========== 预置城市列表（全球主要城市） ==========
        const cities = [
          "北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "西安", "武汉", "南京",
          "天津", "苏州", "长沙", "郑州", "东莞", "青岛", "沈阳", "宁波", "昆明", "大连",
          "厦门", "合肥", "佛山", "福州", "哈尔滨", "济南", "温州", "长春", "石家庄", "常州",
          "泉州", "南宁", "贵阳", "南昌", "太原", "烟台", "嘉兴", "南通", "金华", "徐州",
          "海口", "乌鲁木齐", "拉萨", "香港", "澳门", "台北",
          "东京", "大阪", "首尔", "曼谷", "新加坡", "吉隆坡", "纽约", "洛杉矶", "伦敦",
          "巴黎", "悉尼", "迪拜", "莫斯科", "柏林", "罗马", "多伦多", "旧金山", "温哥华",
          "巴厘岛", "普吉岛", "马尔代夫"
        ];

        // ========== 插件界面 HTML ==========
        const html = `
          <style>
            /* ---- 所有样式限定在插件根 class 下 ---- */
            .roche-plugin-travel-helper * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-tap-highlight-color: transparent;
            }
            .roche-plugin-travel-helper {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background: #f0f2f5;
              height: 100%;
              display: flex;
              flex-direction: column;
              color: #333;
              user-select: none;
            }
            .roche-plugin-travel-helper .th-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 8px 16px;
              background: #fff;
              border-bottom: 1px solid #e5e7eb;
              height: 48px;
              flex-shrink: 0;
              z-index: 10;
            }
            .roche-plugin-travel-helper .th-header .th-back-btn {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: none;
              background: transparent;
              border-radius: 50%;
              cursor: pointer;
              font-size: 18px;
              color: #666;
              transition: background 0.2s;
            }
            .roche-plugin-travel-helper .th-header .th-back-btn:hover {
              background: #f0f0f0;
            }
            .roche-plugin-travel-helper .th-header .th-title {
              font-size: 16px;
              font-weight: 600;
              color: #222;
            }
            .roche-plugin-travel-helper .th-header .th-placeholder {
              width: 32px;
            }
            .roche-plugin-travel-helper .th-content {
              flex: 1;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              padding-bottom: 8px;
            }
            /* 每个 tab 内容区 */
            .roche-plugin-travel-helper .th-tab-content {
              display: none;
              padding: 12px 16px;
            }
            .roche-plugin-travel-helper .th-tab-content.active {
              display: block;
            }
            /* 底部导航 */
            .roche-plugin-travel-helper .th-footer {
              display: flex;
              background: #fff;
              border-top: 1px solid #e5e7eb;
              height: 56px;
              flex-shrink: 0;
              padding-bottom: env(safe-area-inset-bottom, 0);
            }
            .roche-plugin-travel-helper .th-footer .th-tab {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              color: #999;
              cursor: pointer;
              transition: color 0.2s;
              gap: 2px;
            }
            .roche-plugin-travel-helper .th-footer .th-tab.active {
              color: #4A90D9;
            }
            .roche-plugin-travel-helper .th-footer .th-tab svg {
              width: 24px;
              height: 24px;
              fill: currentColor;
            }

            /* 首页卡片 */
            .roche-plugin-travel-helper .th-home-banner {
              width: 100%;
              height: 160px;
              background: #dde3ea url('data:image/svg+xml;base64,...') center/cover no-repeat; /* 默认风景占位图，可用纯色 */
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #fff;
              background-color: #b0c4de;
              background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              cursor: pointer;
              margin-bottom: 12px;
              overflow: hidden;
              position: relative;
            }
            .roche-plugin-travel-helper .th-home-banner img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              position: absolute;
              top: 0;
              left: 0;
            }
            .roche-plugin-travel-helper .th-home-banner .th-banner-placeholder {
              text-align: center;
              z-index: 1;
              background: rgba(0,0,0,0.3);
              padding: 8px 16px;
              border-radius: 8px;
            }
            .roche-plugin-travel-helper .th-home-ticket-card {
              background: #fff;
              border-radius: 12px;
              padding: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
              margin-bottom: 12px;
            }
            /* 票种选择 */
            .roche-plugin-travel-helper .th-ticket-types {
              display: flex;
              gap: 8px;
              margin-bottom: 16px;
            }
            .roche-plugin-travel-helper .th-ticket-types .th-ticket-item {
              flex: 1;
              padding: 10px 4px;
              text-align: center;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              background: #e5e7eb;
              color: #6b7280;
              cursor: pointer;
              transition: all 0.2s;
            }
            .roche-plugin-travel-helper .th-ticket-types .th-ticket-item.active {
              background: #fff;
              color: #222;
              box-shadow: inset 0 0 0 1px #d1d5db;
            }
            /* 地点选择 */
            .roche-plugin-travel-helper .th-location-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
            }
            .roche-plugin-travel-helper .th-location-box {
              flex: 1;
              height: 44px;
              background: #f3f4f6;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 15px;
              font-weight: 500;
              color: #111;
              cursor: pointer;
              border: 1px solid transparent;
              transition: border 0.2s;
              min-width: 0;
              padding: 0 8px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .roche-plugin-travel-helper .th-location-box:active {
              border-color: #4A90D9;
            }
            .roche-plugin-travel-helper .th-swap-btn {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background: #f3f4f6;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              font-size: 18px;
              color: #4A90D9;
              flex-shrink: 0;
              transition: background 0.2s;
            }
            .roche-plugin-travel-helper .th-swap-btn:hover {
              background: #e5e7eb;
            }
            /* 日期行 */
            .roche-plugin-travel-helper .th-date-row {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 16px;
            }
            .roche-plugin-travel-helper .th-date-row .th-date-label {
              font-size: 14px;
              color: #6b7280;
              white-space: nowrap;
            }
            .roche-plugin-travel-helper .th-date-row input[type="date"] {
              flex: 1;
              height: 40px;
              padding: 0 12px;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 15px;
              color: #111;
              background: #fff;
              outline: none;
              -webkit-appearance: none;
            }
            /* 查询按钮 */
            .roche-plugin-travel-helper .th-query-btn {
              width: 100%;
              height: 44px;
              background: #4A90D9;
              color: #fff;
              border: none;
              border-radius: 10px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
              transition: opacity 0.2s;
            }
            .roche-plugin-travel-helper .th-query-btn:active {
              opacity: 0.8;
            }

            /* 小功能菜单占位 */
            .roche-plugin-travel-helper .th-mini-menu {
              display: flex;
              gap: 12px;
              margin-bottom: 16px;
              overflow-x: auto;
              padding-bottom: 4px;
            }
            .roche-plugin-travel-helper .th-mini-menu .th-mini-item {
              flex: 0 0 80px;
              height: 72px;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.05);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 4px;
              font-size: 11px;
              color: #6b7280;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .roche-plugin-travel-helper .th-mini-menu .th-mini-item:active {
              transform: scale(0.94);
            }
            .roche-plugin-travel-helper .th-mini-menu .th-mini-item svg {
              width: 24px;
              height: 24px;
              fill: #4A90D9;
            }

            /* 酒店推荐卡片 */
            .roche-plugin-travel-helper .th-hotel-card {
              background: #fff;
              border-radius: 12px;
              padding: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
              margin-bottom: 12px;
            }
            .roche-plugin-travel-helper .th-hotel-card .th-hotel-title {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 12px;
              color: #222;
            }
            .roche-plugin-travel-helper .th-hotel-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
            }
            .roche-plugin-travel-helper .th-hotel-item {
              aspect-ratio: 3/4;
              background: #f3f4f6;
              border-radius: 8px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: flex-end;
              padding: 6px;
              font-size: 11px;
              color: #333;
              background-size: cover;
              background-position: center;
              position: relative;
              overflow: hidden;
              cursor: pointer;
            }
            .roche-plugin-travel-helper .th-hotel-item .th-hotel-name {
              background: rgba(255,255,255,0.85);
              width: 100%;
              text-align: center;
              padding: 4px 0;
              border-radius: 4px;
              font-weight: 500;
            }
            .roche-plugin-travel-helper .th-hotel-item .th-hotel-score {
              background: rgba(255,255,255,0.85);
              width: 100%;
              text-align: center;
              padding: 2px 0;
              border-radius: 4px;
              font-size: 10px;
              color: #f59e0b;
            }

            /* 城市选择模态 */
            .roche-plugin-travel-helper .th-city-modal {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 999;
              animation: thFadeIn 0.2s ease;
            }
            @keyframes thFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel {
              background: #fff;
              width: 80%;
              max-width: 340px;
              max-height: 70vh;
              border-radius: 16px;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-search {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-search input {
              width: 100%;
              height: 36px;
              padding: 0 12px;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 14px;
              outline: none;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-list {
              flex: 1;
              overflow-y: auto;
              padding: 8px 0;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-list .th-city-item {
              padding: 10px 16px;
              font-size: 15px;
              color: #222;
              cursor: pointer;
              transition: background 0.2s;
              border-bottom: 1px solid #f3f4f6;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-list .th-city-item:hover {
              background: #f0f2f5;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-list .th-city-item.no-match {
              color: #999;
              text-align: center;
              cursor: default;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-footer {
              display: flex;
              justify-content: space-between;
              padding: 8px 12px;
              border-top: 1px solid #e5e7eb;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-footer button {
              border: none;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              cursor: pointer;
              transition: background 0.2s;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-footer .th-city-cancel {
              background: #f3f4f6;
              color: #333;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-footer .th-city-confirm {
              background: #4A90D9;
              color: #fff;
            }
            .roche-plugin-travel-helper .th-city-modal .th-city-panel .th-city-footer .th-city-confirm:disabled {
              background: #a0c4f0;
              cursor: not-allowed;
            }

            /* 其他 tab 占位页面 */
            .roche-plugin-travel-helper .th-placeholder-page {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 300px;
              color: #9ca3af;
              font-size: 15px;
              gap: 12px;
            }
            .roche-plugin-travel-helper .th-placeholder-page svg {
              width: 64px;
              height: 64px;
              fill: #d1d5db;
            }

            /* 消息页面 */
            .roche-plugin-travel-helper .th-message-page {
              padding: 20px 0;
            }
            .roche-plugin-travel-helper .th-message-item {
              padding: 12px 0;
              border-bottom: 1px solid #f0f2f5;
              display: flex;
              gap: 12px;
            }
            .roche-plugin-travel-helper .th-message-item .th-msg-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #d1d5db;
              flex-shrink: 0;
            }
            .roche-plugin-travel-helper .th-message-item .th-msg-content {
              flex: 1;
            }
            .roche-plugin-travel-helper .th-message-item .th-msg-content .th-msg-name {
              font-size: 14px;
              font-weight: 500;
              color: #222;
            }
            .roche-plugin-travel-helper .th-message-item .th-msg-content .th-msg-text {
              font-size: 13px;
              color: #6b7280;
              margin-top: 2px;
            }

            /* 我页面 */
            .roche-plugin-travel-helper .th-mine-header {
              display: flex;
              align-items: center;
              gap: 16px;
              padding: 20px 0;
              border-bottom: 1px solid #f0f2f5;
            }
            .roche-plugin-travel-helper .th-mine-header .th-mine-avatar {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              background: #a0c4f0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
              color: #fff;
            }
            .roche-plugin-travel-helper .th-mine-header .th-mine-info .th-mine-name {
              font-size: 18px;
              font-weight: 600;
            }
            .roche-plugin-travel-helper .th-mine-header .th-mine-info .th-mine-desc {
              font-size: 13px;
              color: #6b7280;
            }
            .roche-plugin-travel-helper .th-mine-menu {
              padding: 16px 0;
            }
            .roche-plugin-travel-helper .th-mine-menu .th-mine-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 1px solid #f0f2f5;
              font-size: 15px;
              color: #333;
              cursor: pointer;
            }
            .roche-plugin-travel-helper .th-mine-menu .th-mine-item:last-child {
              border-bottom: none;
            }
            .roche-plugin-travel-helper .th-mine-menu .th-mine-item svg {
              width: 22px;
              height: 22px;
              fill: #6b7280;
            }
          </style>

          <div class="roche-plugin-travel-helper">
            <!-- 头部 -->
            <div class="th-header">
              <button class="th-back-btn" id="thBackBtn" title="退出插件">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
              </button>
              <span class="th-title">出行助手</span>
              <div class="th-placeholder"></div>
            </div>

            <!-- 内容区域 -->
            <div class="th-content">
              <!-- 首页 -->
              <div class="th-tab-content active" data-tab="home">
                <!-- 图片导入区 -->
                <div class="th-home-banner" id="thBanner">
                  <div class="th-banner-placeholder">
                    <span>📷 点击导入风景图</span>
                  </div>
                  <img id="thBannerImg" style="display:none;" />
                </div>

                <!-- 票务卡片 -->
                <div class="th-home-ticket-card">
                  <div class="th-ticket-types">
                    <div class="th-ticket-item active" data-ticket="train">🚄 火车票</div>
                    <div class="th-ticket-item" data-ticket="plane">✈️ 飞机票</div>
                    <div class="th-ticket-item" data-ticket="bus">🚌 汽车票</div>
                  </div>

                  <div class="th-location-row">
                    <div class="th-location-box" id="thFromBox" data-role="from">选择出发地</div>
                    <button class="th-swap-btn" id="thSwapBtn">⇌</button>
                    <div class="th-location-box" id="thToBox" data-role="to">选择目的地</div>
                  </div>

                  <div class="th-date-row">
                    <span class="th-date-label">📅 日期</span>
                    <input type="date" id="thDateInput" value="" />
                  </div>

                  <button class="th-query-btn" id="thQueryBtn">查询车票</button>
                </div>

                <!-- 小功能菜单占位 -->
                <div class="th-mini-menu">
                  <div class="th-mini-item">
                    <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                    <span>特价机票</span>
                  </div>
                  <div class="th-mini-item">
                    <svg viewBox="0 0 24 24"><path d="M19 9H5c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h14c.55 0 1-.45 1-1V10c0-.55-.45-1-1-1zm-1 10H6v-8h12v8z"/><path d="M12 2l-7 7h14L12 2z"/></svg>
                    <span>酒店预订</span>
                  </div>
                  <div class="th-mini-item">
                    <svg viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                    <span>租车服务</span>
                  </div>
                  <div class="th-mini-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span>旅游攻略</span>
                  </div>
                </div>

                <!-- 酒店推荐 -->
                <div class="th-hotel-card">
                  <div class="th-hotel-title">🏨 酒店推荐</div>
                  <div class="th-hotel-grid" id="thHotelGrid">
                    <!-- 由 JavaScript 填充 -->
                  </div>
                </div>
              </div>

              <!-- 精选 -->
              <div class="th-tab-content" data-tab="featured">
                <div class="th-placeholder-page">
                  <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <span>精选推荐 · 即将上线</span>
                </div>
              </div>

              <!-- 占位（待定） -->
              <div class="th-tab-content" data-tab="placeholder">
                <div class="th-placeholder-page">
                  <svg viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
                  <span>功能开发中，敬请期待</span>
                </div>
              </div>

              <!-- 消息 -->
              <div class="th-tab-content" data-tab="messages">
                <div class="th-message-page">
                  <div class="th-message-item">
                    <div class="th-msg-avatar" style="background:#a78bfa;">&nbsp;</div>
                    <div class="th-msg-content">
                      <div class="th-msg-name">系统通知</div>
                      <div class="th-msg-text">欢迎使用出行助手！</div>
                    </div>
                  </div>
                  <div class="th-message-item">
                    <div class="th-msg-avatar" style="background:#f59e0b;">&nbsp;</div>
                    <div class="th-msg-content">
                      <div class="th-msg-name">订单助手</div>
                      <div class="th-msg-text">您有未完成的订单，请及时处理。</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 我 -->
              <div class="th-tab-content" data-tab="mine">
                <div class="th-mine-header">
                  <div class="th-mine-avatar">👤</div>
                  <div class="th-mine-info">
                    <div class="th-mine-name">旅行者</div>
                    <div class="th-mine-desc">热爱探索世界</div>
                  </div>
                </div>
                <div class="th-mine-menu">
                  <div class="th-mine-item">
                    <svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                    <span>设置</span>
                  </div>
                  <div class="th-mine-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    <span>关于</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部导航 -->
            <div class="th-footer" id="thFooter">
              <div class="th-tab active" data-tab="home">
                <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>首页</span>
              </div>
              <div class="th-tab" data-tab="featured">
                <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <span>精选</span>
              </div>
              <div class="th-tab" data-tab="placeholder">
                <svg viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
                <span>待定</span>
              </div>
              <div class="th-tab" data-tab="messages">
                <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/></svg>
                <span>消息</span>
              </div>
              <div class="th-tab" data-tab="mine">
                <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                <span>我</span>
              </div>
            </div>
          </div>
        `;

        container.innerHTML = html;
        const root = container.querySelector('.roche-plugin-travel-helper');

        // ========== 状态变量 ==========
        let selectedTicket = 'train'; // 当前选中的票种
        let fromCity = '北京';
        let toCity = '上海';
        let activeTarget = null; // 记录当前正在选择哪个地点框（'from' 或 'to'）
        let cityModal = null; // 城市选择模态引用

        // ========== 初始化 ==========
        // 设置默认日期为今天
        document.getElementById('thDateInput').value = new Date().toISOString().slice(0, 10);
        // 设置默认城市
        document.getElementById('thFromBox').textContent = fromCity;
        document.getElementById('thToBox').textContent = toCity;

        // 填充酒店推荐数据（模拟）
        const hotels = [
          { name: '海滨度假酒店', score: '4.8', image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { name: '山景温泉民宿', score: '4.6', image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
          { name: '城市精品酒店', score: '4.5', image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
          { name: '湖畔小屋', score: '4.7', image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
          { name: '花园别墅', score: '4.4', image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
          { name: '星空露营地', score: '4.3', image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
          { name: '温泉酒店', score: '4.9', image: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
          { name: '艺术客栈', score: '4.2', image: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
        ];
        const hotelGrid = document.getElementById('thHotelGrid');
        hotels.forEach(h => {
          const item = document.createElement('div');
          item.className = 'th-hotel-item';
          item.style.backgroundImage = h.image;
          item.innerHTML = `
            <div class="th-hotel-name">${h.name}</div>
            <div class="th-hotel-score">⭐ ${h.score}</div>
          `;
          hotelGrid.appendChild(item);
        });

        // ========== 事件绑定 ==========

        // 1. 退出按钮
        document.getElementById('thBackBtn').addEventListener('click', () => {
          roche.ui.closeApp();
        });

        // 2. 图片导入
        const banner = document.getElementById('thBanner');
        const bannerImg = document.getElementById('thBannerImg');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        banner.appendChild(fileInput);
        banner.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            bannerImg.src = ev.target.result;
            bannerImg.style.display = 'block';
            banner.querySelector('.th-banner-placeholder')?.remove();
          };
          reader.readAsDataURL(file);
        });

        // 3. 票种选择
        const ticketItems = root.querySelectorAll('.th-ticket-item');
        ticketItems.forEach(item => {
          item.addEventListener('click', () => {
            ticketItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            selectedTicket = item.dataset.ticket;
          });
        });

        // 4. 城市选择弹窗
        function showCityModal(targetRole) {
          activeTarget = targetRole;
          // 创建模态
          const modal = document.createElement('div');
          modal.className = 'th-city-modal';
          modal.innerHTML = `
            <div class="th-city-panel">
              <div class="th-city-search">
                <input type="text" id="thCitySearchInput" placeholder="搜索城市..." autofocus />
              </div>
              <div class="th-city-list" id="thCityList">
                ${cities.map(c => `<div class="th-city-item" data-city="${c}">${c}</div>`).join('')}
              </div>
              <div class="th-city-footer">
                <button class="th-city-cancel" id="thCityCancel">取消</button>
                <button class="th-city-confirm" id="thCityConfirm" disabled>使用当前输入</button>
              </div>
            </div>
          `;
          document.body.appendChild(modal);
          cityModal = modal;

          const searchInput = modal.querySelector('#thCitySearchInput');
          const cityList = modal.querySelector('#thCityList');
          const confirmBtn = modal.querySelector('#thCityConfirm');
          const cancelBtn = modal.querySelector('#thCityCancel');

          // 过滤城市
          function filterCities(query) {
            const q = query.trim().toLowerCase();
            const items = cityList.querySelectorAll('.th-city-item');
            let hasMatch = false;
            items.forEach(item => {
              const cityName = item.dataset.city;
              if (cityName.toLowerCase().includes(q)) {
                item.style.display = 'block';
                hasMatch = true;
              } else {
                item.style.display = 'none';
              }
            });
            // 如果没有匹配，启用确认按钮；否则禁用
            if (!hasMatch && q.length > 0) {
              confirmBtn.disabled = false;
              // 移除原有的“无匹配”提示（如果有）
              let noMatch = cityList.querySelector('.no-match');
              if (!noMatch) {
                noMatch = document.createElement('div');
                noMatch.className = 'th-city-item no-match';
                noMatch.textContent = `使用“${q}”作为城市`;
                cityList.appendChild(noMatch);
              } else {
                noMatch.textContent = `使用“${q}”作为城市`;
              }
            } else {
              confirmBtn.disabled = true;
              const noMatch = cityList.querySelector('.no-match');
              if (noMatch) noMatch.remove();
            }
          }

          searchInput.addEventListener('input', () => filterCities(searchInput.value));

          // 点击城市项
          cityList.addEventListener('click', (e) => {
            const item = e.target.closest('.th-city-item');
            if (!item || item.classList.contains('no-match')) return;
            const city = item.dataset.city;
            setCity(activeTarget, city);
            closeModal();
          });

          // 确认使用当前输入
          confirmBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
              setCity(activeTarget, query);
              closeModal();
            }
          });

          // 取消
          cancelBtn.addEventListener('click', closeModal);

          // 点击遮罩关闭（点击模态外部）
          modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
          });

          // ESC 键关闭
          function onKeyDown(e) {
            if (e.key === 'Escape') closeModal();
          }
          document.addEventListener('keydown', onKeyDown);

          function closeModal() {
            if (modal && modal.parentNode) {
              modal.parentNode.removeChild(modal);
            }
            document.removeEventListener('keydown', onKeyDown);
            cityModal = null;
          }
        }

        function setCity(target, city) {
          if (target === 'from') {
            fromCity = city;
            document.getElementById('thFromBox').textContent = city;
          } else if (target === 'to') {
            toCity = city;
            document.getElementById('thToBox').textContent = city;
          }
        }

        // 地点点击
        document.getElementById('thFromBox').addEventListener('click', () => showCityModal('from'));
        document.getElementById('thToBox').addEventListener('click', () => showCityModal('to'));

        // 互换按钮
        document.getElementById('thSwapBtn').addEventListener('click', () => {
          const temp = fromCity;
          fromCity = toCity;
          toCity = temp;
          document.getElementById('thFromBox').textContent = fromCity;
          document.getElementById('thToBox').textContent = toCity;
        });

        // 5. 查询按钮
        document.getElementById('thQueryBtn').addEventListener('click', () => {
          const date = document.getElementById('thDateInput').value;
          const ticketType = { train: '火车票', plane: '飞机票', bus: '汽车票' }[selectedTicket];
          roche.ui.toast(`查询：${fromCity} → ${toCity} | ${ticketType} | ${date}`);
        });

        // 6. 底部导航切换
        const tabs = root.querySelectorAll('.th-tab');
        const contents = root.querySelectorAll('.th-tab-content');
        function switchTab(tabId) {
          tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
          contents.forEach(c => c.classList.toggle('active', c.dataset.tab === tabId));
        }
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchTab(tabId);
          });
        });

        // 7. 小功能菜单点击（暂无功能，仅提示）
        root.querySelectorAll('.th-mini-item').forEach(item => {
          item.addEventListener('click', () => {
            roche.ui.toast('功能开发中…');
          });
        });

        // 8. 酒店项点击（模拟详情）
        hotelGrid.querySelectorAll('.th-hotel-item').forEach(item => {
          item.addEventListener('click', () => {
            roche.ui.toast('查看酒店详情（演示）');
          });
        });

        // ========== 清理函数 (unmount 会使用) ==========
        // 由于容器被替换时所有子节点事件都会被移除，无需额外清理。
        // 但如果有定时器等，需要保存引用并在unmount清除。
        // 本例没有使用定时器，但为了完整性，在unmount中会调用 replaceChildren。
        // 城市选择弹窗在关闭时已移除，若强制退出插件时有打开的弹窗，unmount时容器内容清空也会移除。
      },
      async unmount(container) {
        container.replaceChildren();
        // 如果有额外全局事件监听或定时器，请在此清除
      }
    }
  ]
});
