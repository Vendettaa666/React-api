const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <div className="flex flex-col justify-center items-center py-12">
      {/* Modern Spinner with Gradient */}
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-700`}></div>
        <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500 animate-spin absolute top-0 left-0`}></div>
      </div>
      
      {/* Loading Text */}
      <p className="text-gray-400 mt-4 text-sm font-medium">{text}</p>
      
      {/* Music Wave Animation */}
      <div className="flex items-center gap-1 mt-3">
        <div className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse" style={{height: '8px', animationDelay: '0ms'}}></div>
        <div className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse" style={{height: '12px', animationDelay: '150ms'}}></div>
        <div className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse" style={{height: '16px', animationDelay: '300ms'}}></div>
        <div className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse" style={{height: '12px', animationDelay: '450ms'}}></div>
        <div className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse" style={{height: '8px', animationDelay: '600ms'}}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;