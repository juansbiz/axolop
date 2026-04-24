import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-yellow-500 opacity-20">404</div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-500 font-mono bg-gray-100 px-4 py-2 rounded-lg break-all">
            {location.pathname}
          </p>
        </div>

        <div className="mb-6 p-4 bg-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-500">
            Redirecting to home in <span className="font-bold">{countdown}</span> seconds...
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-500 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
