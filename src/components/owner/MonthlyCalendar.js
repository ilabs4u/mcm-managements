'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatQuantity } from '@/lib/formatters';
import './owner.css';

/**
 * MonthlyCalendar — grid of days for a month, each cell showing packet totals.
 * Clicking a day opens DayDetailModal with individual entry breakdown.
 * Used in: owner/reports, owner/franchises/[id], franchise/history
 */
export default function MonthlyCalendar({ days, month }) {
  const [selectedDay, setSelectedDay] = useState(null);

  if (!days || days.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No data for this month
      </div>
    );
  }

  // Build a map of date → day data for quick lookup
  const dayMap = {};
  days.forEach((d) => { dayMap[d.date] = d; });

  // Build full calendar grid (Mon–Sun)
  const [year, monthNum] = month.split('-').map(Number);
  const firstDay = new Date(year, monthNum - 1, 1);
  const lastDay = new Date(year, monthNum, 0);
  const daysInMonth = lastDay.getDate();

  // Start grid on Monday (1) — adjust Sunday (0) to 7
  let startDow = firstDay.getDay();
  if (startDow === 0) startDow = 7;
  const paddingBefore = startDow - 1;

  const cells = [];
  for (let i = 0; i < paddingBefore; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${String(d).padStart(2, '0')}`;
    cells.push({ date: dateStr, day: d, data: dayMap[dateStr] || null });
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(44px, 1fr))',
          gap: '4px',
          minWidth: '300px',
        }}>
          {/* Day headers */}
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((h) => (
            <div key={h} style={{
              textAlign: 'center',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              fontWeight: '600',
              padding: '0.25rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {h}
            </div>
          ))}

          {/* Calendar cells */}
          {cells.map((cell, idx) => {
            if (!cell) return <div key={`pad-${idx}`} />;

            const { date, day, data } = cell;
            const isToday = date === new Date().toISOString().split('T')[0];
            const hasData = data && data.products && data.products.length > 0;
            const isClosed = data && !data.is_open;

            return (
              <div
                key={date}
                id={`cal-day-${date}`}
                onClick={() => data && setSelectedDay(data)}
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '0.375rem 0.25rem',
                  cursor: data ? 'pointer' : 'default',
                  background: isToday
                    ? 'rgba(249, 115, 22, 0.12)'
                    : hasData
                      ? 'var(--bg-surface-elevated)'
                      : 'var(--bg-surface)',
                  border: isToday
                    ? '1px solid rgba(249, 115, 22, 0.5)'
                    : '1px solid var(--border-subtle)',
                  opacity: isClosed ? 0.5 : 1,
                  transition: 'all var(--transition-fast)',
                  minHeight: '52px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                }}
                onMouseEnter={(e) => { if (data) e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
                onMouseLeave={(e) => { if (!isToday) e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: isToday ? '700' : '500',
                  color: isToday ? 'var(--brand-primary)' : 'var(--text-secondary)',
                }}>
                  {day}
                </span>

                {isClosed && (
                  <span style={{ fontSize: '0.5625rem', color: 'var(--status-error)', fontWeight: '600' }}>
                    CLOSED
                  </span>
                )}

                {hasData && !isClosed && data.products.slice(0, 2).map((p) => (
                  <span key={p.name} style={{
                    fontSize: '0.5625rem',
                    color: 'var(--brand-primary)',
                    fontWeight: '600',
                    lineHeight: 1.2,
                  }}>
                    {formatQuantity(p.total_packets)}p
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day detail modal */}
      <Modal
        isOpen={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? formatDate(selectedDay.date) : ''}
      >
        {selectedDay && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Badge variant={selectedDay.is_open ? 'open' : 'closed'}>
                {selectedDay.is_open ? 'Open' : 'Closed'}
              </Badge>
            </div>

            {selectedDay.products && selectedDay.products.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {selectedDay.products.map((p) => (
                  <div key={p.name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <span style={{ fontWeight: '500' }}>{p.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700' }}>{p.total_kg} kg</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatQuantity(p.total_packets)} packets
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No production logged this day.</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
