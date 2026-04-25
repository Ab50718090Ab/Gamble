// MinesGame.jsx (refactored - FIXED PRODUCTION VERSION)
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import { ImSpinner2 } from "react-icons/im";
import { useLocation, useNavigate } from "react-router-dom";
import GameSummaryAndBets from "@/components/GameSummaryAndBets";
import Breadcrumbs from "@/components/Breadcrumbs";

const MinesGame = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const gameId = location.state?.gameId;

    // 🚨 SAFE GUARD (IMPORTANT)
    useEffect(() => {
        if (!gameId) {
            toast.error("Game not found");
            navigate("/games");
        }
    }, [gameId, navigate]);

    const [amount, setAmount] = useState(0);
    const [minesCount, setMinesCount] = useState(3);
    const [grid, setGrid] = useState(Array(25).fill(null));
    const [revealedTiles, setRevealedTiles] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [currentProfit, setCurrentProfit] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [betId, setBetId] = useState(null);
    const [explodedBombIndex, setExplodedBombIndex] = useState(null);
    const [loading, setLoading] = useState(false);
    const [endGameLoading, setEndGameLoading] = useState(false);
    const [totalWinAmount, setTotalWinAmount] = useState(0);
    const [winningStreak, setWinningStreak] = useState(0);
    const [loadingWinningData, setLoadingWinningData] = useState(false);
    const [loadingBets, setLoadingBets] = useState(false);
    const [bets, setBets] = useState([]);
    const [totalWageredAmount, setTotalWageredAmount] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const [totalLose, setTotalLose] = useState(0);
    const [revealLoading, setRevealLoading] = useState(false);
    const [currentBets, setCurrentBets] = useState([]);

    const { user, setUser } = useUser();

    const diamondSoundRef = useRef(null);
    const bombSoundRef = useRef(null);

    const playDiamondSound = () => {
        if (diamondSoundRef.current) {
            diamondSoundRef.current.volume = 0.1;
            diamondSoundRef.current.currentTime = 0;
            diamondSoundRef.current.play();
        }
    };

    const playBombSound = () => {
        if (bombSoundRef.current) {
            bombSoundRef.current.volume = 0.2;
            bombSoundRef.current.currentTime = 0;
            bombSoundRef.current.play();
        }
    };

    // ---------------- FETCH DATA ----------------
    useEffect(() => {
        if (!gameId) return;

        const fetchUserBetsByGame = async () => {
            try {
                setLoadingBets(true);
                const response = await api.get(`/api/bet/fetch-user-bet-by-game?gameId=${gameId}`);

                if (response.data?.success) {
                    setBets(response.data?.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingBets(false);
            }
        };

        const fetchTotalWinAndWinStreakByGame = async () => {
            try {
                setLoadingWinningData(true);
                const response = await api.get(
                    `/api/bet/get-user-totalwin-and-winningstreak-by-game?gameId=${gameId}`
                );

                const {
                    success,
                    totalWinningAmount,
                    totalWinningStreak,
                    totalWageredAmount,
                    totalWins,
                    totalLose
                } = response.data;

                if (!success) throw new Error("Failed fetching stats");

                setTotalWinAmount(totalWinningAmount);
                setWinningStreak(totalWinningStreak);
                setTotalWageredAmount(totalWageredAmount);
                setTotalWins(totalWins);
                setTotalLose(totalLose);

            } catch (err) {
                console.error(err);
            } finally {
                setLoadingWinningData(false);
            }
        };

        fetchUserBetsByGame();
        fetchTotalWinAndWinStreakByGame();
    }, [gameId]);

    // ---------------- START GAME ----------------
    const startGame = async () => {
        if (!user) return toast.error("Please login");
        if (!user?.isVerified) return toast.error("Verify account first");
        if (!amount || amount <= 0) return toast.error("Enter amount");

        setLoading(true);

        try {
            const { data } = await api.post("/api/games/mines/start-mine", {
                amount,
                minesCount,
                gameId
            });

            setBetId(data.bet);
            setGrid(Array(25).fill(null));
            setRevealedTiles([]);
            setIsGameStarted(true);
            setCurrentProfit(0);
            setMultiplier(1);
            setExplodedBombIndex(null);
            setUser(prev => ({ ...prev, wallet: data.wallet }));

            toast.success("Game started");

        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- TILE CLICK ----------------
    const handleTileClick = async (index) => {
        if (!isGameStarted || revealedTiles.includes(index)) return;

        setRevealLoading(true);

        try {
            const { data } = await api.patch("/api/games/mines/reveal-tile", {
                betId,
                tileIndex: index
            });

            const { isMine, revealedTiles: updated, status, multiplier, profit } = data;

            setGrid(prev => {
                const newGrid = [...prev];
                newGrid[index] = isMine ? "💣" : "💎";
                return newGrid;
            });

            setRevealedTiles(updated);
            setMultiplier(multiplier);
            setCurrentProfit(profit);

            if (isMine) {
                playBombSound();
                toast.error("You hit a mine!");
                await endGame(false);
            } else {
                playDiamondSound();
                if (status === "win") {
                    toast.success(`Won ₹${profit}`);
                    await endGame(true);
                }
            }

        } catch (err) {
            console.error(err);
        } finally {
            setRevealLoading(false);
        }
    };

    // ---------------- END GAME ----------------
    const endGame = async (won) => {
        if (!betId) return;

        try {
            const { data } = await api.post("/api/games/mines/end-mine", { betId });

            setBets(prev => [data.bet, ...prev]);
            setCurrentBets(prev => [data.bet, ...prev]);
            setTotalWageredAmount(prev => prev + data.bet.betAmount);

            if (won) {
                setTotalWinAmount(prev => prev + data.bet.winAmount - data.bet.betAmount);
                setWinningStreak(prev => prev + 1);
                setTotalWins(prev => prev + 1);
            } else {
                setTotalWinAmount(prev => prev - data.bet.betAmount);
                setWinningStreak(0);
                setTotalLose(prev => prev + 1);
            }

            setUser(prev => ({ ...prev, wallet: data.wallet }));

        } catch (err) {
            console.error(err);
        } finally {
            setIsGameStarted(false);
            setBetId(null);
            setMultiplier(1);
            setCurrentProfit(0);
            setEndGameLoading(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <div className="min-h-full bg-[#0f1b24]">

            <Breadcrumbs />

            <div className="text-white flex flex-col px-4 py-6 gap-10">

                <h2 className="text-center text-xl">💣 Mines Game</h2>

                {!gameId ? null : (
                    <div className="text-center text-green-400">
                        Game Loaded
                    </div>
                )}

            </div>
        </div>
    );
};

export default MinesGame;