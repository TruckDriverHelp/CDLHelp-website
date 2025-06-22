import React from 'react';
import Link from 'next/link';
import styles from './ArticleBanner.module.css';

const ArticleBanner = ({
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    buttonVariant = 'primary', // 'primary', 'secondary', 'outline'
    backgroundColor = 'gradient', // 'gradient', 'solid', 'light', 'blue', 'purple', 'orange', 'green'
    textColor = 'white', // 'white', 'dark'
    alignment = 'center', // 'left', 'center', 'right'
    padding = 'medium', // 'small', 'medium', 'large'
    showIcon = false,
    icon = null,
    className = '',
    children,
    onClick
}) => {
    // Background styles
    const getBackgroundStyle = () => {
        switch (backgroundColor) {
            case 'gradient':
                return {
                    background: 'linear-gradient(76.8deg, #2BA6AC 0%, #36CE83 53.03%, #42E695 100%)'
                };
            case 'solid':
                return {
                    backgroundColor: '#2BA6AC'
                };
            case 'light':
                return {
                    backgroundColor: '#F6F9FB'
                };
            case 'blue':
                return {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                };
            case 'purple':
                return {
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                };
            case 'orange':
                return {
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                };
            case 'green':
                return {
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                };
            default:
                return {
                    background: 'linear-gradient(76.8deg, #2BA6AC 0%, #36CE83 53.03%, #42E695 100%)'
                };
        }
    };

    // Text color styles
    const getTextColor = () => {
        if (backgroundColor === 'light') {
            return 'dark';
        }
        return textColor;
    };

    // Padding styles
    const getPadding = () => {
        switch (padding) {
            case 'small':
                return 'py-4 px-6';
            case 'large':
                return 'py-12 px-8';
            default:
                return 'py-8 px-6';
        }
    };

    // Button styles
    const getButtonStyle = () => {
        const baseStyle = `${styles.articleBannerButton} px-6 py-3 rounded-lg font-medium transition-all duration-300`;
        
        switch (buttonVariant) {
            case 'secondary':
                return `${baseStyle} bg-white text-gray-800 hover:bg-gray-100`;
            case 'outline':
                return `${baseStyle} border-2 border-white text-white hover:bg-white hover:text-gray-800`;
            default:
                return `${baseStyle} bg-white text-gray-800 hover:bg-gray-100`;
        }
    };

    // Alignment styles
    const getAlignment = () => {
        switch (alignment) {
            case 'left':
                return 'text-left';
            case 'right':
                return 'text-right';
            default:
                return 'text-center';
        }
    };

    const textColorClass = getTextColor() === 'dark' ? 'text-gray-800' : 'text-white';
    const alignmentClass = getAlignment();
    const paddingClass = getPadding();
    const buttonStyle = getButtonStyle();

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <div 
            className={`${styles.articleBanner} ${paddingClass} ${className}`}
            style={getBackgroundStyle()}
            onClick={handleClick}
        >
            <div className={`${styles.articleBannerContent} ${alignmentClass}`}>
                {showIcon && icon && (
                    <div className={styles.articleBannerIcon}>
                        {icon}
                    </div>
                )}
                
                {subtitle && (
                    <div className={`${styles.articleBannerSubtitle} ${textColorClass} opacity-90 mb-2`}>
                        {subtitle}
                    </div>
                )}
                
                {title && (
                    <h3 className={`${styles.articleBannerTitle} ${textColorClass}`}>
                        {title}
                    </h3>
                )}
                
                {description && (
                    <p className={`${styles.articleBannerDescription} ${textColorClass} opacity-90 max-w-2xl ${alignment === 'center' ? 'mx-auto' : ''}`}>
                        {description}
                    </p>
                )}
                
                {children && (
                    <div className={`mb-6 ${alignment === 'center' ? 'flex justify-center' : ''}`}>
                        {children}
                    </div>
                )}
                
                {buttonText && buttonLink && (
                    <div className={alignment === 'center' ? 'flex justify-center' : ''}>
                        <Link href={buttonLink}>
                            <a className={buttonStyle}>
                                {buttonText}
                            </a>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleBanner; 