'use client';

import { ButtonContribution } from '@/utils/buttonLoader';
import { useState, useEffect, useRef } from 'react';
import ButtonModal from './ButtonModal';
import { createPortal } from 'react-dom';
import Link from 'next/link';

// Component to handle GitHub profile images with fallback
function ProfileImage({ author }: { author: string }) {
  const [imageError, setImageError] = useState(false);
  
  // List of known invalid/example users to avoid API calls
  const invalidUsers = [
    'example-html-user',
    'example-react-user', 
    'example-vanilla-user',
    'sdssfMRIEnan'
  ];

  // Check if this is an example user or invalid GitHub username
  const isInvalidUser = invalidUsers.includes(author) || 
                       author.startsWith('example-') || 
                       author.length < 3 ||
                       /[^a-zA-Z0-9-]/.test(author); // Invalid GitHub username characters

  // Default avatar component
  const DefaultAvatar = () => (
    <div className="w-8 h-8 rounded-full border-2 border-purple-400/30 hover:border-purple-400/60 transition-colors duration-200 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
      <svg 
        className="w-4 h-4 text-white" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  // If it's an invalid user or we had an error, show fallback immediately
  if (isInvalidUser || imageError) {
    return <DefaultAvatar />;
  }

  // For valid users, use regular img tag to avoid Next.js optimization issues
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://github.com/${author}.png`}
      alt={`${author}'s GitHub avatar`}
      width={32}
      height={32}
      className="w-8 h-8 rounded-full border-2 border-purple-400/30 hover:border-purple-400/60 transition-colors duration-200"
      onError={() => setImageError(true)}
    />
  );
}

