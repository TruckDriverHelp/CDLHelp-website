import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import styles from '../../../styles/PreTripInspection.module.css';
import Navbar from '../../../components/_App/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../../components/_App/Layout';

export default function PreTripSection({
  sectionData,
  currentFile,
  currentSection,
  totalSections,
  totalFiles,
  prevFileSections,
  fileSlug,
  nextFileSlug,
  prevFileSlug,
}) {
  const router = useRouter();
  const { t } = useTranslation('pre-trip');
  const locale = router.locale || 'en';

  const handleNavigation = direction => {
    let nextSlug = fileSlug;
    let nextSection = currentSection;

    if (direction === 'next') {
      if (currentSection < totalSections) {
        nextSection = currentSection + 1;
      } else if (currentFile < totalFiles) {
        nextSlug = nextFileSlug;
        nextSection = 1;
      }
    } else {
      if (currentSection > 1) {
        nextSection = currentSection - 1;
      } else if (currentFile > 1) {
        nextSlug = prevFileSlug;
        nextSection = prevFileSections;
      }
    }

    router.push(`/pre-trip-inspection/${nextSlug}/${nextSection}`);
  };

  return (
    <Layout>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>{sectionData.name.en}</h1>

        <div className={styles.section}>
          <div className={styles.languageGroup}>
            <h2 className={styles.itemTitle}>{sectionData.title.en}</h2>
            {locale !== 'en' && (
              <>
                <p className={styles.pronunciation}>{sectionData.title.cir}</p>
                <p className={styles.translation}>{sectionData.title.ru}</p>
              </>
            )}
          </div>

          {sectionData.notes.en && (
            <div className={styles.languageGroup}>
              <p className={styles.notes}>{sectionData.notes.en}</p>
              {locale !== 'en' && (
                <>
                  <p className={styles.pronunciation}>{sectionData.notes.cir}</p>
                  <p className={styles.translation}>{sectionData.notes.ru}</p>
                </>
              )}
            </div>
          )}

          <div className={styles.textList}>
            {sectionData.text.map((textItem, textIndex) => (
              <div key={textIndex} className={styles.languageGroup}>
                <p className={styles.text}>{textItem.en}</p>
                {locale !== 'en' && (
                  <>
                    <p className={styles.pronunciation}>{textItem.cir}</p>
                    <p className={styles.translation}>{textItem.ru}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.navigation}>
          <button
            onClick={() => handleNavigation('back')}
            disabled={currentFile === 1 && currentSection === 1}
            className={styles.navButton}
          >
            {t('navigation.back')}
          </button>
          <button
            onClick={() => handleNavigation('next')}
            disabled={currentFile === totalFiles && currentSection === totalSections}
            className={styles.navButton}
          >
            {t('navigation.next')}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const preTripDir = path.join(process.cwd(), 'data/pre-trip');
  const files = fs.readdirSync(preTripDir).filter(file => file.endsWith('.json'));

  const paths = [];

  // Generate paths for each locale
  locales.forEach(locale => {
    files.forEach(file => {
      // const fileNumber = parseInt(file.split('-')[0]);
      const fileSlug = file.split('-').slice(1).join('-').replace('.json', '');
      const fileContents = fs.readFileSync(path.join(preTripDir, file), 'utf8');
      const fileData = JSON.parse(fileContents);

      fileData.section.forEach((_, sectionIndex) => {
        paths.push({
          params: {
            file: fileSlug,
            section: (sectionIndex + 1).toString(),
          },
          locale: locale === 'en' ? undefined : locale, // English without /en/ prefix
        });
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params, locale }) {
  const preTripDir = path.join(process.cwd(), 'data/pre-trip');
  const files = fs.readdirSync(preTripDir).filter(file => file.endsWith('.json'));
  const totalFiles = files.length;

  // Find the file that matches the slug
  const fileName = files.find(file => {
    const fileSlug = file.split('-').slice(1).join('-').replace('.json', '');
    return fileSlug === params.file;
  });

  if (!fileName) {
    return {
      notFound: true,
    };
  }

  const currentFile = parseInt(fileName.split('-')[0]);
  const currentSection = parseInt(params.section);

  // Get current file data
  const filePath = path.join(preTripDir, fileName);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const fileData = JSON.parse(fileContents);

  // Get next and previous file slugs
  let nextFileSlug = '';
  let prevFileSlug = '';

  if (currentFile < totalFiles) {
    const nextFileName = files.find(file => file.startsWith(`${currentFile + 1}-`));
    nextFileSlug = nextFileName.split('-').slice(1).join('-').replace('.json', '');
  }

  if (currentFile > 1) {
    const prevFileName = files.find(file => file.startsWith(`${currentFile - 1}-`));
    prevFileSlug = prevFileName.split('-').slice(1).join('-').replace('.json', '');
  }

  // Get previous file's section count if needed
  let prevFileSections = 0;
  if (currentFile > 1) {
    const prevFileName = files.find(file => file.startsWith(`${currentFile - 1}-`));
    const prevFilePath = path.join(preTripDir, prevFileName);
    const prevFileContents = fs.readFileSync(prevFilePath, 'utf8');
    const prevFileData = JSON.parse(prevFileContents);
    prevFileSections = prevFileData.section.length;
  }

  const sectionData = {
    name: fileData.name,
    ...fileData.section[currentSection - 1],
  };

  return {
    props: {
      sectionData,
      currentFile,
      currentSection,
      totalSections: fileData.section.length,
      totalFiles,
      prevFileSections,
      fileSlug: params.file,
      nextFileSlug,
      prevFileSlug,
      ...(await serverSideTranslations(locale, ['pre-trip', 'navbar'])),
    },
  };
}
