const Header = ({ currentPage, setCurrentPage, onLogout }) => (
  <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-gray-200 shadow-md rounded-b-2xl" role="banner">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <button
        className="flex items-center gap-2 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
        aria-label="Go to Home"
        onClick={() => setCurrentPage('home')}
        type="button"
      >
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white text-2xl font-bold shadow">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </span>
        <span className="ml-2 text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          Image Gallery
        </span>
      </button>
      <nav className="flex gap-2 sm:gap-4" aria-label="Main navigation">
        <button
          className={`px-5 py-2 rounded-2xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
            currentPage === 'home'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-current={currentPage === 'home' ? 'page' : undefined}
          onClick={() => setCurrentPage('home')}
          type="button"
        >
          Home
        </button>
        <button
          className={`px-5 py-2 rounded-2xl font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
            currentPage === 'clusters'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-current={currentPage === 'clusters' ? 'page' : undefined}
          onClick={() => setCurrentPage('clusters')}
          type="button"
        >
          Clusters
        </button>
        <button
          className="px-5 py-2 rounded-2xl font-semibold text-gray-500 hover:text-red-600 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
          onClick={onLogout}
          aria-label="Logout"
          type="button"
        >
          Logout
        </button>
      </nav>
    </div>
  </header>
);

export default Header;