import React from 'react';
import { Button } from './Button';
import './ui.css';

/**
 * Empty state component — shown when there is no data to display.
 * icon: emoji or icon character
 * title: main message
 * description: secondary message
 * action: optional { label, onClick } for a CTA button
 */
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && (
        <Button
          variant="secondary"
          className="empty-state__action"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
