export type CourtType = 'FIVE' | 'SEVEN' | 'ELEVEN' | 'OTHER';
export type Category = 'FRIENDS' | 'FRIENDLY' | 'TOURNAMENT';
export type MatchResult = 'WON' | 'LOST' | 'TIED';
export type Performance = 'VERY_BAD' | 'BAD' | 'NEUTRAL' | 'GOOD' | 'VERY_GOOD'

export interface Match {
    id: string;
    userId: string;
    date: Date;
    courtType: CourtType;
    category: Category;
    result: MatchResult;
    goalsFor: number;
    goalsAgainst: number;
    performance: Performance;
    notes?: string;
    placeId: string;
    placeName: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserStats {
    userId: string;
    totalMatches: number;
    totalWins: number;
    totalLosses: number;
    totalTies: number;
    totalGoalsFor: number;
    totalGoalsAgainst: number;
}