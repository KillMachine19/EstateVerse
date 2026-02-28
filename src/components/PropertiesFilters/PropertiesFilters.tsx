import React from 'react';
import './PropertiesFilters.css';

interface PropertiesFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  minBudget: number;
  maxBudget: number;
  minBudgetPercent: number;
  maxBudgetPercent: number;
  budgetMin: number;
  budgetMax: number;
  onMinBudgetChange: (value: number) => void;
  onMaxBudgetChange: (value: number) => void;
  selectedTechParkArea: string;
  techParkAreas: string[];
  onTechParkAreaChange: (value: string) => void;
  includeRentLease: boolean;
  includeBuying: boolean;
  onIncludeRentLeaseChange: (checked: boolean) => void;
  onIncludeBuyingChange: (checked: boolean) => void;
  formatBudget: (value: number) => string;
  selectedAmenities: string[];
  amenitySuggestions: string[];
  onToggleAmenity: (amenity: string) => void;
}

export const PropertiesFilters: React.FC<PropertiesFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  minBudget,
  maxBudget,
  minBudgetPercent,
  maxBudgetPercent,
  budgetMin,
  budgetMax,
  onMinBudgetChange,
  onMaxBudgetChange,
  selectedTechParkArea,
  techParkAreas,
  onTechParkAreaChange,
  includeRentLease,
  includeBuying,
  onIncludeRentLeaseChange,
  onIncludeBuyingChange,
  formatBudget,
  selectedAmenities,
  amenitySuggestions,
  onToggleAmenity,
}) => (
  <section className="properties-filters" aria-label="Search and filters">
    <label className="filter-group filter-search-group">
      <span className="filter-label">Search</span>
      <input
        type="search"
        className="filter-input"
        placeholder="Search by title, amenities, or area"
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
      />
    </label>

    <div className="filter-group">
      <span className="filter-label">Budget ({formatBudget(minBudget)} - {formatBudget(maxBudget)})</span>
      <div
        className="budget-slider-group"
        style={
          {
            '--min-budget-percent': `${minBudgetPercent}%`,
            '--max-budget-percent': `${maxBudgetPercent}%`,
          } as React.CSSProperties
        }
      >
        <div className="budget-slider-track" aria-hidden="true" />
        <input
          type="range"
          min={budgetMin}
          max={budgetMax}
          step={500_000}
          value={minBudget}
          onChange={(event) => onMinBudgetChange(Number(event.target.value))}
          aria-label="Minimum budget"
        />
        <input
          type="range"
          min={budgetMin}
          max={budgetMax}
          step={500_000}
          value={maxBudget}
          onChange={(event) => onMaxBudgetChange(Number(event.target.value))}
          aria-label="Maximum budget"
        />
      </div>
    </div>

    <label className="filter-group">
      <span className="filter-label">Area</span>
      <select
        className="filter-input"
        value={selectedTechParkArea}
        onChange={(event) => onTechParkAreaChange(event.target.value)}
      >
        {techParkAreas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </label>

    <div className="filter-group filter-checkbox-group">
      <span className="filter-label">Listing Type</span>
      <label className="checkbox-option">
        <input
          type="checkbox"
          checked={includeRentLease}
          onChange={(event) => onIncludeRentLeaseChange(event.target.checked)}
        />
        <span>Renting/Leasing</span>
      </label>
      <label className="checkbox-option">
        <input
          type="checkbox"
          checked={includeBuying}
          onChange={(event) => onIncludeBuyingChange(event.target.checked)}
        />
        <span>Buying</span>
      </label>
    </div>

    <div className="filter-group filter-amenities-group">
      <span className="filter-label">Amenities</span>
      <div className="filter-amenities-chips">
        {amenitySuggestions.map((amenity) => {
          const isActive = selectedAmenities.includes(amenity);
          return (
            <button
              key={amenity}
              type="button"
              className={`filter-amenity-chip ${isActive ? 'is-active' : ''}`}
              onClick={() => onToggleAmenity(amenity)}
              aria-pressed={isActive}
            >
              {amenity}
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
