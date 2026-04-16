/**
 * Potree 移动端点云查看器 - 主入口
 */

let viewer;

function initViewer() {
  const container = document.getElementById('potree-render-area');

  viewer = new Potree.Viewer(container);

  // 基础设置
  viewer.setEDLEnabled(true);
  viewer.setFOV(60);
  viewer.setPointBudget(1_000_000); // 移动端默认100万点，控制性能
  viewer.setMinNodeSize(30);
  viewer.loadSettingsFromURL();

  // 移动端设备检测，自动降低点预算
  if (isMobileDevice()) {
    viewer.setPointBudget(500_000);
    viewer.setEDLEnabled(false); // 移动端关闭 EDL 提升性能
  }

  viewer.setBackground('gradient'); // skybox | gradient | black | white
  viewer.setDescription('');

  updateInfo('查看器已初始化，请加载点云数据');
}

/**
 * 加载 Potree 格式点云
 * @param {string} url - 点云 metadata.json 或 cloud.js 的路径
 * @param {string} name - 点云名称
 */
function loadPointCloud(url, name = '点云数据') {
  updateInfo('正在加载点云...');

  Potree.loadPointCloud(url, name, (e) => {
    const pointcloud = e.pointcloud;
    const material = pointcloud.material;

    // 材质设置
    material.activeAttributeName = 'rgba'; // rgba | classification | elevation | intensity
    material.size = 1;
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    material.shape = Potree.PointShape.SQUARE;

    viewer.scene.addPointCloud(pointcloud);

    // 自动聚焦到点云
    viewer.fitToScreen();

    const numPoints = pointcloud.pcoGeometry.numPoints;
    updateInfo(`已加载: ${name} (${formatNumber(numPoints)} 点)`);
  });
}

/**
 * 加载 LAS/LAZ 文件（通过 URL）
 */
function loadLASFile(url, name = 'LAS数据') {
  updateInfo('正在加载 LAS 文件...');

  Potree.loadPointCloud(url, name, (e) => {
    const pointcloud = e.pointcloud;
    const material = pointcloud.material;

    material.activeAttributeName = 'rgba';
    material.size = 1;
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;

    viewer.scene.addPointCloud(pointcloud);
    viewer.fitToScreen();

    updateInfo(`已加载: ${name}`);
  });
}

// ==================== 移动端控制 ====================

function setupMobileControls() {
  // 重置视角
  document.getElementById('btn-reset').addEventListener('click', () => {
    viewer.fitToScreen();
  });

  // 俯视图
  document.getElementById('btn-top').addEventListener('click', () => {
    viewer.scene.view.pitch = -Math.PI / 2;
    viewer.fitToScreen();
  });

  // 正视图
  document.getElementById('btn-front').addEventListener('click', () => {
    viewer.scene.view.pitch = 0;
    viewer.scene.view.yaw = 0;
    viewer.fitToScreen();
  });

  // 增加点数
  document.getElementById('btn-points-up').addEventListener('click', () => {
    const current = viewer.getPointBudget();
    const newBudget = Math.min(current + 500_000, 5_000_000);
    viewer.setPointBudget(newBudget);
    updateInfo(`点预算: ${formatNumber(newBudget)}`);
  });

  // 减少点数
  document.getElementById('btn-points-down').addEventListener('click', () => {
    const current = viewer.getPointBudget();
    const newBudget = Math.max(current - 500_000, 100_000);
    viewer.setPointBudget(newBudget);
    updateInfo(`点预算: ${formatNumber(newBudget)}`);
  });
}

// ==================== 工具函数 ====================

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (window.innerWidth <= 768);
}

function formatNumber(num) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

function updateInfo(text) {
  const infoEl = document.getElementById('info-text');
  if (infoEl) infoEl.textContent = text;
}

// ==================== 初始化 ====================

window.addEventListener('DOMContentLoaded', () => {
  initViewer();
  setupMobileControls();

  // === 加载点云 ===
  // 方式1: 加载 Potree 转换后的点云（推荐）
  // loadPointCloud('./pointclouds/your_data/metadata.json', '我的点云');

  // 方式2: 加载 Potree 示例点云（用于测试）
  // loadPointCloud(
  //   'https://cdn.jsdelivr.net/gh/potree/potree@develop/pointclouds/lion_takanawa/cloud.js',
  //   '示例: 狮子点云'
  // );

  // 方式3: 加载本地 LAS/LAZ（放到 public/pointclouds/ 目录下）
  // loadLASFile('./pointclouds/557_room_0.las', '557_room_0');

  // 方式4: 加载 PotreeConverter 转换后的点云
  loadPointCloud('./pointclouds/557_room_0_potree/metadata.json', '557_room_0');
});

// 导出全局访问
window.potreeApp = {
  viewer: () => viewer,
  loadPointCloud,
  loadLASFile,
};
