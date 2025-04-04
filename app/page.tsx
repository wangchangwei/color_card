'use client';

import React, { useState, useEffect, useRef } from 'react';
import colors from '../color_zh.json';
import ContentModal from './components/ContentModal';
import { toPng } from 'html-to-image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Color {
  name: string;
  colors: string[];
}

type GradientDirection = 'to right' | 'to left' | 'to bottom' | 'to top' | 'to bottom right' | 'to bottom left' | 'to top right' | 'to top left';

export default function Home() {
  const [currentGradient, setCurrentGradient] = useState<Color>({
    name: '月光湾',
    colors: ['#0F2027', '#203A43', '#2C5364']
  });
  const [fourColors, setFourColors] = useState<Color[]>([]);
  const [threeColors, setThreeColors] = useState<Color[]>([]);
  const [twoColors, setTwoColors] = useState<Color[]>([]);
  const [gradientDirection, setGradientDirection] = useState<GradientDirection>('to bottom right');
  const [glassBackground, setGlassBackground] = useState<'white' | 'black'>('black');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState({
    content: '',
    author: '熬夜冠军 🏆'
  });
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 获取 markdown 文件内容
    fetch('/markdown.md')
      .then(response => response.text())
      .then(text => {
        setContent(prev => ({
          ...prev,
          content: text
        }));
      });
  }, []);

  useEffect(() => {
    // 根据渐变颜色的数量将颜色分类
    const four: Color[] = [];
    const three: Color[] = [];
    const two: Color[] = [];

    colors.forEach(color => {
      switch (color.colors.length) {
        case 4:
          four.push(color);
          break;
        case 3:
          three.push(color);
          break;
        case 2:
          two.push(color);
          break;
      }
    });

    setFourColors(four);
    setThreeColors(three);
    setTwoColors(two);

    // 设置初始颜色
    if (four.length > 0) {
      setCurrentGradient(four[0]);
    } else if (three.length > 0) {
      setCurrentGradient(three[0]);
    } else if (two.length > 0) {
      setCurrentGradient(two[0]);
    }
  }, []);

  const handleColorClick = (color: Color) => {
    setCurrentGradient(color);
  };

  const handleDirectionChange = (direction: GradientDirection) => {
    setGradientDirection(direction);
  };

  const handleGlassBackgroundChange = (color: 'white' | 'black') => {
    setGlassBackground(color);
  };

  const handleContentChange = (field: string, value: string | string[]) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadScreenshot = async () => {
    if (!phoneRef.current) return;

    try {
      // 创建一个临时的截图容器
      const screenshotContainer = document.createElement('div');
      screenshotContainer.style.width = '405px';
      screenshotContainer.style.height = '720px';
      screenshotContainer.style.position = 'relative';
      screenshotContainer.style.overflow = 'hidden';
      
      // 克隆手机预览区域的内容
      const phoneContent = phoneRef.current.cloneNode(true) as HTMLElement;
      phoneContent.style.transform = 'none';
      phoneContent.style.width = '405px';
      phoneContent.style.height = '720px';
      phoneContent.style.position = 'absolute';
      phoneContent.style.top = '0';
      phoneContent.style.left = '0';
      
      // 移除不需要的元素
      const buttons = phoneContent.querySelectorAll('button');
      buttons.forEach(button => button.remove());
      
      screenshotContainer.appendChild(phoneContent);
      document.body.appendChild(screenshotContainer);

      const dataUrl = await toPng(screenshotContainer, {
        quality: 1,
        pixelRatio: 2,
        style: {
          width: '405px',
          height: '720px'
        }
      });

      // 清理临时容器
      document.body.removeChild(screenshotContainer);

      const link = document.createElement('a');
      link.download = '手机截图.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('截图失败:', error);
    }
  };

  const gradientDirections: { label: string; value: GradientDirection }[] = [
    { label: '右下', value: 'to bottom right' },
    { label: '左下', value: 'to bottom left' },
    { label: '右上', value: 'to top right' },
    { label: '左上', value: 'to top left' },
    { label: '向右', value: 'to right' },
    { label: '向左', value: 'to left' },
    { label: '向下', value: 'to bottom' },
    { label: '向上', value: 'to top' },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          仿流光卡片
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧颜色选择区域 */}
          <div className="space-y-8">
            {/* 操作按钮区域 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                编辑内容
              </button>
              <button
                onClick={handleDownloadScreenshot}
                className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                下载截图
              </button>
            </div>

            {/* 渐变方向选择 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">渐变方向</h2>
              <div className="grid grid-cols-4 gap-2">
                {gradientDirections.map((direction) => (
                  <button
                    key={direction.value}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      gradientDirection === direction.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => handleDirectionChange(direction.value)}
                  >
                    {direction.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 毛玻璃背景选择 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">毛玻璃背景</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-lg text-sm font-medium transition-all ${
                    glassBackground === 'white'
                      ? 'bg-white text-gray-800 border-2 border-gray-300'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => handleGlassBackgroundChange('white')}
                >
                  白色背景
                </button>
                <button
                  className={`p-4 rounded-lg text-sm font-medium transition-all ${
                    glassBackground === 'black'
                      ? 'bg-gray-800 text-white border-2 border-gray-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => handleGlassBackgroundChange('black')}
                >
                  黑色背景
                </button>
              </div>
            </div>

            {/* 颜色选择区域 */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">四色渐变</h2>
              <div className="grid grid-cols-6 gap-4">
                {fourColors.map((color, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105 ${
                      currentGradient.name === color.name ? 'ring-4 ring-offset-2 ring-red-500/50' : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${color.colors.join(', ')})`,
                    }}
                    onClick={() => handleColorClick(color)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">三色渐变</h2>
              <div className="grid grid-cols-6 gap-4">
                {threeColors.map((color, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105 ${
                      currentGradient.name === color.name ? 'ring-4 ring-offset-2 ring-red-500/50' : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${color.colors.join(', ')})`,
                    }}
                    onClick={() => handleColorClick(color)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">双色渐变</h2>
              <div className="grid grid-cols-6 gap-4">
                {twoColors.map((color, index) => (
                  <button
                    key={index}
                    className={`p-4 rounded-lg text-white text-sm font-medium transition-transform hover:scale-105 ${
                      currentGradient.name === color.name ? 'ring-4 ring-offset-2 ring-red-500/50' : ''
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${color.colors.join(', ')})`,
                    }}
                    onClick={() => handleColorClick(color)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧移动端预览区域 */}
          <div className="lg:sticky lg:top-8 lg:self-start lg:justify-self-end">
            <div 
              ref={phoneRef}
              className="w-[405px] h-[720px] bg-white rounded-none p-0 shadow-2xl relative overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              {/* 手机顶部 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-9 bg-gray-800 rounded-none"></div>
              {/* 手机屏幕 */}
              <div 
                className="w-full h-full rounded-none transition-all duration-500 relative"
                style={{
                  background: `linear-gradient(${gradientDirection}, ${currentGradient.colors.join(', ')})`,
                }}
              >
                {/* 毛玻璃效果框 */}
                <div className={`absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-2xl backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,0.2),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] flex flex-col p-6 ${
                  glassBackground === 'white' 
                    ? 'bg-white/80 before:absolute before:inset-0 before:rounded-2xl before:backdrop-blur-xl before:bg-white/30 before:-z-10 before:shadow-[0_0_20px_rgba(0,0,0,0.1)] after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-white/20 after:to-transparent after:opacity-50' 
                    : 'bg-black/80 before:absolute before:inset-0 before:rounded-2xl before:backdrop-blur-xl before:bg-black/30 before:-z-10 before:shadow-[0_0_20px_rgba(0,0,0,0.2)] after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-white/10 after:to-transparent after:opacity-30 shadow-[0_0_30px_rgba(255,255,255,0.2),0_0_60px_rgba(255,255,255,0.1)]'
                }`}>
                  {/* 内容项 */}
                  <div className="space-y-4 prose prose-sm max-w-none">
                    <div className={`${
                      glassBackground === 'white' ? 'text-gray-700' : 'text-gray-200'
                    }`}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
                          code: ({node, className, ...props}) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return match ? (
                              <code className="block bg-gray-100 rounded p-2 mb-4" {...props} />
                            ) : (
                              <code className="bg-gray-100 rounded px-1 py-0.5" {...props} />
                            );
                          },
                          a: ({node, ...props}) => <a className="text-blue-500 hover:underline" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                        }}
                      >
                        {content.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  
                  {/* 底部信息 */}
                  <div className={`flex justify-between text-xs mt-auto ${
                    glassBackground === 'white' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <span>作者：{content.author}</span>
                    <span>字数：{content.content.length + content.author.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容编辑弹框 */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={content}
        onContentChange={handleContentChange}
      />
    </main>
  );
}