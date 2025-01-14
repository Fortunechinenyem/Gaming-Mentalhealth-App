import JournalEntry from "@/app/components/JournalEntry";

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <JournalEntry />
      </div>
    </div>
  );
}
