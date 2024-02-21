type StatPerInterval = {
    date: string,
    count: number
}[]

type StatsResolverType = { 
	name: string, 
	data: (statsHelper: import('@services').Stats, days: number) => Promise<StatPerInterval> 
}[]