import { useState, useRef, useEffect, useCallback } from 'react';
import { searchCities, getUtcOffset } from '../utils/geocoding';
import { computeNatalChart, astroSeekUrl } from '../utils/ephemeris';
import { SIGNS } from '../utils/astroConstants';

function lonToSign(lon) {
  const signIdx = Math.floor(lon / 30) % 12;
  const deg = Math.floor(lon % 30);
  const min = Math.round((lon % 30 - deg) * 60);
  return `${deg}° ${SIGNS[signIdx]?.glyph || ''} ${SIGNS[signIdx]?.name || ''} ${min}'`;
}

const POPULAR_CITIES = ['Manila', 'New York', 'London', 'Tokyo', 'Los Angeles', 'Sydney'];

export default function BirthDataInput({ onNatalChartChange }) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [cityQuery, setCityQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [computed, setComputed] = useState(null);
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState(null);
  const [verifyUrl, setVerifyUrl] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // City search
  useEffect(() => {
    if (cityQuery.length >= 2 && !selectedCity) {
      const results = searchCities(cityQuery);
      setCityResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setCityResults([]);
      setShowDropdown(false);
    }
  }, [cityQuery, selectedCity]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function selectCity(city) {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  }

  function clearCity() {
    setSelectedCity(null);
    setCityQuery('');
    setCityResults([]);
  }

  const handleCompute = useCallback(async () => {
    if (!birthDate || !selectedCity) {
      setError('Please enter a birth date and select a city.');
      return;
    }

    setError(null);
    setComputing(true);

    try {
      // Build a Date object for the birth date to get accurate UTC offset
      const [y, m, d] = birthDate.split('-').map(Number);
      const [h, min] = birthTime.split(':').map(Number);
      const birthDateObj = new Date(y, m - 1, d, h, min);
      const utcOffset = getUtcOffset(selectedCity.tz, birthDateObj);

      const result = await computeNatalChart(birthDate, birthTime, utcOffset);

      // Build Astro-Seek verification URL
      const url = astroSeekUrl(
        birthDate, birthTime,
        selectedCity.lat, selectedCity.lon,
        selectedCity.name
      );

      setComputed(result);
      setVerifyUrl(url);
    } catch (err) {
      setError(`Computation error: ${err.message}`);
    } finally {
      setComputing(false);
    }
  }, [birthDate, birthTime, selectedCity]);

  function handleApply() {
    if (!computed) return;
    const name = `${selectedCity.name} — ${birthDate} ${birthTime}`;
    onNatalChartChange({ name, planets: computed.planets });
  }

  const inputStyle = {
    background: 'var(--bg-input)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="space-y-4">
      {/* Birth Date */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          Birth Date
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2.5 border rounded text-sm font-mono focus:outline-none"
          style={inputStyle}
          min="1900-01-01"
          max="2030-12-31"
        />
      </div>

      {/* Birth Time */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          Birth Time (24h)
        </label>
        <input
          type="time"
          value={birthTime}
          onChange={(e) => setBirthTime(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2.5 border rounded text-sm font-mono focus:outline-none"
          style={inputStyle}
        />
        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
          If unknown, noon (12:00) is a common default
        </p>
      </div>

      {/* City Search */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          Birth City
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              if (selectedCity) setSelectedCity(null);
            }}
            onFocus={() => {
              if (cityResults.length > 0 && !selectedCity) setShowDropdown(true);
            }}
            placeholder="Search city..."
            className="w-full sm:max-w-xs px-3 py-2.5 border rounded text-sm font-mono focus:outline-none"
            style={inputStyle}
            autoComplete="off"
          />
          {selectedCity && (
            <button
              onClick={clearCity}
              className="text-xs px-2 py-1 rounded border cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div
            className="absolute z-50 mt-1 w-full max-w-xs rounded-lg border shadow-lg overflow-hidden"
            style={{
              background: 'var(--bg-glass, rgba(30,30,40,0.95))',
              borderColor: 'var(--border-color)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {cityResults.map((city, i) => (
              <button
                key={`${city.name}-${city.country}-${i}`}
                onClick={() => selectCity(city)}
                className="w-full text-left px-3 py-2 text-sm font-mono hover:bg-white/10 transition-colors cursor-pointer"
                style={{ color: 'var(--text-primary)' }}
              >
                {city.name}, {city.country}
                <span className="text-[10px] ml-2 opacity-50">{city.tz}</span>
              </button>
            ))}
          </div>
        )}

        {/* Popular cities */}
        {!selectedCity && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {POPULAR_CITIES.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setCityQuery(name);
                  const results = searchCities(name);
                  if (results.length > 0) selectCity(results[0]);
                }}
                className="text-[11px] px-3 py-1.5 rounded-full border cursor-pointer transition-colors hover:border-[var(--accent-color)]"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compute Button */}
      <button
        onClick={handleCompute}
        disabled={computing || !birthDate || !selectedCity}
        className="px-5 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: 'var(--accent-color, #a78bfa)',
          color: '#fff',
        }}
      >
        {computing ? 'Computing...' : 'Calculate Chart'}
      </button>

      {error && (
        <div
          className="px-3 py-2 rounded text-xs font-mono"
          style={{
            background: 'rgba(255,107,107,0.1)',
            color: '#ff6b6b',
            border: '1px solid rgba(255,107,107,0.3)',
          }}
        >
          ✗ {error}
        </div>
      )}

      {/* Results Preview */}
      {computed && (
        <div className="space-y-3">
          <div
            className="rounded-lg border p-3"
            style={{
              background: 'rgba(74,222,128,0.05)',
              borderColor: 'rgba(74,222,128,0.2)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono" style={{ color: '#4ade80' }}>✓ Chart Computed</span>
              {verifyUrl && (
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono underline opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--accent-color, #a78bfa)' }}
                >
                  Verify on Astro-Seek →
                </a>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
              {Object.entries(computed.planets)
                .filter(([name]) => name !== 'South Node')
                .map(([name, lon]) => (
                  <div key={name} className="flex items-center gap-1.5 text-xs font-mono">
                    <span style={{ color: 'var(--text-muted)' }}>{name}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{lonToSign(lon)}</span>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer"
            style={{
              background: '#4ade80',
              color: '#000',
            }}
          >
            Use This Chart for Transits
          </button>
        </div>
      )}
    </div>
  );
}
