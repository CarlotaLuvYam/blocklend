const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 pt-24">
    <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
      <h1 className="text-4xl font-bold text-blue-900 mb-4">404</h1>
      <p className="text-lg text-blue-700 mb-6">Page Not Found</p>
      <a href="/" className="text-blue-600 hover:underline">Go Home</a>
    </div>
  </div>
);

export default NotFound;
