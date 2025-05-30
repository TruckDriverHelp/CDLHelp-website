import dynamic from 'next/dynamic';

// Dynamically import heavy components
export const DynamicQuiz = dynamic(() => import('../Quiz/quiz'), {
  loading: () => <div>Loading quiz...</div>,
  ssr: false // Disable server-side rendering for the quiz
});

export const DynamicBlog = dynamic(() => import('../Blog/Blog'), {
  loading: () => <div>Loading blog...</div>
});

export const DynamicFeedbacks = dynamic(() => import('../Feedbacks/Feedbacks'), {
  loading: () => <div>Loading feedbacks...</div>
});

export const DynamicAppScreenshots = dynamic(() => import('../AppScreenshots/AppScreenshots'), {
  loading: () => <div>Loading screenshots...</div>
}); 