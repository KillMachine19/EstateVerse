import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiBell, FiCalendar, FiCheckCircle, FiMessageCircle, FiStar, FiUsers } from 'react-icons/fi';
import { SellerWorkspace } from '../../components/SellerComponents';
import { getListedProperties, getBuyersWhoShortlistedPropertyById, type ListingRecord, type BuyerRecord } from '../../services/controllers';
import { listCalls } from '../../services/controllers/callsService';
import { resolveListingId } from '../../utils/listings';
import './SellerNotificationsPage.css';

type NotificationType = 'all' | 'shortlist' | 'connect' | 'insight' | 'system';
type NotificationPriority = 'high' | 'medium' | 'low';

interface CallRecord {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  dateMonth?: string;
  dateDay?: string;
  time?: string;
  timeHour?: string;
  timeMinute?: string;
  timePeriod?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SellerNotification {
  id: string;
  type: Exclude<NotificationType, 'all'>;
  priority: NotificationPriority;
  title: string;
  description: string;
  timestamp: number;
  relativeTime: string;
  ctaLabel?: string;
  ctaTo?: string;
}

const resolveListingName = (listing: ListingRecord): string => listing.projectName?.trim() || 'Untitled Property';
const resolveBuyerName = (buyer: BuyerRecord): string =>
  buyer.name?.trim() || buyer.username?.trim() || buyer.email?.trim() || 'A buyer';

const toTimestamp = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseCallScheduledTimestamp = (call: CallRecord): number | null => {
  const month = Number.parseInt(call.dateMonth ?? '', 10);
  const day = Number.parseInt(call.dateDay ?? '', 10);
  if (!Number.isFinite(month) || !Number.isFinite(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const hourRaw = Number.parseInt(call.timeHour ?? '', 10);
  const minuteRaw = Number.parseInt(call.timeMinute ?? '', 10);
  const period = (call.timePeriod ?? '').toUpperCase();

  let hour = Number.isFinite(hourRaw) ? hourRaw : 9;
  const minute = Number.isFinite(minuteRaw) ? minuteRaw : 0;
  if (period === 'PM' && hour < 12) {
    hour += 12;
  }
  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const scheduled = new Date(currentYear, month - 1, day, hour, minute, 0, 0);
  return Number.isFinite(scheduled.getTime()) ? scheduled.getTime() : null;
};

const formatRelativeTime = (timestamp: number): string => {
  const diffMs = timestamp - Date.now();
  const absMs = Math.abs(diffMs);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (absMs < minuteMs) {
    return 'just now';
  }
  if (absMs < hourMs) {
    return rtf.format(Math.round(diffMs / minuteMs), 'minute');
  }
  if (absMs < dayMs) {
    return rtf.format(Math.round(diffMs / hourMs), 'hour');
  }
  return rtf.format(Math.round(diffMs / dayMs), 'day');
};

const buildSystemInsights = (
  listings: ListingRecord[],
  shortlistCounts: Record<string, number>
): SellerNotification[] => {
  const notifications: SellerNotification[] = [];
  const now = Date.now();

  if (listings.length === 0) {
    notifications.push({
      id: 'system-no-listings',
      type: 'system',
      priority: 'high',
      title: 'No active listings yet',
      description: 'Publish your first property to start receiving buyer interest and shortlist activity.',
      timestamp: now,
      relativeTime: 'now',
      ctaLabel: 'Add Property',
      ctaTo: '/seller/add-property',
    });
    return notifications;
  }

  const ranked = listings
    .map((listing) => {
      const id = resolveListingId(listing);
      return { listing, id, count: id ? shortlistCounts[id] ?? 0 : 0 };
    })
    .filter((item) => item.id);

  const zeroShortlistListings = ranked.filter((item) => item.count === 0).slice(0, 2);
  zeroShortlistListings.forEach((item, index) => {
    notifications.push({
      id: `insight-no-shortlist-${item.id}`,
      type: 'insight',
      priority: 'medium',
      title: `${resolveListingName(item.listing)} has no shortlists yet`,
      description: 'Try updating cover image, pricing, or amenities to improve visibility.',
      timestamp: now - (index + 1) * 60 * 1000,
      relativeTime: formatRelativeTime(now - (index + 1) * 60 * 1000),
      ctaLabel: 'Edit Listing',
      ctaTo: `/seller/listings/${item.id}`,
    });
  });

  const topListing = ranked.reduce<{ listing: ListingRecord; id: string; count: number } | null>((acc, curr) => {
    if (!acc || curr.count > acc.count) {
      return curr;
    }
    return acc;
  }, null);

  if (topListing && topListing.count > 0) {
    notifications.push({
      id: `insight-top-listing-${topListing.id}`,
      type: 'insight',
      priority: 'low',
      title: `${resolveListingName(topListing.listing)} is your top performer`,
      description: `${topListing.count} buyer${topListing.count > 1 ? 's have' : ' has'} shortlisted this property.`,
      timestamp: now - 5 * 60 * 1000,
      relativeTime: formatRelativeTime(now - 5 * 60 * 1000),
      ctaLabel: 'View Listing',
      ctaTo: `/seller/listings/${topListing.id}`,
    });
  }

  const imageOrAmenityGaps = ranked
    .filter((item) => (item.listing.imageIds?.length ?? 0) < 3 || (item.listing.amenities?.length ?? 0) < 3)
    .slice(0, 2);

  imageOrAmenityGaps.forEach((item, index) => {
    notifications.push({
      id: `insight-quality-${item.id}`,
      type: 'system',
      priority: 'low',
      title: `${resolveListingName(item.listing)} can be improved`,
      description: 'Listings with richer galleries and amenities usually convert better.',
      timestamp: now - (index + 10) * 60 * 1000,
      relativeTime: formatRelativeTime(now - (index + 10) * 60 * 1000),
      ctaLabel: 'Improve Listing',
      ctaTo: `/seller/listings/${item.id}`,
    });
  });

  return notifications;
};

export const SellerNotificationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState<NotificationType>('all');
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError('');

        const [listedProperties, callsRaw] = await Promise.all([
          getListedProperties(),
          listCalls().catch(() => [] as CallRecord[]),
        ]);

        const listings = listedProperties ?? [];
        const callsArray: CallRecord[] = Array.isArray(callsRaw)
          ? callsRaw
          : Array.isArray((callsRaw as { content?: CallRecord[] })?.content)
            ? (callsRaw as { content: CallRecord[] }).content
            : [];

        const shortlistResponses = await Promise.all(
          listings.map(async (listing) => {
            const propertyId = resolveListingId(listing);
            if (!propertyId) {
              return { propertyId: '', listing, buyers: [] as BuyerRecord[] };
            }
            try {
              const buyers = await getBuyersWhoShortlistedPropertyById(propertyId);
              return { propertyId, listing, buyers: buyers ?? [] };
            } catch {
              return { propertyId, listing, buyers: [] as BuyerRecord[] };
            }
          })
        );

        const shortlistCounts: Record<string, number> = {};
        const shortlistNotifications: SellerNotification[] = shortlistResponses.flatMap((entry, idx) => {
          if (!entry.propertyId) {
            return [];
          }
          shortlistCounts[entry.propertyId] = entry.buyers.length;
          return entry.buyers.map((buyer, buyerIdx) => {
            const buyerTimestamp =
              toTimestamp((buyer as BuyerRecord & { shortlistedAt?: string; createdAt?: string }).shortlistedAt) ??
              toTimestamp((buyer as BuyerRecord & { createdAt?: string }).createdAt) ??
              Date.now() - (idx + buyerIdx + 1) * 90 * 1000;
            return {
              id: `shortlist-${entry.propertyId}-${buyer.id ?? buyer.email ?? buyerIdx}`,
              type: 'shortlist' as const,
              priority: 'high' as const,
              title: `${resolveBuyerName(buyer)} shortlisted ${resolveListingName(entry.listing)}`,
              description: 'A buyer added your listing to their shortlist.',
              timestamp: buyerTimestamp,
              relativeTime: formatRelativeTime(buyerTimestamp),
              ctaLabel: 'Open Listing',
              ctaTo: `/seller/listings/${entry.propertyId}`,
            };
          });
        });

        const connectNotifications: SellerNotification[] = callsArray.map((call, index) => {
          const scheduledTs = parseCallScheduledTimestamp(call);
          const createdTs = toTimestamp(call.createdAt) ?? toTimestamp(call.updatedAt);
          const timestamp = createdTs ?? scheduledTs ?? Date.now() - (index + 1) * 120 * 1000;
          const requester = call.name?.trim() || call.email?.trim() || 'A buyer';
          const timeLabel = call.time ? ` at ${call.time}` : '';
          const dayLabel = call.dateDay && call.dateMonth ? ` on ${call.dateDay}/${call.dateMonth}` : '';
          const summary = call.message?.trim() ? call.message.trim() : `Requested a connection${dayLabel}${timeLabel}.`;

          return {
            id: `connect-${call.id ?? call.email ?? index}`,
            type: 'connect',
            priority: 'high',
            title: `${requester} requested to connect`,
            description: summary,
            timestamp,
            relativeTime: formatRelativeTime(timestamp),
            ctaLabel: 'View Leads',
            ctaTo: '/seller/leads',
          };
        });

        const insightNotifications = buildSystemInsights(listings, shortlistCounts);

        const merged = [...shortlistNotifications, ...connectNotifications, ...insightNotifications].sort(
          (a, b) => b.timestamp - a.timestamp
        );

        setNotifications(merged);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            typeof err.response?.data?.message === 'string'
              ? err.response.data.message
              : 'Unable to load notifications right now.'
          );
        } else {
          setError('Unable to load notifications right now.');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadNotifications();
  }, []);

  const typeCounts = useMemo(() => {
    return notifications.reduce(
      (acc, item) => {
        acc[item.type] += 1;
        return acc;
      },
      {
        shortlist: 0,
        connect: 0,
        insight: 0,
        system: 0,
      }
    );
  }, [notifications]);

  const filteredNotifications = useMemo(
    () => (activeType === 'all' ? notifications : notifications.filter((item) => item.type === activeType)),
    [activeType, notifications]
  );

  const renderIcon = (type: SellerNotification['type']) => {
    if (type === 'shortlist') {
      return <FiUsers aria-hidden="true" />;
    }
    if (type === 'connect') {
      return <FiMessageCircle aria-hidden="true" />;
    }
    if (type === 'insight') {
      return <FiStar aria-hidden="true" />;
    }
    return <FiAlertCircle aria-hidden="true" />;
  };

  const filters: Array<{ key: NotificationType; label: string; count: number }> = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'shortlist', label: 'Shortlisted', count: typeCounts.shortlist },
    { key: 'connect', label: 'Connect', count: typeCounts.connect },
    { key: 'insight', label: 'Insights', count: typeCounts.insight },
    { key: 'system', label: 'System', count: typeCounts.system },
  ];

  return (
    <SellerWorkspace
      title="Notifications"
      description="Track buyer shortlist activity, connection requests, and listing performance alerts in one place."
      icon={<FiBell aria-hidden="true" />}
      wide
    >
      <section className="seller-notifications" aria-live="polite">
        <div className="seller-notifications-toolbar">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`seller-notifications-filter ${activeType === filter.key ? 'is-active' : ''}`}
              onClick={() => setActiveType(filter.key)}
            >
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </button>
          ))}
        </div>

        {loading ? <p className="seller-notifications-state">Loading notifications...</p> : null}
        {error ? <p className="seller-notifications-state is-error">{error}</p> : null}

        {!loading && !error && filteredNotifications.length === 0 ? (
          <div className="seller-notifications-empty">
            <FiCheckCircle aria-hidden="true" />
            <p>No notifications in this category right now.</p>
          </div>
        ) : null}

        {!loading && !error && filteredNotifications.length > 0 ? (
          <div className="seller-notifications-list">
            {filteredNotifications.map((notification) => (
              <article
                key={notification.id}
                className={`seller-notification-card is-${notification.priority}`}
                data-type={notification.type}
              >
                <div className="seller-notification-icon">{renderIcon(notification.type)}</div>
                <div className="seller-notification-content">
                  <header className="seller-notification-header">
                    <h2>{notification.title}</h2>
                    <span>{notification.relativeTime}</span>
                  </header>
                  <p>{notification.description}</p>
                  <footer className="seller-notification-footer">
                    <span className="seller-notification-tag">
                      <FiCalendar aria-hidden="true" />
                      {notification.type}
                    </span>
                    {notification.ctaTo && notification.ctaLabel ? (
                      <Link className="seller-notification-link" to={notification.ctaTo}>
                        {notification.ctaLabel}
                      </Link>
                    ) : null}
                  </footer>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </SellerWorkspace>
  );
};
