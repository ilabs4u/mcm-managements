'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import MonthlyCalendar from '@/components/owner/MonthlyCalendar';
import { Spinner } from '@/components/ui/Spinner';
import { formatIngredient, formatMonth, toMonthString } from '@/lib/formatters';
import { API } from '@/lib/constants';

export default function ReportsPage({ franchises }) {
  const [selectedFranchiseId, setSelectedFranchiseId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(toMonthString());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch report data when franchise or month changes
  useEffect(() => {
    if (!selectedFranchiseId) return;
    setLoading(true);
    setReportData(null);
    fetch(`${API.OWNER.REPORTS}?franchise_id=${selectedFranchiseId}&month=${currentMonth}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setReportData(data.data); })
      .finally(() => setLoading(false));
  }, [selectedFranchiseId, currentMonth]);

  const changeMonth = (delta) => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCurrentMonth(toMonthString(d));
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '5rem' }}>
      <PageHeader title="Reports" subtitle="Monthly production history" backHref="/owner" />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Franchise selector */}
        <div className="input-wrapper">
          <label className="input-label">Select Franchise</label>
          <select
            id="reports-franchise-select"
            className="input-field"
            style={{ appearance: 'none' }}
            value={selectedFranchiseId}
            onChange={(e) => setSelectedFranchiseId(e.target.value)}
          >
            <option value="">— Choose a franchise —</option>
            {(franchises || []).map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        {/* Month navigator */}
        {selectedFranchiseId && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              id="prev-month"
              onClick={() => changeMonth(-1)}
              style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              ◀
            </button>
            <span style={{ fontWeight: '600', fontSize: '1rem' }}>
              {formatMonth(new Date(currentMonth + '-01'))}
            </span>
            <button
              id="next-month"
              onClick={() => changeMonth(1)}
              style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              ▶
            </button>
          </div>
        )}

        {/* Calendar */}
        {selectedFranchiseId && (
          loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Spinner size="lg" />
            </div>
          ) : reportData ? (
            <>
              <MonthlyCalendar days={reportData.days} month={currentMonth} />

              {/* Month summary */}
              {reportData.monthSummary && (
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <span>Days Open: <strong style={{ color: 'var(--status-success)' }}>{reportData.monthSummary.days_open}</strong></span>
                    <span>Days Closed: <strong style={{ color: 'var(--status-error)' }}>{reportData.monthSummary.days_closed}</strong></span>
                  </div>
                  {reportData.monthSummary.products?.map((p) => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                      <strong>{p.total_kg} kg ({p.total_packets.toFixed(1)} pkt)</strong>
                    </div>
                  ))}
                  {reportData.monthSummary.materials?.map((m) => (
                    <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--brand-primary)' }}>{m.name}</span>
                      <span>{formatIngredient(m.total, m.unit)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null
        )}
      </div>
    </div>
  );
}
