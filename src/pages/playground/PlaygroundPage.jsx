import { useState } from 'react';
import {
  Heart, Star, Sparkles, Zap, Trophy, Gift,
  Play, Volume2, Check, X, ArrowRight, Plus
} from 'lucide-react';
import EmojiImage from '../../components/common/EmojiImage';

const PlaygroundPage = () => {
  const [activeButton, setActiveButton] = useState(null);
  const [count, setCount] = useState(0);

  const buttonStyles = [
    {
      id: 'style1',
      name: '经典黄黑',
      className: 'bg-primary-500 text-dark-500 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-primary-400 transform hover:scale-105 transition-all duration-300 border-2 border-dark-500'
    },
    {
      id: 'style2',
      name: '暗黑风格',
      className: 'bg-dark-500 text-primary-500 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-dark-400 transform hover:scale-105 transition-all duration-300'
    },
    {
      id: 'style3',
      name: '轮廓按钮',
      className: 'bg-transparent text-dark-500 font-bold py-4 px-8 rounded-2xl border-3 border-dark-500 hover:bg-dark-500 hover:text-primary-500 transform hover:scale-105 transition-all duration-300'
    },
    {
      id: 'style4',
      name: '棕色温暖',
      className: 'bg-brown-500 text-cream-50 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-brown-400 transform hover:scale-105 transition-all duration-300'
    },
    {
      id: 'style5',
      name: '渐变黄',
      className: 'bg-gradient-to-r from-primary-400 to-primary-600 text-dark-500 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300'
    },
    {
      id: 'style6',
      name: '柔和奶油',
      className: 'bg-cream-500 text-brown-500 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-cream-400 transform hover:scale-105 transition-all duration-300 border-2 border-brown-300'
    }
  ];

  const cardStyles = [
    {
      id: 'card1',
      name: '标准卡片',
      className: 'bg-cream-50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-2 border-brown-200 cursor-pointer'
    },
    {
      id: 'card2',
      name: '黄色高亮',
      className: 'bg-primary-100 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-3 border-primary-500 cursor-pointer hover:scale-105 transform'
    },
    {
      id: 'card3',
      name: '深色卡片',
      className: 'bg-dark-500 text-cream-50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transform'
    },
    {
      id: 'card4',
      name: '棕色边框',
      className: 'bg-cream-50 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-4 border-brown-400 cursor-pointer hover:border-primary-500'
    }
  ];

  const iconButtons = [
    { icon: Heart, color: 'text-red-500' },
    { icon: Star, color: 'text-primary-500' },
    { icon: Sparkles, color: 'text-purple-500' },
    { icon: Zap, color: 'text-yellow-500' },
    { icon: Trophy, color: 'text-primary-600' },
    { icon: Gift, color: 'text-pink-500' }
  ];

  const animations = [
    {
      name: 'Bounce Slow',
      className: 'animate-bounce-slow',
      description: '缓慢弹跳 (2s)',
      emoji: '🎾'
    },
    {
      name: 'Float',
      className: 'animate-float',
      description: '上下漂浮 (3s)',
      emoji: '🎈'
    },
    {
      name: 'Wiggle',
      className: 'animate-wiggle',
      description: '左右摇摆 (2.5s)',
      emoji: '🎵'
    },
    {
      name: 'Pulse Slow',
      className: 'animate-pulse-slow',
      description: '脉冲缩放 (3s)',
      emoji: '💓'
    },
    {
      name: 'Shake',
      className: 'animate-shake',
      description: '抖动效果 (3s)',
      emoji: '🔔'
    },
    {
      name: 'Spin',
      className: 'animate-spin',
      description: '旋转 (Tailwind)',
      emoji: '⚙️'
    },
    {
      name: 'Ping',
      className: 'animate-ping',
      description: '扩散波纹 (Tailwind)',
      emoji: '📡'
    },
    {
      name: 'Pulse',
      className: 'animate-pulse',
      description: '快速脉冲 (Tailwind)',
      emoji: '⭐'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-slate-700 mb-4">
            交互效果 Playground
          </h1>
          <p className="text-xl text-slate-600">
            尝试不同的按钮和卡片样式，找到您最喜欢的设计
          </p>
          <div className="w-32 h-1 bg-primary-500 mx-auto mt-4"></div>
        </div>

        {/* 按钮样式 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">按钮样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buttonStyles.map((style) => (
              <div key={style.id} className="card">
                <h3 className="text-lg font-bold text-slate-700 mb-4">{style.name}</h3>
                <button
                  className={style.className}
                  onClick={() => {
                    setActiveButton(style.id);
                    setTimeout(() => setActiveButton(null), 500);
                  }}
                >
                  点击测试
                </button>
                {activeButton === style.id && (
                  <p className="mt-3 text-green-600 font-semibold">✓ 效果已激活</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 卡片样式 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">卡片样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardStyles.map((style) => (
              <div key={style.id} className={style.className}>
                <h3 className="text-xl font-bold mb-2">{style.name}</h3>
                <p className="opacity-80">
                  这是一个示例卡片，展示不同的样式效果。悬停查看交互效果。
                </p>
                <div className="mt-4 flex space-x-2">
                  <div className="px-3 py-1 bg-primary-500 text-dark-500 text-sm font-bold rounded-full">
                    标签 1
                  </div>
                  <div className="px-3 py-1 bg-brown-300 text-dark-500 text-sm font-bold rounded-full">
                    标签 2
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 图标按钮 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-700 mb-6">图标按钮</h2>
          <div className="card">
            <div className="flex flex-wrap gap-4">
              {iconButtons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="p-4 bg-cream-200 rounded-2xl hover:bg-primary-500 hover:scale-110 transform transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-brown-200 hover:border-dark-500"
                    onClick={() => setCount(count + 1)}
                  >
                    <Icon className={`${item.color} w-8 h-8`} />
                  </button>
                );
              })}
              <div className="flex items-center ml-4 text-slate-700 font-bold text-xl">
                点击次数: {count}
              </div>
            </div>
          </div>
        </section>

        {/* 图标动画展示 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-dark-500 mb-6">所有可用动画效果</h2>
          <p className="text-slate-600 mb-6">这些动画可以应用到主页的任何图标上。每个动画都是无限循环播放的。</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {animations.map((anim, index) => (
              <div key={index} className="card bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className={anim.className}>
                      <EmojiImage emoji={anim.emoji} size="64" />
                    </div>
                  </div>
                  <h3 className="font-bold text-dark-500 mb-2 text-lg">{anim.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{anim.description}</p>
                  <code className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-700 block">
                    {anim.className}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 交互动画 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-dark-500 mb-6">交互动画</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="card group">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto text-primary-500 group-hover:scale-125 transition-transform duration-300" />
                <p className="mt-4 font-bold text-dark-500">悬停放大</p>
              </div>
            </button>

            <button className="card">
              <div className="text-center">
                <Volume2 className="w-16 h-16 mx-auto text-primary-500 animate-pulse" />
                <p className="mt-4 font-bold text-dark-500">脉动效果</p>
              </div>
            </button>

            <button className="card group">
              <div className="text-center">
                <ArrowRight className="w-16 h-16 mx-auto text-primary-500 group-hover:translate-x-2 transition-transform duration-300" />
                <p className="mt-4 font-bold text-dark-500">滑动效果</p>
              </div>
            </button>
          </div>
        </section>

        {/* 成功/失败反馈 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-dark-500 mb-6">反馈样式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-green-50 border-green-400">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-700">正确！</h3>
                  <p className="text-green-600">答案正确，继续加油！</p>
                </div>
              </div>
            </div>

            <div className="card bg-red-50 border-red-400">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="text-white w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-700">再试一次</h3>
                  <p className="text-red-600">没关系，我们再来一遍</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 底部提示 */}
        <div className="text-center py-8">
          <p className="text-brown-500 text-lg">
            选好样式后，告诉我您最喜欢哪些，我会应用到整个应用中！
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
