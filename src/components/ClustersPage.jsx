import React, { useState } from 'react';
import { triggerClustering, getStoredClusters } from '../services/api';
import ImageModal from './ImageModal';

const ALGORITHMS = [
  { label: 'KMeans', value: 'kmeans' },
  { label: 'Hierarchical', value: 'hierarchical' },
];

const DEFAULT_N_CLUSTERS = 3;

const ClustersPage = ({ token }) => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [algorithm, setAlgorithm] = useState('hierarchical');
  const [nClusters, setNClusters] = useState(DEFAULT_N_CLUSTERS);

  // Fetch clusters from GET /images/clusters
  const fetchStoredClusters = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getStoredClusters(token);
      setClusters(data || []);
    } catch {
      setError('Failed to fetch clusters.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger clustering, then fetch clusters
  const handleClusterImages = async () => {
    setLoading(true);
    setError('');
    try {
      await triggerClustering(token, {
        algorithm,
        n_clusters: nClusters,
        generate_names: true,
      });
      await fetchStoredClusters();
    } catch {
      setError('Failed to cluster images.');
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch stored clusters
  React.useEffect(() => {
    fetchStoredClusters();
    // eslint-disable-next-line
  }, [token]);

  // UI for cluster folders with image preview
  const renderClusters = () => (
    <div>
      <div className="mt-10">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Clusters</h2>
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-2xl">
              <svg className="animate-spin h-8 w-8 text-indigo-500 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-indigo-700 font-semibold">Loading clusters...</span>
            </div>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            {clusters.map((cluster) => (
              <div
                key={cluster.cluster_id}
                className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-100 group flex flex-col items-center p-6"
                onClick={() => setSelectedCluster(cluster)}
                tabIndex={0}
                role="button"
                aria-label={`View cluster ${cluster.name}`}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedCluster(cluster); }}
                style={{ cursor: 'pointer' }}
              >
                <div className="w-24 h-24 mb-3 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 group-hover:ring-2 group-hover:ring-indigo-400 transition">
                  {cluster.images && cluster.images.length > 0 ? (
                    <img
                      src={cluster.images[0].thumbnail_url}
                      alt={cluster.images[0].filename}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-6l-2-3-2 3H5a2 2 0 00-2 2z" />
                    </svg>
                  )}
                </div>
                <span className="font-semibold text-gray-900 text-lg mb-1 truncate w-full text-center">{cluster.name}</span>
                <span className="text-xs text-gray-500">{cluster.images.length} images</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // UI for images inside a cluster
  const renderClusterImages = () => (
    <div>
      <button
        onClick={() => setSelectedCluster(null)}
        className="mb-6 inline-flex items-center text-indigo-600 hover:underline font-semibold"
      >
        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Clusters
      </button>
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">{selectedCluster.name}</h2>
      {selectedCluster.images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {selectedCluster.images.map((image) => (
            <div
              key={image.id}
              className="group cursor-pointer"
              onClick={() => setSelectedImage(image)}
              tabIndex={0}
              role="button"
              aria-label={`View image ${image.filename}`}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedImage(image); }}
              style={{ cursor: 'pointer' }}
            >
              <div className="overflow-hidden rounded-2xl bg-white shadow-md group-hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <img
                  src={image.thumbnail_url}
                  alt={image.filename}
                  className="w-full h-44 object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">{image.filename}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-gray-900">No images in this cluster</h3>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Forum Section: Always visible, integrated, not boxed */}
      <section className="sticky top-0 z-40 w-full py-6 px-4 bg-white/90 backdrop-blur border-b border-gray-200">
        <form className="flex flex-col sm:flex-row items-end gap-8 w-full max-w-5xl mx-auto">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-base font-semibold text-gray-700 mb-1" htmlFor="algorithm-select">Clustering Algorithm</label>
            <div className="relative">
              <select
                id="algorithm-select"
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value)}
                className="appearance-none rounded-xl border border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-base w-full min-w-[180px] py-2 px-3 pr-10 transition-colors hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer"
                aria-label="Select clustering algorithm"
              >
                {ALGORITHMS.map(algo => (
                  <option key={algo.value} value={algo.value}>{algo.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
          {(algorithm === 'kmeans' || algorithm === 'hierarchical') && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-base font-semibold text-gray-700 mb-1" htmlFor="n-clusters-input">Number of Clusters</label>
              <input
                id="n-clusters-input"
                type="number"
                min={1}
                value={nClusters}
                onChange={e => setNClusters(Number(e.target.value))}
                className="rounded-xl border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 text-base w-full py-2 px-3 transition-colors"
                aria-label="Number of clusters"
              />
            </div>
          )}
          <div className="flex-1 min-w-[200px] flex items-end">
            <button
              type="button"
              onClick={handleClusterImages}
              className="inline-flex items-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 px-8 py-2.5 text-base font-bold text-white shadow-md hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition w-full cursor-pointer"
              disabled={loading}
              aria-busy={loading}
              aria-label={loading ? 'Clustering images' : 'Cluster images'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Clustering...
                </>
              ) : (
                <>
                  <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01.88 7.9M8 7a4 4 0 00-.88 7.9" />
                  </svg>
                  Cluster Images
                </>
              )}
            </button>
          </div>
        </form>
      </section>
      {/* Error feedback, always below forum */}
      {error && <div className="mb-4 rounded-xl bg-red-50 text-red-700 px-4 py-2 shadow max-w-2xl mx-auto mt-4">{error}</div>}
      {/* Clusters Section: below forum, scrolls independently, loading overlay only here */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedCluster ? renderClusterImages() : renderClusters()}
        {selectedImage && (
          <ImageModal imageUrl={selectedImage.original_url} onClose={() => setSelectedImage(null)} />
        )}
      </main>
    </div>
  );
};

export default ClustersPage;