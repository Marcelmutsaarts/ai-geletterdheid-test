import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = 'Gemini analyseert je antwoorden...' }: LoadingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-white/90 px-6 py-12 shadow-card"
    >
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-primaryPurple/30" />
        <div className="absolute inset-0 rounded-full border-4 border-primaryPurple border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-center text-lg font-semibold text-darkPurple">{message}</p>
      <p className="mt-2 max-w-md text-center text-sm text-grayText">
        Dit duurt meestal minder dan 5 seconden. Even geduld, we maken je advies klaar.
      </p>
    </motion.div>
  );
};

export default LoadingScreen;
