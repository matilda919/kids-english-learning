import { createClient } from '@supabase/supabase-js';

// Supabase 配置
// 注意：这些是示例值，您需要在 Supabase 控制台创建项目后替换
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库表结构说明：
//
// 1. profiles 表 - 用户资料
//    - id (uuid, primary key, references auth.users)
//    - updated_at (timestamp)
//    - username (text, unique)
//    - email (text)
//    - created_at (timestamp)
//
// 2. children 表 - 孩子资料
//    - id (uuid, primary key)
//    - parent_id (uuid, references profiles.id)
//    - name (text)
//    - age (int)
//    - age_level (text: age_1, age_2, age_3, age_3_plus)
//    - avatar_url (text)
//    - created_at (timestamp)
//
// 3. word_progress 表 - 单词学习进度
//    - id (uuid, primary key)
//    - child_id (uuid, references children.id)
//    - word_id (text)
//    - learned_at (timestamp)
//    - review_count (int)
//    - next_review_date (timestamp)
//    - mastery_level (int: 0-5)
//
// 4. learning_sessions 表 - 学习会话记录
//    - id (uuid, primary key)
//    - child_id (uuid, references children.id)
//    - started_at (timestamp)
//    - ended_at (timestamp)
//    - words_studied (int)
//    - categories (text[])

// 认证辅助函数
export const authService = {
  // 注册
  signUp: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    return { data, error };
  },

  // 登录
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // 登出
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 监听认证状态变化
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// 孩子资料服务
export const childrenService = {
  // 获取家长的所有孩子
  getChildren: async (parentId) => {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // 创建孩子资料
  createChild: async (childData) => {
    const { data, error } = await supabase
      .from('children')
      .insert([childData])
      .select()
      .single();
    return { data, error };
  },

  // 更新孩子资料
  updateChild: async (childId, updates) => {
    const { data, error } = await supabase
      .from('children')
      .update(updates)
      .eq('id', childId)
      .select()
      .single();
    return { data, error };
  },

  // 删除孩子资料
  deleteChild: async (childId) => {
    const { error } = await supabase
      .from('children')
      .delete()
      .eq('id', childId);
    return { error };
  }
};

// 学习进度服务
export const progressService = {
  // 获取孩子的学习进度
  getProgress: async (childId) => {
    const { data, error } = await supabase
      .from('word_progress')
      .select('*')
      .eq('child_id', childId);
    return { data, error };
  },

  // 记录新学的单词
  recordLearnedWord: async (childId, wordId) => {
    const { data, error } = await supabase
      .from('word_progress')
      .insert([{
        child_id: childId,
        word_id: wordId,
        learned_at: new Date().toISOString(),
        review_count: 0,
        next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 明天
        mastery_level: 1
      }])
      .select()
      .single();
    return { data, error };
  },

  // 更新复习进度
  updateReview: async (progressId, reviewData) => {
    const { data, error } = await supabase
      .from('word_progress')
      .update(reviewData)
      .eq('id', progressId)
      .select()
      .single();
    return { data, error };
  },

  // 获取待复习单词
  getReviewWords: async (childId) => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('word_progress')
      .select('*')
      .eq('child_id', childId)
      .lte('next_review_date', now)
      .lt('mastery_level', 5)
      .order('next_review_date', { ascending: true });
    return { data, error };
  }
};

// 学习会话服务
export const sessionService = {
  // 创建学习会话
  createSession: async (childId) => {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert([{
        child_id: childId,
        started_at: new Date().toISOString(),
        words_studied: 0,
        categories: []
      }])
      .select()
      .single();
    return { data, error };
  },

  // 结束学习会话
  endSession: async (sessionId, sessionData) => {
    const { data, error } = await supabase
      .from('learning_sessions')
      .update({
        ended_at: new Date().toISOString(),
        ...sessionData
      })
      .eq('id', sessionId)
      .select()
      .single();
    return { data, error };
  },

  // 获取学习历史
  getHistory: async (childId, limit = 10) => {
    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('child_id', childId)
      .order('started_at', { ascending: false })
      .limit(limit);
    return { data, error };
  }
};
