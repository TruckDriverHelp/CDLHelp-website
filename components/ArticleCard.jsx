import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { formatDate } from '../lib/utils';
import styles from '../styles/ArticleCard.module.scss';

const ArticleCard = ({ article }) => {
  const router = useRouter();
  const { locale } = router;
  
  const {
    slug,
    title,
    description = '',
    publishedAt,
    cover,
    categories,
    author
  } = article.attributes;

  const coverUrl = cover?.data?.attributes?.url;
  const coverAlt = cover?.data?.attributes?.alternativeText || title;
  const authorName = author?.data?.attributes?.name;
  const authorAvatar = author?.data?.attributes?.avatar?.data?.attributes?.url;
  
  // Check if this is a blog post
  const isBlogPost = article.attributes.blog_page === true;
  const articleUrl = locale === 'en' 
    ? `${isBlogPost ? '/blog' : ''}/${slug}` 
    : `/${locale}${isBlogPost ? '/blog' : ''}/${slug}`;
  const formattedDate = formatDate(publishedAt, locale);
  
  // Get Strapi host from environment or use a default
  const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST || process.env.STRAPI_HOST || '';

  return (
    <article className={styles.articleCard}>
      <Link href={articleUrl}>
        <a className={styles.cardLink}>
          {coverUrl && (
            <div className={styles.imageWrapper}>
              <Image
                src={coverUrl.startsWith('http') ? coverUrl : `${strapiHost}${coverUrl}`}
                alt={coverAlt}
                width={cover?.data?.attributes?.width || 400}
                height={cover?.data?.attributes?.height || 250}
                layout="responsive"
                objectFit="cover"
                className={styles.coverImage}
              />
            </div>
          )}
          
          <div className={styles.content}>
            {categories?.data?.length > 0 && (
              <div className={styles.categories}>
                {categories.data.map((category) => (
                  <span key={category.id} className={styles.category}>
                    {category.attributes.name}
                  </span>
                ))}
              </div>
            )}
            
            <h2 className={styles.title}>{title}</h2>
            
            {description && (
              <p className={styles.description}>{description}</p>
            )}
            
            <div className={styles.meta}>
              {authorName && (
                <div className={styles.author}>
                  {authorAvatar && (
                    <Image
                      src={authorAvatar.startsWith('http') ? authorAvatar : `${strapiHost}${authorAvatar}`}
                      alt={authorName}
                      width={24}
                      height={24}
                      className={styles.authorAvatar}
                    />
                  )}
                  <span className={styles.authorName}>{authorName}</span>
                </div>
              )}
              
              <time className={styles.date} dateTime={publishedAt}>
                {formattedDate}
              </time>
            </div>
          </div>
        </a>
      </Link>
    </article>
  );
};

export default ArticleCard;