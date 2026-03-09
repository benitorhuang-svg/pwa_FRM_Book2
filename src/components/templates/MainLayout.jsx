import React from 'react';
import './MainLayout.css';

const MainLayout = ({ header, sidebar, content, footer, isSidebarOpen }) => {
    return (
        <div className={`app-template ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <header className="template-header">
                {header}
            </header>

            <div className="template-body">
                {sidebar && (
                    <aside className="template-sidebar">
                        {sidebar}
                    </aside>
                )}

                <main className="template-content">
                    {content}
                </main>
            </div>

            {footer && (
                <footer className="template-footer">
                    {footer}
                </footer>
            )}
        </div>
    );
};

export default MainLayout;
