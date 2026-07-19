import { useState, useEffect } from 'react';

const useFetch = (username) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (user) => {
    setLoading(true);
    setError(null);
    try {
      const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`),
        fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=5`)
      ]);

      if (!userResponse.ok) {
        throw new Error('User not found');
      }

      const userData = await userResponse.json();
      const reposData = reposResponse.ok ? await reposResponse.json() : [];

      setUserData(userData);
      setRepos(reposData);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchData(username);
    }
  }, [username]);

  return { userData, repos, loading, error, fetchData };
};

export default useFetch;
