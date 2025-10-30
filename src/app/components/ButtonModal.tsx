'use client';

import { ButtonContribution } from '@/utils/buttonLoader';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Component to handle HTML+CSS+JS buttons with proper script execution
function HtmlButtonWrapper({ html, css, js }: { html: string; css: string; js: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && js) {
      // Create a script element and execute it
      const script = document.createElement('script');
      script.textContent = js;
      
      // Append to container to execute
      container.appendChild(script);
      
      // Cleanup function to remove script when component unmounts
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [js]);

  return (
    <div ref={containerRef} className="html-button-container">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        className="inline-block"
      />
    </div>
  );
}

interface ButtonModalProps {
  contribution: ButtonContribution;
  isOpen: boolean;
  onClose: () => void;
}

export default function ButtonModal({ contribution, isOpen, onClose }: ButtonModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'react' | 'html' | 'css' | 'js'>('preview');
  const [ReactComponent, setReactComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (isOpen && contribution.metadata.type === 'react') {
      const loadComponent = async () => {
        try {
          if (contribution.importPath) {
            console.log(`[Modal] Attempting to load React component from: ../../../contributions/${contribution.importPath}/button`);
            const componentModule = await import(`../../../contributions/${contribution.importPath}/button`);
            setReactComponent(() => componentModule.default);
          } else {
            // Fallback to old structure
            const componentModule = await import(`../../../contributions/${contribution.metadata.author}/button`);
            setReactComponent(() => componentModule.default);
          }
        } catch (error) {
          console.error(`Failed to load React component for ${contribution.metadata.author}:`, error);
        }
      };
      loadComponent();
    }
  }, [isOpen, contribution]);

  const renderButtonPreview = () => {
    if (contribution.metadata.type === 'react' && ReactComponent) {
      return <ReactComponent />;
    }
    
    if ((contribution.metadata.type === 'html' || contribution.metadata.type === 'vanilla') && contribution.html) {
      return (
        <HtmlButtonWrapper 
          html={contribution.html}
          css={contribution.css || ''}
          js={contribution.js || ''}
        />
      );
    }
    
    return (
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
        Button preview not available
      </div>
    );
  };

  const [reactCode, setReactCode] = useState<string>('');

  useEffect(() => {
    if (isOpen && contribution.metadata.type === 'react') {
      // Use the actual React code from the contribution
      setReactCode(contribution.reactCode || `// React code not available\n// Please check the button.jsx file in the ${contribution.metadata.author} folder`);
    }
  }, [isOpen, contribution]);

  // Fallback copy function that works in all browsers
  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }
      
      // Fallback for older browsers or insecure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Show user feedback
      alert('Copy failed. Please copy the text manually.');
    }
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 select-none pointer-events-auto" style={{overflow: 'hidden'}}>
      <div className="bg-white rounded-lg w-[90vw] max-w-[1200px] h-[85vh] flex flex-col overflow-hidden p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{contribution.metadata.name}</h2>
            <p className="text-gray-600">
              by 
              <Link
                href={`/search?user=${contribution.metadata.author}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                @{contribution.metadata.author}
              </Link>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          {contribution.metadata.type === 'react' && (
            <button
              onClick={() => setActiveTab('react')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'react'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              React Code
            </button>
          )}
          {contribution.html && (
            <button
              onClick={() => setActiveTab('html')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'html'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              HTML
            </button>
          )}
          {contribution.css && (
            <button
              onClick={() => setActiveTab('css')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'css'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              CSS
            </button>
          )}
          {contribution.js && (
            <button
              onClick={() => setActiveTab('js')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'js'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              JavaScript
            </button>
          )}
        </div>

  {/* Content */}
  <div className="flex-1 min-h-0 p-6 overflow-y-auto">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                <div className="flex items-center justify-center min-h-[100px]">
                  {renderButtonPreview()}
                </div>
              </div>
              
              {/* Metadata */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Description</h3>
                <p className="text-gray-700">{contribution.metadata.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    contribution.metadata.type === 'react' ? 'bg-blue-500' :
                    contribution.metadata.type === 'html' ? 'bg-green-500' :
                    contribution.metadata.type === 'vanilla' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}>
                    {contribution.metadata.type?.toUpperCase()}
                  </span>
                  
                  {contribution.metadata.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${
                      contribution.metadata.difficulty === 'beginner' ? 'bg-green-400' :
                      contribution.metadata.difficulty === 'intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {contribution.metadata.difficulty}
                    </span>
                  )}
                  
                  {contribution.metadata.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'react' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">React Component</h3>
                <button
                  onClick={() => copyToClipboard(reactCode)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{reactCode}</code>
              </pre>
            </div>
          )}

          {activeTab === 'html' && contribution.html && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">HTML Template</h3>
                <button
                  onClick={() => copyToClipboard(contribution.html || '')}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{contribution.html}</code>
              </pre>
            </div>
          )}

          {activeTab === 'css' && contribution.css && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">CSS Styles</h3>
                <button
                  onClick={() => copyToClipboard(contribution.css || '')}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{contribution.css}</code>
              </pre>
            </div>
          )}

          {activeTab === 'js' && contribution.js && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">JavaScript Logic</h3>
                <button
                  onClick={() => copyToClipboard(contribution.js || '')}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Copy Code
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{contribution.js}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Click tabs above to view different code files
          </div>
          <div className="space-x-2">
            <a
              href={`https://github.com/${contribution.metadata.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm"
            >
              View GitHub Profile
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}