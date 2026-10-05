import type { EventFromBDBriefBreif } from "@/func/zodEventSchema";
import HomeMainPage from "./HomeMainPage";

export default function HomePage({
  timelineEvents,
}: {
  timelineEvents: EventFromBDBriefBreif;
}) {
  return <HomeMainPage timelineEvents={timelineEvents} />;
}