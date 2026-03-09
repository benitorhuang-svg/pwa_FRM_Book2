import React from 'react';
import TopNav from '../molecules/TopNav';

import { Sun, Moon, Book } from 'lucide-react';
import './AppHeader.css';

const AppHeader = ({
    chapters,
    currentChapter,
    bodyContent,
    onChapterSelect,
    onScriptSelect,
    currentScript,
    selectedTopicId,
    onTopicSelect,
    darkMode,
    setDarkMode
}) => {
    return (
        <div className="app-header-organism">
            <div className="header-left">
                <div className="brand-atom">
                    <Book className="brand-icon" size={20} />
                    <span className="brand-name">FRM Book 2</span>
                </div>
            </div>

            <div className="header-middle">
                <TopNav
                    chapters={chapters}
                    currentChapter={currentChapter}
                    bodyContent={bodyContent}
                    onChapterSelect={onChapterSelect}
                    onScriptSelect={onScriptSelect}
                    currentScript={currentScript}
                    selectedTopicId={selectedTopicId}
                    onTopicSelect={onTopicSelect}
                />
            </div>

            <div className="header-right">

                <button
                    className="icon-button"
                    onClick={() => setDarkMode(!darkMode)}
                    title={darkMode ? '切換亮色模式' : '切換暗色模式'}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </div>
    );
};

export default React.memo(AppHeader);
