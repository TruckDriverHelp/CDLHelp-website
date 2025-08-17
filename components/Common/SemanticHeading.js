import React, { createContext, useContext } from 'react';

/**
 * Semantic heading component that ensures proper hierarchy
 * Helps maintain proper H1-H6 structure for SEO and accessibility
 */
export default function SemanticHeading({
  level = 2,
  children,
  className = '',
  id = null,
  visualLevel = null, // For visual styling different from semantic level
  ...props
}) {
  // Ensure level is between 1-6
  const semanticLevel = Math.min(Math.max(level, 1), 6);
  const Tag = `h${semanticLevel}`;

  // Visual styling can be different from semantic level
  // This allows for proper semantic structure while maintaining design flexibility
  const visualClass = visualLevel
    ? `heading-style-h${visualLevel}`
    : `heading-style-h${semanticLevel}`;

  // Generate ID from text if not provided (for anchor links)
  const headingId = id || (children && typeof children === 'string' ? generateId(children) : null);

  return (
    <Tag
      className={`${visualClass} ${className}`}
      id={headingId}
      data-heading-level={semanticLevel}
      {...props}
    >
      {children}
      {/* Add anchor link for H2 and H3 */}
      {headingId && (semanticLevel === 2 || semanticLevel === 3) && (
        <a href={`#${headingId}`} className="heading-anchor" aria-label={`Link to ${children}`}>
          <span aria-hidden="true">#</span>
        </a>
      )}
    </Tag>
  );
}

/**
 * Generate ID from heading text
 */
function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

/**
 * Heading context to track hierarchy automatically
 */
export const HeadingContext = createContext({ level: 0 });

/**
 * Provider component to establish heading level context
 */
export function HeadingProvider({ children, startLevel = 0 }) {
  return (
    <HeadingContext.Provider value={{ level: startLevel }}>{children}</HeadingContext.Provider>
  );
}

/**
 * Auto-leveling heading component
 * Automatically determines heading level based on context
 */
export function AutoHeading({
  children,
  className = '',
  increment = 1,
  visualLevel = null,
  ...props
}) {
  const { level } = useContext(HeadingContext);
  const nextLevel = Math.min(level + increment, 6);

  return (
    <SemanticHeading level={nextLevel} className={className} visualLevel={visualLevel} {...props}>
      {children}
    </SemanticHeading>
  );
}

/**
 * Section component that increments heading level
 * Use this to wrap content sections for automatic heading hierarchy
 */
export function Section({ children, className = '', as: Component = 'section', ...props }) {
  const { level } = useContext(HeadingContext);

  return (
    <HeadingContext.Provider value={{ level: Math.min(level + 1, 6) }}>
      <Component className={className} {...props}>
        {children}
      </Component>
    </HeadingContext.Provider>
  );
}

/**
 * Article component with automatic H1 context
 */
export function Article({ children, className = '', ...props }) {
  return (
    <HeadingContext.Provider value={{ level: 1 }}>
      <article className={className} {...props}>
        {children}
      </article>
    </HeadingContext.Provider>
  );
}

/**
 * PageTitle component - ensures only one H1 per page
 */
export function PageTitle({ children, className = '', subtitle = null, ...props }) {
  return (
    <header className="page-header">
      <SemanticHeading level={1} className={`page-title ${className}`} {...props}>
        {children}
      </SemanticHeading>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}

/**
 * SectionTitle component - for major page sections (H2)
 */
export function SectionTitle({ children, className = '', ...props }) {
  return (
    <SemanticHeading level={2} className={`section-title ${className}`} {...props}>
      {children}
    </SemanticHeading>
  );
}

/**
 * SubsectionTitle component - for subsections (H3)
 */
export function SubsectionTitle({ children, className = '', ...props }) {
  return (
    <SemanticHeading level={3} className={`subsection-title ${className}`} {...props}>
      {children}
    </SemanticHeading>
  );
}

/**
 * Hook to get current heading level from context
 */
export function useHeadingLevel() {
  const { level } = useContext(HeadingContext);
  return level;
}

/**
 * HOC to wrap component with heading context
 */
export function withHeadingContext(Component, startLevel = 1) {
  return function WrappedComponent(props) {
    return (
      <HeadingProvider startLevel={startLevel}>
        <Component {...props} />
      </HeadingProvider>
    );
  };
}
