# ArticleBanner Component

A flexible and customizable banner component designed to be placed mid-articles throughout the website. This component provides various styling options and can be used for call-to-actions, information displays, announcements, and more.

## Features

- 🎨 Multiple background options (gradient, solid, light, and custom colors)
- 📱 Fully responsive design
- 🎯 Flexible alignment options (left, center, right)
- 🔘 Customizable button styles
- 🎪 Optional icon support
- ✨ Smooth animations and hover effects
- 🎭 Multiple padding sizes
- 🎨 CSS module styling for better maintainability

## Installation

The component is located at `components/Common/ArticleBanner.js` and can be imported directly:

```javascript
import ArticleBanner from '../components/Common/ArticleBanner';
```

## Basic Usage

```javascript
import ArticleBanner from '../components/Common/ArticleBanner';

// Simple banner with title and description
<ArticleBanner
    title="Ready to Get Started?"
    description="Join thousands of users who have already improved their workflow."
    buttonText="Start Free Trial"
    buttonLink="/signup"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | - | Main heading text |
| `subtitle` | string | - | Subtitle text (appears above title) |
| `description` | string | - | Main description text |
| `buttonText` | string | - | Button text |
| `buttonLink` | string | - | Button link URL |
| `buttonVariant` | string | 'primary' | Button style: 'primary', 'secondary', 'outline' |
| `backgroundColor` | string | 'gradient' | Background style: 'gradient', 'solid', 'light', 'blue', 'purple', 'orange', 'green' |
| `textColor` | string | 'white' | Text color: 'white', 'dark' |
| `alignment` | string | 'center' | Content alignment: 'left', 'center', 'right' |
| `padding` | string | 'medium' | Padding size: 'small', 'medium', 'large' |
| `showIcon` | boolean | false | Whether to show an icon |
| `icon` | ReactNode | null | Icon component to display |
| `className` | string | '' | Additional CSS classes |
| `children` | ReactNode | - | Custom content to render inside banner |
| `onClick` | function | - | Click handler for the banner |

## Usage Examples

### 1. Call-to-Action Banner

```javascript
<ArticleBanner
    title="Ready to Get Started?"
    subtitle="Take Action Now"
    description="Join thousands of users who have already improved their workflow with our platform."
    buttonText="Start Free Trial"
    buttonLink="/signup"
    backgroundColor="gradient"
    alignment="center"
    padding="large"
/>
```

### 2. Information Banner

```javascript
<ArticleBanner
    title="Pro Tip"
    subtitle="Expert Advice"
    description="Did you know that using keyboard shortcuts can increase your productivity by up to 40%?"
    backgroundColor="light"
    textColor="dark"
    alignment="left"
    padding="medium"
/>
```

### 3. Download Banner with Icon

```javascript
const DownloadIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
);

<ArticleBanner
    title="Download Our Mobile App"
    subtitle="Available Now"
    description="Get instant access to all features on the go."
    buttonText="Download Now"
    buttonLink="/download"
    backgroundColor="blue"
    showIcon={true}
    icon={<DownloadIcon />}
    alignment="center"
    padding="medium"
/>
```

### 4. Newsletter Signup

```javascript
<ArticleBanner
    title="Stay Updated"
    subtitle="Newsletter"
    description="Get the latest tips and insights delivered to your inbox."
    buttonText="Subscribe"
    buttonLink="/newsletter"
    backgroundColor="purple"
    buttonVariant="outline"
    alignment="center"
    padding="medium"
/>
```

### 5. Custom Content Banner

```javascript
<ArticleBanner
    title="Custom Content Example"
    backgroundColor="gradient"
    alignment="center"
    padding="medium"
>
    <div className="text-white">
        <p className="mb-4">This banner contains custom content.</p>
        <div className="flex justify-center space-x-4">
            <button className="bg-white text-gray-800 px-4 py-2 rounded-lg">
                Option 1
            </button>
            <button className="border-2 border-white text-white px-4 py-2 rounded-lg">
                Option 2
            </button>
        </div>
    </div>
</ArticleBanner>
```

## Background Options

- **gradient**: Default green gradient
- **solid**: Solid teal color
- **light**: Light gray background
- **blue**: Blue gradient
- **purple**: Purple gradient
- **orange**: Orange gradient
- **green**: Green gradient

## Button Variants

- **primary**: White background with dark text
- **secondary**: White background with dark text (same as primary)
- **outline**: Transparent with white border and text

## Best Practices

1. **Use clear, action-oriented titles** that tell users what they can expect
2. **Keep descriptions concise** - aim for 1-2 sentences maximum
3. **Choose appropriate background colors** that match your content and brand
4. **Use icons sparingly** - only when they add value to the message
5. **Test different alignments** - center works well for CTAs, left for information
6. **Consider mobile responsiveness** - the component is already optimized for mobile
7. **Use appropriate padding** - large for important CTAs, small for notices

## Styling Customization

The component uses CSS modules for styling. You can override styles by:

1. Adding custom classes via the `className` prop
2. Modifying the CSS module file (`ArticleBanner.module.css`)
3. Using inline styles for specific instances

## Accessibility

The component includes:
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly markup
- High contrast color options

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for CSS Grid and Flexbox)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight component with minimal dependencies
- CSS animations are hardware-accelerated
- No external dependencies beyond React and Next.js
- Optimized for production builds 