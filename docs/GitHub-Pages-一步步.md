# GitHub Pages 部署（方案 A · 一步步）

## 为什么 push 不问你密码就红了？

Mac **钥匙串里存了旧 Token**（只有 repo，没有 workflow），Git 会自动用它，所以不再提示输入。

若要换 Token，先清除旧凭证（终端执行后按两次回车）：

```bash
printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
```

---

## 第 1 步：推送代码到 GitHub

### 1. 新建仓库（若还没有）

https://github.com/new → 名称 `exercise-tracker` → Public → Create

### 2. 推送

```bash
cd ~/exercise-tracker
git remote add origin https://github.com/xiaying-xia/exercise-tracker.git   # 仅首次
git push -u origin main
```

若提示用户名密码：

- Username：`xiaying-xia`
- Password：粘贴 Token（`ghp_` 开头，勾选 **repo** 即可，本项目已不需要 workflow 权限）

---

## 第 2 步：发布网页（生成 gh-pages 分支）

仍在 Mac 终端：

```bash
cd ~/exercise-tracker
npm run deploy:pages
```

会把构建好的 `dist` 推到 GitHub 的 **`gh-pages`** 分支（第一次可能要 1～2 分钟）。

---

## 第 3 步：开启 Pages

1. 仓库 → **Settings** → **Pages**
2. **Build and deployment** → Source 选 **Deploy from a branch**
3. Branch 选 **`gh-pages`**，文件夹 **`/ (root)`**
4. Save

等 1～2 分钟，顶部显示：

**`https://xiaying-xia.github.io/exercise-tracker/`**

---

## 第 4 步：手机安装

Safari 打开上面 https 链接 → **分享 → 添加到主屏幕**

---

## 以后更新

```bash
cd ~/exercise-tracker
git add .
git commit -m "更新"
git push
npm run deploy:pages
```

---

## 常见问题

**还是 remote rejected？**  
执行上文「清除旧凭证」，用新 Token 再 `git push`。

**打开网页空白？**  
地址要带 `/exercise-tracker/`，且 Pages 分支选的是 `gh-pages`。
