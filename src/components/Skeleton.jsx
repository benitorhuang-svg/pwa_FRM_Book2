import './Skeleton.css'

export function Skeleton({ type = 'text', height, width, className = '' }) {
    const style = {
        height: height || undefined,
        width: width || undefined
    }

    return (
        <div
            className={`skeleton skeleton-${type} ${className}`}
            style={style}
        >
            <div className="skeleton-shimmer"></div>
        </div>
    )
}

export function EditorSkeleton() {
    return (
        <div className="editor-skeleton">
            <Skeleton type="text" height="1.5rem" width="30%" className="mb-4" />
            <Skeleton type="rect" height="calc(100% - 3rem)" width="100%" />
        </div>
    )
}

export function OutputSkeleton() {
    return (
        <div className="output-skeleton">
            <Skeleton type="text" height="1.25rem" width="40%" className="mb-4" />
            <Skeleton type="rect" height="100px" width="100%" className="mb-4" />
            <Skeleton type="rect" height="200px" width="100%" />
        </div>
    )
}
