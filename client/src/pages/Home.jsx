'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/utils/api';
import { useUser } from '@/contexts/UserContext';

const bannerImages = [
  '/images/others/banner1.png',
  '/images/others/banner4.png',
  '/images/others/banner2.png',
  '/images/others/banner3.jpg',
];

export default function Home() {
  const { user } = useUser();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [fade, setFade] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banner slider
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
        setFade(true);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/api/games/get-all-games');

        // 🔥 FIX HERE
        setGames(res.data.games || []);
      } catch (err) {
        console.error(err);
        setError('Could not load games.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1b24] text-white">
      {/* Banner */}
      <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] relative overflow-hidden">
        {bannerImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Banner ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentBanner && fade ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* User */}
      {user && (
        <div className="px-4 sm:px-10 py-6 bg-[#1a2b36] flex justify-between">
          <div>
            <p className="text-lg font-semibold">Welcome, {user.name}</p>
            <p className="text-sm text-gray-400">
              Wallet: ₹{Number(user.wallet).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Games */}
      <div className="px-4 sm:px-10 py-10">
        <h2 className="text-2xl font-bold mb-6">Games</h2>

        {loading ? (
          <p>Loading games...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {games.length === 0 ? (
              <p className="text-gray-400">More Games coming soon</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {games.map((game) => (
                  <Link
                    key={game._id}
                    to={`/games/${game.name}`}
                    state={{ gameId: game._id }}
                    className="bg-[#0F212E] p-2 rounded-xl hover:scale-105 transition"
                  >
                    <img
                      src={game.image}
                      alt={game.name}
                      className="rounded-lg w-full"
                    />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}