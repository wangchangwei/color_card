import React from 'react';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    content: string;
    author: string;
  };
  onContentChange: (field: string, value: string) => void;
}

export default function ContentModal({ isOpen, onClose, content, onContentChange }: ContentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">内容编辑</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <textarea
              value={content.content}
              onChange={(e) => onContentChange('content', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 min-h-[200px] resize-y"
              placeholder="支持 Markdown 语法：
- 使用 # 创建标题
- 使用 * 或 _ 创建斜体和粗体
- 使用 - 或 * 创建列表
- 使用 > 创建引用
- 使用 ``` 创建代码块
- 使用 [文本](链接) 创建链接"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">作者</label>
            <input
              type="text"
              value={content.author}
              onChange={(e) => onContentChange('author', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 