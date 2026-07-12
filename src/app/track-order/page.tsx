import { Suspense } from "react";
import TrackOrderContent from "./TrackOrderContent";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-white/50">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
