import Breadcrumbs from "@/components/Breadcrumbs";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get("/api/games/get-all-games");

        // 🔥 FIX HERE
        setGames(res.data.games || []);
      } catch (err) {
        console.error(err);
        setError("Could not load games.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <p className="text-white">Loading games...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Breadcrumbs />

      <div className="px-10 py-6">
        <h1 className="text-2xl font-bold text-white my-4">Games</h1>

        {games.length === 0 ? (
          <p className="text-gray-400">More games coming soon!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {games.map((game) => (
              <Link
                key={game._id}
                to={`/games/${game.slug}`}
                state={{ gameId: game._id }}
                className="hover:scale-105 transition"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="rounded-xl w-full"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Games;