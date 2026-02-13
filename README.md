# 🎓 Kids English Learning - 儿童英语学习工具

一个专为 1-6 岁儿童设计的趣味英语单词学习应用，支持多用户、云同步、分级学习和主题分类。

## ✨ 主要功能

### 🎯 核心特性
- **年龄分级学习**：1岁、2岁、3岁、3岁以上四个级别
- **丰富的主题分类**：动物、水果、交通工具（含汽车品牌）等 14+ 个分类
- **多用户支持**：每个孩子独立账号和学习进度
- **云端同步**：学习进度自动保存到云端
- **循环复习系统**：智能推荐待复习单词
- **可爱卡通界面**：随年龄动态调整的界面风格

### 📚 学习内容
- 单词拼写和音标
- 中文翻译和英文解释
- 例句和翻译
- 配图（图片/GIF）
- 视频链接（可选）
- 真人发音（可重复播放）

### 📱 响应式设计
- 完美适配手机和 iPad
- 支持 PWA（可添加到主屏幕）
- 触摸友好的交互

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **安装依赖**
```bash
npm install
```

2. **配置 Supabase**

   a. 在 [Supabase](https://supabase.com) 创建新项目

   b. 复制环境变量模板
   ```bash
   cp .env.example .env
   ```

   c. 在 `.env` 文件中填入 Supabase 配置
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   d. 在 Supabase 中创建数据表（SQL 在下方）

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 `http://localhost:5173`

## 🗄️ 数据库设置

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- profiles 表
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  email text,
  created_at timestamp with time zone default now()
);

-- children 表
create table children (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references profiles(id) on delete cascade,
  name text not null,
  age int not null,
  age_level text not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- word_progress 表
create table word_progress (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) on delete cascade,
  word_id text not null,
  learned_at timestamp with time zone default now(),
  review_count int default 0,
  next_review_date timestamp with time zone,
  mastery_level int default 1
);

-- learning_sessions 表
create table learning_sessions (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) on delete cascade,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  words_studied int default 0,
  categories text[]
);
```

## 📂 项目结构

```
src/
├── components/        # React 组件
│   ├── layout/       # 布局组件
│   ├── word/         # 单词相关组件
│   ├── user/         # 用户相关组件
│   └── common/       # 通用组件
├── pages/            # 页面组件
│   ├── home/         # 首页
│   ├── learn/        # 学习页面
│   ├── profile/      # 个人资料
│   └── admin/        # 管理页面
├── contexts/         # React Context
├── services/         # API 服务
├── data/             # 数据文件
├── hooks/            # 自定义 Hooks
├── utils/            # 工具函数
└── assets/           # 静态资源
```

## 🛠 技术栈

- **前端**：React 18 + Vite
- **路由**：React Router v6
- **样式**：TailwindCSS
- **图标**：Lucide React
- **后端**：Supabase（免费）
- **部署**：Vercel（免费）

## 📝 下一步开发

- [ ] 单词学习页面
- [ ] 发音功能
- [ ] 图片加载
- [ ] 游戏化学习
- [ ] 学习统计
- [ ] PWA 支持

## 📄 License

MIT
