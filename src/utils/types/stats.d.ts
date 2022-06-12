
type StatPerInterval = {
    date: string,
    count: number
}[]

type StatsResolverType = { 
	name: string, 
	data: (statsHelper: import('@helpers').Stats, days: number) => Promise<StatPerInterval> 
}[]