# Vercel API

基于 Vercel Serverless Functions 的 API 项目。

## 当前 API

### /api/age

根据生日自动生成年龄徽章，基于 [shields.io](https://shields.io/)。

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
| `color` | 徽章颜色 | `blue` |
| `style` | 徽章样式 | `for-the-badge` |
| `logo` | 徽章图标 | `birthday-cake` |

### 请求示例

```
# 基本请求
https://your-project.vercel.app/api/age?birthday=1998-05-15

# 自定义颜色和样式
https://your-project.vercel.app/api/age?birthday=1998-05-15&color=green&style=flat

# 完整自定义
https://your-project.vercel.app/api/age?birthday=1998-05-15&color=ff69b4&style=for-the-badge&logo=party
```

### 在 Markdown 中使用

```markdown
![Age](https://your-project.vercel.app/api/age?birthday=1998-05-15)
```

### 在 HTML 中使用

```html
<img src="https://your-project.vercel.app/api/age?birthday=1998-05-15" alt="Age Badge" />
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

## License

MIT
