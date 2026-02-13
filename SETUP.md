# 🚀 项目设置指南

## 第一步：配置 Supabase

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（或创建账号）
4. 点击 "New project"
5. 填写项目信息：
   - Name: `kids-english-learning`
   - Database Password: 设置一个强密码（记住它）
   - Region: 选择离您最近的区域（如 Singapore）
   - 点击 "Create new project"

### 2. 获取 API 密钥

项目创建完成后：
1. 进入项目 Dashboard
2. 点击左侧的 "Project Settings"（齿轮图标）
3. 点击 "API" 选项卡
4. 复制以下信息：
   - Project URL（例如：`https://xxxxx.supabase.co`）
   - anon public key（一串很长的密钥）

### 3. 配置环境变量

1. 在项目根目录创建 `.env` 文件：
\`\`\`bash
cp .env.example .env
\`\`\`

2. 编辑 `.env` 文件，填入刚才复制的信息：
\`\`\`
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon_key
\`\`\`

### 4. 创建数据库表

1. 在 Supabase Dashboard 中，点击左侧的 "SQL Editor"
2. 点击 "New query"
3. 复制粘贴以下 SQL 代码并执行：

\`\`\`sql
-- 创建 profiles 表
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  email text,
  created_at timestamp with time zone default now()
);

-- 创建 children 表
create table children (
  id uuid default uuid_generate_v4() primary key,
  parent_id uuid references profiles(id) on delete cascade,
  name text not null,
  age int not null,
  age_level text not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- 创建 word_progress 表
create table word_progress (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) on delete cascade,
  word_id text not null,
  learned_at timestamp with time zone default now(),
  review_count int default 0,
  next_review_date timestamp with time zone,
  mastery_level int default 1
);

-- 创建 learning_sessions 表
create table learning_sessions (
  id uuid default uuid_generate_v4() primary key,
  child_id uuid references children(id) on delete cascade,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  words_studied int default 0,
  categories text[]
);

-- 设置 RLS (Row Level Security) 策略
alter table profiles enable row level security;
alter table children enable row level security;
alter table word_progress enable row level security;
alter table learning_sessions enable row level security;

-- profiles 表的策略
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- children 表的策略
create policy "Users can view own children"
  on children for select
  using ( auth.uid() = parent_id );

create policy "Users can insert own children"
  on children for insert
  with check ( auth.uid() = parent_id );

create policy "Users can update own children"
  on children for update
  using ( auth.uid() = parent_id );

create policy "Users can delete own children"
  on children for delete
  using ( auth.uid() = parent_id );

-- word_progress 表的策略
create policy "Users can view own children's progress"
  on word_progress for select
  using (
    exists (
      select 1 from children
      where children.id = word_progress.child_id
      and children.parent_id = auth.uid()
    )
  );

create policy "Users can insert own children's progress"
  on word_progress for insert
  with check (
    exists (
      select 1 from children
      where children.id = word_progress.child_id
      and children.parent_id = auth.uid()
    )
  );

create policy "Users can update own children's progress"
  on word_progress for update
  using (
    exists (
      select 1 from children
      where children.id = word_progress.child_id
      and children.parent_id = auth.uid()
    )
  );

-- learning_sessions 表的策略
create policy "Users can view own children's sessions"
  on learning_sessions for select
  using (
    exists (
      select 1 from children
      where children.id = learning_sessions.child_id
      and children.parent_id = auth.uid()
    )
  );

create policy "Users can insert own children's sessions"
  on learning_sessions for insert
  with check (
    exists (
      select 1 from children
      where children.id = learning_sessions.child_id
      and children.parent_id = auth.uid()
    )
  );

create policy "Users can update own children's sessions"
  on learning_sessions for update
  using (
    exists (
      select 1 from children
      where children.id = learning_sessions.child_id
      and children.parent_id = auth.uid()
    )
  );
\`\`\`

4. 点击 "Run" 执行 SQL

### 5. 配置认证

1. 在 Supabase Dashboard，点击 "Authentication"
2. 点击 "Settings"
3. 配置：
   - Enable email confirmation: 可以关闭（开发阶段）
   - Enable phone confirmation: 关闭
   - 其他保持默认

## 第二步：运行项目

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

### 3. 访问应用

打开浏览器访问：`http://localhost:5173`

## 第三步：测试功能

1. 首页应该显示欢迎界面和主题分类
2. 点击导航可以切换页面
3. 后续开发会添加登录/注册功能

## 常见问题

### Q: 启动报错找不到模块？
A: 运行 `npm install` 重新安装依赖

### Q: 样式没有生效？
A: 确保 TailwindCSS 已正确配置，检查 `tailwind.config.js` 和 `postcss.config.js`

### Q: Supabase 连接失败？
A: 检查 `.env` 文件中的 URL 和密钥是否正确

### Q: 如何查看 Supabase 数据？
A: 在 Supabase Dashboard 点击 "Table Editor" 可以查看和编辑数据

## 下一步开发建议

1. **添加认证页面**：登录/注册界面
2. **完善首页**：从数据库加载真实数据
3. **开发学习页面**：单词卡片、发音功能
4. **添加图片**：集成 Unsplash API
5. **部署应用**：推送到 Vercel

## 需要帮助？

如有问题，请查看：
- [Supabase 文档](https://supabase.com/docs)
- [React Router 文档](https://reactrouter.com)
- [TailwindCSS 文档](https://tailwindcss.com)
