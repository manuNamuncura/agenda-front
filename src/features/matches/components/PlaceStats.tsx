// src/features/matches/components/PlaceStats.tsx
import React, { useState, useEffect } from 'react';
import { matchService } from '../services/match.service';

interface PlaceStats {
    placeName: string;
    totalMatches: number;
    wins: number;
    losses: number;
    ties: number;
    goalsFor: number;
    goalsAgainst: number;
    winRate: number;
    goalsDifference: number;
    lastPlayed: string;
}

export const PlaceStats: React.FC = () => {
    const [stats, setStats] = useState<PlaceStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const placeStats = await matchService.getPlaceStats();
            setStats(placeStats);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (stats.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
                <div className="text-gray-400 mb-2">📊</div>
                <p className="text-gray-400">Aún no hay estadísticas por lugar</p>
                <p className="text-sm text-gray-500 mt-1">Registra algunos partidos para comenzar</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-black">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </div>
                <h3 className="text-xl font-black tracking-tight">
                    ESTADÍSTICAS POR LUGAR
                </h3>
            </div>

            <div className="space-y-4">
                {stats.map((place) => (
                    <div
                        key={place.placeName}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h4 className="font-bold text-lg mb-1">{place.placeName}</h4>
                                <div className="text-xs text-gray-400">
                                    Último partido: {new Date(place.lastPlayed).toLocaleDateString('es-ES')}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-black">
                                    {place.totalMatches}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Partido{place.totalMatches !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 bg-green-500/10 rounded-xl">
                                <div className="text-lg font-black text-green-500">
                                    {place.wins}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Ganados
                                </div>
                            </div>
                            <div className="text-center p-2 bg-red-500/10 rounded-xl">
                                <div className="text-lg font-black text-red-500">
                                    {place.losses}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Perdidos
                                </div>
                            </div>
                            <div className="text-center p-2 bg-blue-500/10 rounded-xl">
                                <div className="text-lg font-black text-blue-500">
                                    {place.ties}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Empatados
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-400 mb-1">Marcador total</div>
                                <div className="text-lg font-bold">
                                    <span className="text-green-500">{place.goalsFor}</span>
                                    <span className="mx-2 text-gray-500">-</span>
                                    <span className="text-red-500">{place.goalsAgainst}</span>
                                    <span className="ml-2 text-sm">
                                        ({place.goalsDifference > 0 ? '+' : ''}{place.goalsDifference})
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-gray-400 mb-1">% Victorias</div>
                                <div className={`text-xl font-bold ${place.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                    {place.winRate.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button
                    onClick={loadStats}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                    Actualizar estadísticas
                </button>
            </div>
        </div>
    );
};