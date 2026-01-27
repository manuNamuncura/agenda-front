// src/features/matches/PlaceStatsPage.tsx
import { useNavigate } from 'react-router';
import { PlaceStats } from './components/PlaceStats';


const PlaceStatsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 12H5" />
                                <path d="m12 19-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter">
                                ESTADÍSTICAS
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Estadísticas */}
                <PlaceStats />

                {/* Información adicional */}
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-3">📊 ¿Cómo se calculan estas estadísticas?</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li>• Se agrupan todos los partidos por nombre de lugar</li>
                        <li>• Se incluyen variaciones de escritura como lugares diferentes</li>
                        <li>• El porcentaje de victorias se calcula sobre el total de partidos en ese lugar</li>
                        <li>• Para resultados más precisos, usa siempre el mismo nombre para cada lugar</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PlaceStatsPage;