import MoodTracker from "@/app/components/MoodTracker";

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <MoodTracker />
      </div>
    </div>
  );
}
