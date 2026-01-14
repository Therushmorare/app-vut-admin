import React from 'react';
import { COLORS } from '../../utils/helpers';

export default function SearchResults({ count, searchTerm }) {
  return (
    <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: COLORS.bgWhite }}>
      <p className="text-sm text-gray-600">
        Found <span className="font-bold" style={{ color: COLORS.primary }}>{count}</span> result(s) for "{searchTerm}"
      </p>
    </div>
  );
}