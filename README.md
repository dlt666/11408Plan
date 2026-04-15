# 考研每日打卡计划应用

## 项目简介

这是一个专为考研学生设计的每日打卡计划应用，帮助学生科学管理学习时间，提高学习效率，避免信息过载和任务分配不当的问题。

## 技术栈

- **前端**：React 18.2.0 + TypeScript + Vite
- **后端**：Supabase (数据库 + API)
- **UI库**：Element Plus
- **图标库**：Font Awesome

## 功能特性

### 前端功能

1. **首页**：
   - 考研倒计时功能
   - 随机激励性语录
   - 响应式设计

2. **学习计划管理**：
   - 内置标准化学习计划模板
   - 支持用户自定义学习计划
   - 计划切换功能

3. **每日任务管理**：
   - 表格形式展示每日学习任务
   - 任务开始、暂停、结束的状态控制
   - 精确计时功能
   - 全屏计时器

4. **每日打卡**：
   - 打卡日历
   - 打卡详情页面
   - 学习日志与打卡关联

5. **学习日志**：
   - 详细学习日志记录
   - 日志分类检索功能
   - 富文本编辑

### 后端功能

1. **数据库连接**：
   - Supabase数据库连接配置
   - 数据表结构设计

2. **用户标识系统**：
   - 基于时间戳+随机字符串的用户标识方案
   - 标识的存储和管理

3. **API服务**：
   - 任务API：增删改查操作
   - 学习日志API：增删改查操作
   - 打卡记录API：增删改查操作
   - 学习计划API：增删改查操作

## 项目结构

```
kaoyan-plan-app/
├── public/            # 静态资源
├── src/
│   ├── assets/        # 图片等资源
│   ├── components/    # 前端组件
│   ├── api/           # 后端API服务
│   ├── utils/         # 工具函数
│   ├── tests/         # 测试文件
│   ├── App.tsx        # 应用入口
│   ├── main.tsx       # 主文件
│   └── index.css      # 全局样式
├── docs/              # 文档
│   ├── database-design.md     # 数据库表结构设计
│   ├── user-identification.md # 用户标识方案
│   └── test-report.md         # 测试报告
├── package.json       # 项目配置
└── vite.config.ts     # Vite配置
```

## 安装与运行

### 安装依赖

```bash
npm install
```

### 配置Supabase

1. 在 [Supabase](https://supabase.io/) 创建一个新项目
2. 在 `src/utils/supabase.ts` 文件中配置Supabase连接参数：

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

3. 在Supabase控制台创建必要的数据表（参考 `docs/database-design.md`）

### 运行开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

1. **首次访问**：应用会自动生成用户标识并存储在浏览器中
2. **学习计划**：选择或创建适合自己的学习计划
3. **每日任务**：查看并执行每日学习任务，点击开始按钮启动全屏计时器
4. **每日打卡**：完成任务后进行打卡，系统会记录学习时间和任务完成情况
5. **学习日志**：记录学习心得和总结

## 数据安全

- 用户数据存储在Supabase数据库中
- 使用Row Level Security确保用户只能访问自己的数据
- 用户标识存储在浏览器的localStorage中，无需密码登录

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 响应式设计

- 移动端优先设计
- 适配不同屏幕尺寸
- 触摸友好的界面

## 许可证

MIT License

## 贡献

欢迎提交问题和Pull Request！

## 联系方式

如有问题，请联系：
- 项目维护者：AI Assistant
- 邮箱：example@example.com
