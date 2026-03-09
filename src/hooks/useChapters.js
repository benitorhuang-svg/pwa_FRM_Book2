import { useState, useCallback } from 'react';

/**
 * Hook to manage chapter loading and caching
 */
export function useChapters() {
    const [chapters, setChapters] = useState([]);
    const [chaptersLoading, setChaptersLoading] = useState(true);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [chapterCache, setChapterCache] = useState({});

    const loadChapterData = useCallback(async (chapterId) => {
        if (chapterCache[chapterId]) {
            setChaptersLoading(false);
            return chapterCache[chapterId];
        }

        try {
            setChaptersLoading(true);
            const response = await fetch(`${import.meta.env.BASE_URL}data/chapters_${chapterId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const rawText = await response.text();
            let fullData = null;

            try {
                fullData = JSON.parse(rawText);
            } catch {
                // Fallback: recover from bad escapes
                try {
                    const sanitized = rawText.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
                    fullData = JSON.parse(sanitized);
                } catch (e) {
                    throw new Error(`Failed to parse chapter data: ${e.message}`);
                }
            }

            setChapterCache(prev => ({ ...prev, [chapterId]: fullData }));
            setChaptersLoading(false);
            return fullData;
        } catch (error) {
            console.error(`Failed to load chapter ${chapterId}:`, error);
            setChaptersLoading(false);
            return null;
        }
    }, [chapterCache]);

    return {
        chapters,
        setChapters,
        chaptersLoading,
        setChaptersLoading,
        currentChapter,
        setCurrentChapter,
        loadChapterData
    };
}
