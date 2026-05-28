# GitHub Pages 部署（方案 A · 一步步）

按顺序做即可。完成后手机用 **https://你的用户名.github.io/exercise-tracker/** 随时打开。

---

## 第 1 步：在 GitHub 新建仓库

1. 浏览器打开 **https://github.com** 并登录  
2. 右上角 **+** → **New repository**  
3. 填写：
   - **Repository name**：`exercise-tracker`（建议用这个名，和项目一致）
   - **Public**
   - **不要**勾选 README / .gitignore（本地已有）
4. 点 **Create repository**  
5. 记下页面上的仓库地址，形如：  
   `https://github.com/你的用户名/exercise-tracker.git`

---

## 第 2 步：把本机代码推上去

在 Mac **终端**执行（把 `你的用户名` 换成自己的）：

```bash
cd ~/exercise-tracker

git remote add origin https://github.com/你的用户名/exercise-tracker.git

git push -u origin main
```

若提示要登录 GitHub：按提示用浏览器或 Personal Access Token 完成认证。

---

## 第 3 步：开启 GitHub Pages

1. 打开仓库页面 → **Settings**  
2. 左侧 **Pages**  
3. **Build and deployment** → **Source** 选 **GitHub Actions**（不要选 Deploy from a branch）  
4. 打开 **Actions** 标签，应看到 **Deploy GitHub Pages** 在运行，等绿色 ✓（约 1～3 分钟）

---

## 第 4 步：拿到手机用的网址

1. 再回到 **Settings → Pages**  
2. 顶部会显示：**Your site is live at …**  
3. 地址类似：  
   **`https://你的用户名.github.io/exercise-tracker/`**  
   注意末尾要有 **`/exercise-tracker/`**

---

## 第 5 步：手机安装

1. iPhone **Safari** 打开上面的 https 链接（4G / 任意 WiFi 均可）  
2. **分享** → **添加到主屏幕**  
3. 以后从桌面图标打开，像 App 一样

---

## 以后更新应用

改完代码后：

```bash
cd ~/exercise-tracker
git add .
git commit -m "更新说明"
git push
```

等 Actions 跑完，手机刷新或重新打开即可（PWA 可能稍等几秒自动更新）。

---

## 常见问题

**Actions 红了怎么办？**  
点进失败的任务看日志；多数是 `npm ci` 失败，本地先执行 `npm install` 再提交 `package-lock.json`。

**打开网页空白？**  
确认访问的 URL 包含仓库名：`/exercise-tracker/`，不要只打开 `https://用户名.github.io/`。

**和电脑上的数据不一样？**  
正常。数据在各自浏览器里。用 App 里 **身体 → 数据备份** 导出/导入。
