import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublicEvent, getRsvpStatus } from "@/lib/public-event";
import { googleCalendarUrl, googleMapsUrl, wazeUrl } from "@/lib/calendar";
import { getPublicEventUrl } from "@/lib/site";
import { getTemplate } from "@/templates/registry";
import { renderTemplate } from "@/templates/components";
import { RegistrationForm } from "./RegistrationForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  if (!event) return {};
  return {
    title: { absolute: event.title },
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: event.media_url ? [event.media_url] : undefined,
      url: getPublicEventUrl(event.slug),
      type: "website",
    },
  };
}

export default async function PublicEventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);
  if (!event) notFound();

  const locale = await getLocale();
  const t = await getTranslations("invite.rsvp");
  const url = getPublicEventUrl(event.slug);
  const template = getTemplate(event.template_id);
  const accent = event.primary_color ?? template.palette.accent;

  const status = getRsvpStatus(event);
  const rsvp =
    status === "open" ? (
      <RegistrationForm slug={event.slug} accent={accent} />
    ) : (
      <p className="text-center text-lg" role="status">
        {t(status === "full" ? "closedFull" : status === "event_passed" ? "closedPassed" : "closedDeadline")}
      </p>
    );

  return renderTemplate(event.template_id, {
    event,
    locale,
    links: {
      waze: wazeUrl(event),
      googleMaps: googleMapsUrl(event),
      googleCalendar: googleCalendarUrl(event, url),
      ics: `/e/${event.slug}/calendar.ics`,
    },
    rsvp,
  });
}
