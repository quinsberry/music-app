import { SongsTable } from '@/features/songs-table/SongsTable';
import { Card } from '@/shared/ui/card';

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-5xl p-6">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 text-xl font-bold">
                        <h1>Music Web App</h1>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mb-8">
                    <SongsTable />
                </div>
            </Card>
        </div>
    );
}
