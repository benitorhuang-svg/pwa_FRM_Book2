import React from 'react';

const TopicSelector = ({ topics, selectedId, onSelect, className }) => {
    if (!topics || topics.length === 0) return null;

    return (
        <select
            className={`topic-selector ${className}`}
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
        >
            <option value="">選擇章節小節...</option>
            {topics.map((topic, idx) => (
                <option key={idx} value={topic.id || topic}>
                    {topic.title || topic}
                </option>
            ))}
        </select>
    );
};

export default React.memo(TopicSelector);