// Component to handle HTML+CSS+JS buttons with proper script execution
function HtmlButtonWrapper({ html, css, js }: { html: string; css: string; js: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container && js) {
      try {
        // Create a unique namespace for this button to avoid conflicts
        const buttonId = `btn_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store registered functions for cleanup
        const registeredFunctions: string[] = [];
        
        // Execute the JavaScript using eval in global context
        // This ensures functions are defined in the global scope
        eval(`${js}`);
        
        // After execution, register the functions with unique names
        const commonFunctionNames = ['pulseGlow', 'buttonClick', 'toggleButton', 'animateButton', 'handleClick', 'onClick'];
        
        commonFunctionNames.forEach(funcName => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (window as any)[funcName] === 'function') {
            const namespacedName = funcName + '_' + buttonId;
            console.log('Registering function:', namespacedName);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any)[namespacedName] = (window as any)[funcName];
            registeredFunctions.push(namespacedName);
          }
        });
        
        // Update onclick handlers to use the namespaced function names
        const elementsWithOnclick = container.querySelectorAll('[onclick]');
        elementsWithOnclick.forEach(element => {
          const onclick = element.getAttribute('onclick');
          if (onclick) {
            let updatedOnclick = onclick;
            commonFunctionNames.forEach(funcName => {
              if (onclick.includes(`${funcName}()`)) {
                const namespacedName = funcName + '_' + buttonId;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof (window as any)[namespacedName] === 'function') {
                  const pattern = new RegExp(`\\b${funcName}\\(\\)`, 'g');
                  updatedOnclick = updatedOnclick.replace(pattern, `${namespacedName}()`);
                  console.log('Updated onclick from', onclick, 'to', updatedOnclick);
                }
              }
            });
            element.setAttribute('onclick', updatedOnclick);
          }
        });
        
        // Now it's safe to remove original functions to prevent conflicts
        commonFunctionNames.forEach(funcName => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (window as any)[funcName] === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any)[funcName];
          }
        });
        
        // Cleanup function to remove global functions when component unmounts
        return () => {
          if (typeof window !== 'undefined') {
            registeredFunctions.forEach(namespacedFunc => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((window as any)[namespacedFunc]) {
                console.log('Cleaning up function:', namespacedFunc);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete (window as any)[namespacedFunc];
              }
            });
          }
        };
      } catch (error) {
        console.error('Error executing button JavaScript:', error);
      }
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

interface ButtonShowcaseProps {
  contribution: ButtonContribution;
}

export default function ButtonShowcase({ contribution }: ButtonShowcaseProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reactComponent, setReactComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    // Dynamically import React component if it exists
    if (contribution.metadata.type === 'react') {
      const loadComponent = async () => {
        try {
          if (contribution.importPath) {
            console.log(`[DEBUG] Attempting to load React component from: ../../../contributions/${contribution.importPath}/button`);
            
            // Try to import the React component using the pre-calculated import path
            const componentModule = await import(`../../../contributions/${contribution.importPath}/button`);
            
            // Check if default export is valid, otherwise try named exports
            let Component = componentModule.default;
            
            // If default export is not a function/component, try to find a named export
            if (!Component || typeof Component !== 'function') {
              // Look for common named export patterns
              Component = componentModule.Button || 
                         componentModule.ButtonComponent || 
                         componentModule[Object.keys(componentModule)[0]]; // First export
            }
            
            // Validate that we have a valid React component
            if (Component && typeof Component === 'function') {
              setReactComponent(() => Component);
            } else {
              throw new Error('No valid React component found in module');
            }
          } else {
            throw new Error('No import path available');
          }
        } catch (error) {
          console.error(`Failed to load React component from ${contribution.folderPath}:`, error);
          
          // Fallback: try the old structure path
          try {
            console.log(`Fallback: trying ../../../contributions/${contribution.metadata.author}/button`);
            const componentModule = await import(`../../../contributions/${contribution.metadata.author}/button`);
            
            // Apply same validation logic for fallback
            let Component = componentModule.default;
            
            if (!Component || typeof Component !== 'function') {
              Component = componentModule.Button || 
                         componentModule.ButtonComponent || 
                         componentModule[Object.keys(componentModule)[0]];
            }
            
            if (Component && typeof Component === 'function') {
              setReactComponent(() => Component);
            } else {
              throw new Error('No valid React component found in fallback module');
            }
          } catch (fallbackError) {
            console.error(`Fallback import also failed for ${contribution.metadata.author}:`, fallbackError);
          }
        }
      };
      
      loadComponent();
    }
  }, [contribution]);

  const handleViewCode = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const renderButton = () => {
    if (contribution.metadata.type === 'react' && reactComponent) {
      const Component = reactComponent;
      
      // Additional safety check to ensure Component is valid
      if (typeof Component !== 'function') {
        console.error('Invalid component type:', typeof Component, Component);
        return (
          <div className="text-red-500 italic text-sm p-2 border border-red-300 rounded">
            Error: Invalid React component - expected function but got {typeof Component}
          </div>
        );
      }
      
      // Wrap in error boundary-like try-catch for additional safety
      try {
        return <Component />;
      } catch (error) {
        console.error('Error rendering React component:', error);
        return (
          <div className="text-red-500 italic text-sm p-2 border border-red-300 rounded">
            Error rendering component: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        );
      }
    } else if (contribution.html && contribution.css) {
      return (
        <HtmlButtonWrapper 
          html={contribution.html} 
          css={contribution.css} 
          js={contribution.js || ''} 
        />
      );
    } else {
      return (
        <div className="text-gray-500 italic">
          Button preview not available
        </div>
      );
    }
  };

  return (
    
    <>
      <div className="relative group">
        <div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer min-h-[439px]"
        >
          {/* Button Preview - not clickable */}
          <div 
            className="flex justify-center items-start  min-h-[120px] mb-4 bg-gray-800/50 rounded-lg backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {renderButton()}
          </div>
          {/* GitHub Profile and Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* GitHub Profile Image */}
            <Link
              href={`/search?user=${contribution.metadata.author}`}
              className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
              >
              <ProfileImage author={contribution.metadata.author} />
            </Link>
            
            {/* GitHub Username */}
            <Link
              href={`/search?user=${contribution.metadata.author}`}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
            >
              @{contribution.metadata.author}
            </Link>
          </div>
          
          {/* Type and Difficulty */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              contribution.metadata.type === 'react' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-green-500/20 text-green-400'
            }`}>
              {contribution.metadata.type === 'react' ? 'React' : 'HTML/CSS/JS'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              contribution.metadata.difficulty === 'advanced' 
                ? 'bg-red-500/20 text-red-400'
                : contribution.metadata.difficulty === 'intermediate'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {contribution.metadata.difficulty}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 truncate">
          {contribution.metadata.name}
        </h3>
        
        {/* Tags */}
        {contribution.metadata.tags && contribution.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {contribution.metadata.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
            {contribution.metadata.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{contribution.metadata.tags.length - 3} more
              </span>
            )}
          </div>
        )}
          {/* View Code Button - not clickable for card click */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewCode();
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            View Code
          </button>
        </div>
      </div>
      {/* Modal rendered via React portal to avoid hover/flicker issues */}
      {isModalOpen && typeof window !== 'undefined' && createPortal(
        <ButtonModal 
          contribution={contribution}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />,
        document.body
      )}
    </>
  );
}