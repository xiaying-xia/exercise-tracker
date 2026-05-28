# 配置文件说明

应用启动时会读取本目录，**改 JSON 后刷新页面即可生效**（无需改代码）。

## 目录结构

```
config/
  active.json          ← 指定使用哪一套配置（文件夹名）
  default/             ← 默认全套
    app.json
    templates.json
    body-metrics.json
  custom/              ← 示例：精简版，可复制后改名
```

## 切换配置

编辑 `active.json`：

```json
{ "set": "custom" }
```

保存后刷新浏览器。`set` 的值 = `config/` 下的**子文件夹名**。

## 新建一套配置

1. 复制 `default` 文件夹，例如改名为 `my-gym`
2. 修改其中的 `app.json`、`templates.json`、`body-metrics.json`
3. 把 `active.json` 里的 `set` 改为 `"my-gym"`

## 文件说明

| 文件 | 内容 |
|------|------|
| `app.json` | 应用标题等展示文案 |
| `templates.json` | 运动分类 + 模板列表 |
| `body-metrics.json` | 身体指标字段（体重、三围等） |

### templates.json 示例

```json
{
  "categories": [{ "id": "cardio", "label": "有氧" }],
  "templates": [
    { "name": "跑步", "category": "cardio", "minutes": 30 }
  ]
}
```

`minutes` 可省略，表示不预设时长。

---

**个人打卡记录**（每天运动、体重数据）不在此目录，保存在浏览器 **localStorage** 中。换配置文件夹不会清空记录；若修改了 `body-metrics.json` 的字段 key，旧数据里多出来的字段仍会保留在本地，只是界面可能不再显示。
