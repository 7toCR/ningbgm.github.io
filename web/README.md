# web（静态前端展示页）

这个目录是一个**纯静态**前端页面模板，用于做类似 `audiogenie.github.io` 的“论文/项目展示页”。

当前版本已按你的要求改为：

- **只展示仓库 `example/` 目录下的 mp4**
- 展示列表由 `web/data/example_mp4.json` 控制

页面结构：顶部标题/链接/目录锚点 + Example 视频网格。

## 本地预览

在**项目根目录**执行（Windows / PowerShell）：

```powershell
cd d:\Python\Project\MCP\NingBGM
python -m http.server 5173
```

然后用浏览器打开：`http://127.0.0.1:5173/web/`

> 注意：
> - 不要直接双击打开 `web/index.html`（浏览器会因为 CORS 限制导致 `fetch(...)` 失败）。
> - `example_mp4.json` 里的视频使用了 `/example/...` 这种“站点根路径”，因此必须从**项目根目录**起一个静态服务器。

## 只展示 example 里的 mp4：如何维护列表

编辑 `web/data/example_mp4.json`，每个条目形如：

```json
{
  "id": "car_01_bgm",
  "title": "car_01 / bgm",
  "src": "/example/car_01/bgm/bgm.mp4"
}
```

## 常见坑

- **单文件大小限制**：GitHub 普通仓库单文件建议 < 100MB（mp4 太大可能 push 失败）。
- **总仓库体积**：GitHub Pages 是从仓库提供静态文件，仓库太大会导致推送慢、构建慢。

## 部署到 `https://ningbgm.github.io/`（GitHub Pages 用户站点）

### 重要前提（否则做不到这个域名）

`https://ningbgm.github.io/` 属于 **GitHub Pages 用户/组织站点**，它的仓库名必须是：

- `你的用户名.github.io`（例如：`ningbgm/ningbgm.github.io`）

这意味着：你的 GitHub 账号用户名必须就是 `ningbgm` 才能用这个地址。
如果你用户名不是 `ningbgm`（例如你当前是 `7toCR`），那默认地址会是 `https://7tocr.github.io/`。

### 方案 A（推荐）：用 `ningbgm/ningbgm.github.io` 仓库直出

1. **准备 GitHub 账号**
   - 确认账号用户名为 `ningbgm`
   - 登录 GitHub

2. **新建仓库**
   - GitHub 右上角 New repository
   - Repository name 填：`ningbgm.github.io`
   - 选择 **Public**
   - 勾选/不勾选 README 都行（你本地已经有文件）
   - Create repository

3. **把本地项目初始化为 git 并推送**
   在你的电脑（PowerShell）执行：

```powershell
cd d:\Python\Project\MCP\NingBGM

git init
git add .
git commit -m "init github pages site"

git branch -M main
git remote add origin https://github.com/ningbgm/ningbgm.github.io.git
git push -u origin main
```

> 如果你没有安装 git：先安装 Git for Windows，再重新打开 PowerShell 执行上面命令。

4. **开启 GitHub Pages**
   - 打开仓库页面 `Settings`
   - 左侧 `Pages`
   - `Build and deployment` → `Source` 选 **Deploy from a branch**
   - `Branch` 选 `main`，目录选 `/ (root)`
   - 保存

5. **访问**
   - 等 1~3 分钟（第一次会慢一点）
   - 打开：`https://ningbgm.github.io/`
   - 根目录的 `index.html` 会自动跳转到 `/web/`，最终页面是：`https://ningbgm.github.io/web/`

### 方案 B：如果你的用户名不是 `ningbgm`

你无法直接用 `https://ningbgm.github.io/`，只能二选一：

1) 用你自己的用户站点：`https://<你的用户名>.github.io/`

2) 继续使用当前用户名仓库做“项目站点”（Project Pages），地址类似：
`https://<你的用户名>.github.io/<仓库名>/`

### 为什么我这里要把视频路径写成 `/example/...`？

因为站点部署后，`example/` 在仓库根目录，对应 URL 根路径 `/example/...`。
这样不管你是访问 `.../web/` 还是从根重定向，都能稳定找到 mp4。

1. 在 GitHub 新建仓库：`ningbgm.github.io`
2. 把下面这些内容放到仓库根目录（保持同级关系）：
   - `web/`（本页面代码）
   - `example/`（你要展示的 mp4 示例）
3. 在该仓库 Settings → Pages 中选择部署方式（通常是 Deploy from a branch）
4. 打开：`https://ningbgm.github.io/web/`

> 如果你希望主页就是 `https://ningbgm.github.io/`（不带 `/web/`），那就把 `web/` 里的
> `index.html / styles.css / app.js / data/` 挪到仓库根目录，并把 `index.html` 里的引用路径改成根目录对应路径。

