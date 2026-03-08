import React from 'react';

type TabKey = 'details' | 'dealer' | 'schedule';
type AreaUnit = 'sqft' | 'sqm' | 'acre';

interface BuyerPropertyTabsNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  areaUnit: AreaUnit;
  isUnitDropdownOpen: boolean;
  unitDropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggleUnitDropdown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectAreaUnit: (unit: AreaUnit, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const BuyerPropertyTabsNav: React.FC<BuyerPropertyTabsNavProps> = ({
  activeTab,
  onTabChange,
  areaUnit,
  isUnitDropdownOpen,
  unitDropdownRef,
  onToggleUnitDropdown,
  onSelectAreaUnit,
}) => {
  return (
    <nav className="buyer-property-tabs-navbar" aria-label="Property detail tabs">
      <div className="buyer-property-tabs">
        <button
          type="button"
          className={`buyer-property-tab-btn ${activeTab === 'details' ? 'is-active' : ''}`}
          onClick={() => onTabChange('details')}
        >
          Details
        </button>
        <button
          type="button"
          className={`buyer-property-tab-btn ${activeTab === 'dealer' ? 'is-active' : ''}`}
          onClick={() => onTabChange('dealer')}
        >
          Dealer
        </button>
        <button
          type="button"
          className={`buyer-property-tab-btn ${activeTab === 'schedule' ? 'is-active' : ''}`}
          onClick={() => onTabChange('schedule')}
        >
          Schedule Site Visit
        </button>
      </div>
      <div className={`dropdown buyer-unit-dropdown ${isUnitDropdownOpen ? 'show' : ''}`} ref={unitDropdownRef}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded={isUnitDropdownOpen}
          onClick={onToggleUnitDropdown}
        >
          Area Unit: {areaUnit === 'sqft' ? 'Sq ft' : areaUnit === 'sqm' ? 'Sq m' : 'Acre'}
        </button>
        <div className={`dropdown-menu ${isUnitDropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#" onClick={(event) => onSelectAreaUnit('sqft', event)}>
            Sq ft
          </a>
          <a className="dropdown-item" href="#" onClick={(event) => onSelectAreaUnit('sqm', event)}>
            Sq m
          </a>
          <a className="dropdown-item" href="#" onClick={(event) => onSelectAreaUnit('acre', event)}>
            Acre
          </a>
        </div>
      </div>
    </nav>
  );
};
