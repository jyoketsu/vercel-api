# Vercel API

基于 Vercel Serverless Functions 的 API 项目。

## API

### /api/age

根据生日自动生成年龄徽章，基于 [shields.io](https://shields.io/)。

> 生日：2017年12月18日

![周岁](https://vercel-api-xujie.vercel.app/api/age?birthday=2017-12-18&label=周岁)
![虚岁](https://vercel-api-xujie.vercel.app/api/age?birthday=2017-12-18&type=nominal&label=虚岁)

**注意**: 如果在 GitHub 中修改了 label 参数但图片没有更新，这是因为 GitHub 会缓存图片。API 已经添加了时间戳参数来强制刷新缓存，但可能需要等待几分钟或强制刷新页面才能看到更新。

### /api/health

健康检查端点，返回服务状态和时间戳。

```json
{
  "status": "ok",
  "timestamp": "2025-01-16T12:00:00.000Z"
}
```

## 本地调试

```bash
# 进入项目目录
cd vercel-api

# 安装依赖
pnpm install

# 启动开发服务器
vercel dev
```

启动后访问 `http://localhost:3000/api/age?birthday=2017-12-18` 进行测试。

## 添加新 API

在 `api/` 目录下创建新的 `.ts` 文件即可：

```
api/
├── age.ts         → /api/age
├── user.ts        → /api/user
└── posts/
    ├── index.ts   → /api/posts
    └── [id].ts    → /api/posts/123 (动态路由)
```

## 部署

### 使用 Vercel CLI 部署

```bash
# 安装 Vercel CLI
pnpm add -g vercel

# 登录
vercel login

# 部署
vercel
```

### 或者直接在 Vercel 网站部署

1. 将这个项目推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 自动部署完成

## 使用方法

### 基本用法

```
GET /api/age?birthday=YYYY-MM-DD
```

### 示例

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `birthday` | 生日，格式 `YYYY-MM-DD` | 必填 |
| `label` | 徽章显示名（支持中文） | `Age` |
| `type` | 年龄类型：`real`(周岁) 或 `nominal`(虚岁) | `real` |
| `color` | 徽章颜色 | `blue` |
| `style` | 徽章样式 | `for-the-badge` |
| `logo` | 徽章图标 | 生日蛋糕 |

[logo使用simpleicons](https://simpleicons.org/)
### 请求示例

```
# 基本请求（周岁）
https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15

# 虚岁
https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15&type=nominal

# 自定义显示名（中文）
https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15&label=年龄

# 自定义颜色和样式
https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15&color=green&style=flat

# 完整自定义
https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15&label=年龄&type=nominal&color=ff69b4&style=for-the-badge&logo=party
```

### 在 Markdown 中使用

```markdown
![Age](https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15)
```

### 在 HTML 中使用

```html
<img src="https://vercel-api-xujie.vercel.app/api/age?birthday=1998-05-15" alt="Age Badge" />
```

## 可用的颜色

- 基本颜色: `blue`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`, `gray`
- 十六进制: `ff69b4`, `1abc9c` 等（需要是有效的颜色代码）

## 可用的样式

- `flat` - 扁平样式
- `flat-square` - 扁平方形
- `for-the-badge` - 徽章样式（默认）
- `plastic` - 塑料样式
- `social` - 社交样式

## 故障排除

### 图片缓存问题

如果在 GitHub README 中修改了参数但图片没有更新，这是因为 GitHub 会缓存图片。解决方法：

1. **强制刷新**: 在图片 URL 后手动添加时间戳参数，例如：
   ```
   ![周岁](https://vercel-api-xujie.vercel.app/api/age?birthday=2017-12-18&label=周岁&t=1234567890)
   ```

2. **等待缓存过期**: GitHub 的图片缓存通常会在几分钟到几小时内自动过期。

3. **使用不同的参数**: 临时修改其他参数（如颜色）来强制生成新的图片。

## License

MIT
