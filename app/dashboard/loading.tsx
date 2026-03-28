import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="space-y-10 pb-20 p-8">
            {/* Header Skeleton */}
            <section className="bg-white border-l-8 border-primary p-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-3 flex-1">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-24 w-72" />
                </div>
            </section>

            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="rounded-none border-zinc-200 shadow-none">
                        <CardContent className="p-6 space-y-4">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-2 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 rounded-none border-zinc-200 shadow-none">
                    <CardHeader className="border-b border-zinc-100">
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>

                <Card className="rounded-none border-zinc-200 shadow-none">
                    <CardHeader>
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex justify-between items-center border-b border-zinc-200 pb-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* News Feed Skeleton */}
            <div className="pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-8 w-64" />
                    <div className="h-px flex-1 bg-zinc-200" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="rounded-none border-zinc-200 shadow-none">
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-6 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
