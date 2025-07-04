import dynamic from 'next/dynamic';

// Dynamically import heavy components
export const DynamicQuiz = dynamic(
  () =>
    import('../Quiz/quiz').then(mod => {
      const QuizWrapper = ({ contained, ...props }) => {
        const QuizComponent = mod.default;
        return <QuizComponent contained={contained} {...props} />;
      };
      QuizWrapper.displayName = 'QuizWrapper';
      return QuizWrapper;
    }),
  {
    loading: () => <div>Loading quiz...</div>,
    ssr: true, // Enable server-side rendering for the quiz to ensure translations work
  }
);

export const DynamicModalVideo = dynamic(() => import('react-modal-video'), {
  ssr: false,
});

export const DynamicYouTubePlayer = dynamic(
  () => import('../Common/YouTubePlayer').then(mod => mod.default || mod),
  {
    loading: () => (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Loading video player...
      </div>
    ),
    ssr: false, // Disable server-side rendering for YouTube player
  }
);

export const DynamicMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div>Loading content...</div>,
});

export const DynamicSwiper = dynamic(() => import('swiper/react'), {
  loading: () => <div>Loading carousel...</div>,
});

export const DynamicConfettiExplosion = dynamic(() => import('react-confetti-explosion'), {
  ssr: false,
});

export const DynamicFaqSection = dynamic(() => import('../Home/FaqSection'), {
  loading: () => <div>Loading FAQ section...</div>,
});
