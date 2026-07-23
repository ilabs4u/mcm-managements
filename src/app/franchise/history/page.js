'use client';

import React, { useState, useEffect } from 'react';
import MonthlyCalendar from '@/components/owner/MonthlyCalendar';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { formatMonth, toMonthString } from '@/lib/formatters';
import { API } from '@/lib/constants';

export default function FranchiseHistoryPage() {
  const [currentMonth, setCurrentMonth] = useState(toMonthString());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API.FRANCHISE.HISTORY}?month=${currentMonth}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          // Transform logs into calendar day format
          const days = res.data.logs.map((log) => {
            const productTotals = {};
            (log.daily_log_items || []).forEach((item) => {
              const name = item.products?.name || 'Unknown';
              if (!productTotals[name]) productTotals[name] = { name, total_kg: 0, total_packets: 0 };
              productTotals[name].total_kg += item.quantity_kg;
              productTotals[name].total_packets += item.quantity_packets;
            });
            return {
              date: log.log_date,
              is_open: log.is_open,
              products: Object.values(productTotals),
            };
          });
          setData(days);
        }
      })
      .finally(() => setLoading(false));
  }, [currentMonth]);

  const changeMonth = (delta) => {
    const [y, m] = currentMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setCurrentMonth(toMonthString(d));
  };

  return (
    <div className="animate-slide-up" style={{ paddingBottom: '5rem' }}>
      <PageHeader title="History" subtitle="Your monthly production log" />

      <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Month navigator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            id="prev-month-history"
            onClick={() => changeMonth(-1)}
            style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
          >◀</button>
          <span style={{ fontWeight: '600', fontSize: '1rem' }}>
            {formatMonth(new Date(currentMonth + '-01'))}
          </span>
          <button
            id="next-month-history"
            onClick={() => changeMonth(1)}
            style={{ background: 'none', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
          >▶</button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner size="lg" />
          </div>
        ) : (
          <MonthlyCalendar days={data || []} month={currentMonth} />
        )}
      </div>
    </div>
  );
}

