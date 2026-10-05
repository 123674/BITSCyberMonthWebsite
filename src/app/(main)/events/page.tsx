import type { EventFromBDBriefBreif } from "@/func/zodEventSchema";
import EventsGrid from "@/components/home/EventsGrid";
import { briefPublishedEventsDataGET } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EventsArchivePage() {
	let timelineEvents: EventFromBDBriefBreif = [];
	try {
		timelineEvents = await briefPublishedEventsDataGET();
	} catch (error) {
		console.error("Unable to load published events:", error);
	}

	return (
		<main className="events-archive-page">
			<section className="content-section events-section">
				<div className="section-wrap">
					<div className="section-marker"><span>03</span><i />EVENT INTELLIGENCE</div>
					<h1 className="display-heading">MISSIONS<br /><span>IN MOTION.</span></h1>
					<p className="body-copy archive-intro">Published Cyber Month events, technical sessions and community missions.</p>
					<div className="archive-status"><span>LIVE ARCHIVE</span><span>{String(timelineEvents.length).padStart(2, "0")} RECORDS</span><span>ACCESS / PUBLIC</span></div>
					{timelineEvents.length ? (
						<EventsGrid timelineEvents={timelineEvents} />
					) : (
						<p className="body-copy archive-empty">The event schedule will be announced soon.</p>
					)}
				</div>
			</section>
			<style>{`
				.events-archive-page { min-height: 100vh; padding-top: 78px; background: #030508; }
				.events-archive-page .events-section { min-height: calc(100vh - 78px); padding-top: 92px; }
				.events-archive-page .archive-intro { max-width: 470px; margin-top: 22px; }
				.events-archive-page .archive-empty { padding: 52px 0; }
				@media (max-width: 767px) { .events-archive-page { padding-top: 68px; } .events-archive-page .events-section { min-height: calc(100vh - 68px); padding-top: 68px; } }
			`}</style>
		</main>
	);
}
