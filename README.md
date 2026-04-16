# Potree 移动端点云查看器

基于 [Potree](https://github.com/potree/potree) 的移动端点云可视化项目，支持触摸操作、自适应性能调节。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:3000`，默认加载 Potree 示例点云。

手机端访问：确保手机与电脑在同一局域网，访问 `http://<你的电脑IP>:3000`

## 加载自己的点云

### 方式1：Potree 格式（推荐）

1. 使用 [PotreeConverter](https://github.com/potree/PotreeConverter) 将 LAS/LAZ/PLY 转换为 Potree 格式：

```bash
PotreeConverter.exe your_data.las -o ./public/pointclouds/your_data
```

2. 修改 `src/main.js` 中的加载路径：

```js
loadPointCloud('./pointclouds/your_data/metadata.json', '我的点云');
```

### 方式2：直接加载 LAS/LAZ

将文件放到 `public/pointclouds/` 目录下，然后：

```js
loadLASFile('./pointclouds/your_file.las', '我的LAS数据');
```

## 移动端操作

| 手势 | 操作 |
|------|------|
| 单指拖拽 | 旋转视角 |
| 双指缩放 | 缩放 |
| 双指拖拽 | 平移 |

右侧按钮：
- **⟳** 重置视角
- **⬆** 俯视图
- **◉** 正视图
- **+** 增加显示点数
- **−** 减少显示点数

## 性能优化

移动端自动启用以下优化：
- 点预算降低至 50万（桌面端 100万）
- 关闭 EDL（Eye-Dome Lighting）
- 自适应点大小

可通过 `+/-` 按钮手动调节点预算。

## 项目结构

```
potree-mobile-viewer/
├── index.html              # 入口页面
├── src/
│   ├── main.js             # 点云加载与控制逻辑
│   └── styles.css          # 移动端样式
├── public/
│   └── pointclouds/        # 点云数据目录
├── package.json
└── vite.config.js
```

## 构建部署

```bash
npm run build
```

产出在 `dist/` 目录下，可直接部署到任何静态服务器。
