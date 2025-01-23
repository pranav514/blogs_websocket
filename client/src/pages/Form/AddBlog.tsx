import axios from 'axios';
import React, { useState } from 'react';

const FormElements = () => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ta', name: 'Tamil' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text || !language) {
      alert('Please fill in all fields');
      return;
    }

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/translate/translation/${userId}`,
        { text, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 200) {
        setSuccess('Blog post published successfully!');
        setText('');
        setLanguage('');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
        Create a Blog Post
      </h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-5">
          <label className="mb-3 block text-black dark:text-white">
            Select Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label className="mb-3 block text-black dark:text-white">
            Blog Content
          </label>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your blog post here"
            required
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          ></textarea>
        </div>

        {error && <p className="text-red-500 mb-5">{error}</p>}
        {success && <p className="text-green-500 mb-5">{success}</p>}

        <button
          type="submit"
          className="w-full rounded-lg border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Blog Post'}
        </button>
      </form>
    </div>
  );
};

export default FormElements;
