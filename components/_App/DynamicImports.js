import dynamic from 'next/dynamic';

// Dynamically import heavy components
export const DynamicQuiz = dynamic(() => import('../Quiz/quiz').then(mod => ({ contained, ...props }) => {
  const QuizComponent = mod.default;
  return <QuizComponent contained={contained} {...props} />;
}), {
  loading: () => <div>Loading quiz...</div>,
  ssr: false // Disable server-side rendering for the quiz
});

export const DynamicModalVideo = dynamic(() => import('react-modal-video'), {
  ssr: false
});

export const DynamicYouTubePlayer = dynamic(() => import('../Common/YouTubePlayer'), {
  loading: () => <div>Loading video player...</div>
});

export const DynamicMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div>Loading content...</div>
});

export const DynamicSwiper = dynamic(() => import('swiper/react'), {
  loading: () => <div>Loading carousel...</div>
});

export const DynamicConfettiExplosion = dynamic(() => import('react-confetti-explosion'), {
  ssr: false
});

export const DynamicFaqSection = dynamic(() => import('../Home/FaqSection'), {
  loading: () => <div>Loading FAQ section...</div>
}); 