import axios from 'axios';
import { useEffect, useState } from 'react';

interface Blog {
  _id: string;
  content: string;
}

function UpdateBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated. Please log in.');
          setLoading(false);
          return;
        }
        console.log('ffddf');

        const response = await axios.get(
          `http://localhost:3000/api/v1/blog/getbyuser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBlogs(response.data.blog || []);
      } catch (err) {
        setError('Failed to fetch blogs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
        Your Blog Posts
      </h2>

      {loading && (
        <p className="text-gray-600 dark:text-gray-300">Loading blogs...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && blogs.length === 0 && !error && (
        <p className="text-gray-600 dark:text-gray-300">No blogs found.</p>
      )}

      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {blogs.map((blog) => (
            <div
              // Assuming `_id` is the unique identifier
              className="rounded-lg border border-stroke p-4 shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-black dark:text-white">{blog.content}</p>
              <button>Update</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UpdateBlog;
