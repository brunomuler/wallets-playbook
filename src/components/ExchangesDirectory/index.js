import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import exchangesData from '@site/src/data/exchanges.json';
import styles from './styles.module.css';
// import countryCodeMapping from '@site/src/data/country-code-mapping.json';
let countryCodeMapping = {};

// Fetch the mapping at runtime
fetch('/data/country-code-mapping.json')
  .then(res => res.json())
  .then(data => { countryCodeMapping = data; });

const GEOGRAPHY_VISIBILITY_THRESHOLD = 10;

const Flag = ({ code, country }) => {
    const [error, setError] = useState(false);

    if (error || !code) {
        return null;
    }

    return (
        <img
            src={`/img/flags/${code}.png`}
            alt={`${country} flag`}
            className={styles.flagIcon}
            onError={() => setError(true)}
        />
    );
};


// Add custom styles for react-select to use Docusaurus colors and support dark mode
const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--ifm-background-color)',
        borderColor: state.isFocused ? 'var(--ifm-color-primary)' : 'var(--ifm-color-primary-light)',
        boxShadow: state.isFocused ? '0 0 0 1px var(--ifm-color-primary)' : 'none',
        '&:hover': {
            borderColor: 'var(--ifm-color-primary)',
        },
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--ifm-background-surface-color)',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--ifm-color-primary-lighter)' : state.isFocused ? 'var(--ifm-color-emphasis-200)' : 'var(--ifm-background-color)',
        color: state.isSelected ? 'var(--ifm-color-primary-darkest)' : 'inherit',
        '&:active': {
            backgroundColor: 'var(--ifm-color-primary-light)',
        },
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'var(--ifm-color-primary-lightest)',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: 'var(--ifm-color-primary-darkest)',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: 'var(--ifm-color-primary-darkest)',
        ':hover': {
            backgroundColor: 'var(--ifm-color-primary-light)',
            color: 'var(--ifm-color-primary-darkest)',
        },
    }),
};

const ExchangesDirectory = () => {
    const [selectedGeos, setSelectedGeos] = useState([]);
    const [expandedExchanges, setExpandedExchanges] = useState({}); // { [exchangeId: string]: boolean }

    const toggleExchangeExpansion = (exchangeId) => {
        setExpandedExchanges(prev => ({
            ...prev,
            [exchangeId]: !prev[exchangeId]
        }));
    };

    const formatOptionLabel = ({ value, label, alpha3 }) => {
        const alpha2Code = countryCodeMapping[alpha3];
        return (
            <div className={styles.countryOption}>
                <Flag code={alpha2Code} country={label} />
                <span style={{ marginLeft: '10px' }}>{label}</span>
            </div>
        );
    };

    const geoOptions = useMemo(() => {
        const geos = {};
        exchangesData.forEach(exchange => {
            exchange.geo_rollout.forEach(geo => {
                if (!geos[geo.country]) {
                    geos[geo.country] = {
                        value: geo.country,
                        label: geo.country,
                        alpha3: geo.country_code,
                    };
                }
            });
        });
        return Object.values(geos).sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const filteredExchanges = useMemo(() => {
        if (!selectedGeos || selectedGeos.length === 0) {
            return exchangesData;
        }
        const selectedCountries = selectedGeos.map(s => s.value.toLowerCase());
        return exchangesData.filter(exchange =>
            exchange.geo_rollout.some(geo =>
                selectedCountries.includes(geo.country.toLowerCase())
            )
        );
    }, [selectedGeos]);

    const allGeos = useMemo(() => {
        const geos = new Set();
        exchangesData.forEach(exchange => {
            exchange.geo_rollout.forEach(geo => {
                geos.add(geo.country);
            });
        });
        return Array.from(geos).sort();
    }, []);

    return (
        <div>
            <div className={styles.filter}>
                <label htmlFor="geoFilter">Filter by Geography:</label>
                <Select
                    id="geoFilter"
                    isMulti
                    options={geoOptions}
                    onChange={setSelectedGeos}
                    value={selectedGeos}
                    formatOptionLabel={formatOptionLabel}
                    placeholder="Type to search and select countries..."
                    className={styles.geoSelect}
                    styles={customSelectStyles}
                />
            </div>
            <div className={styles.exchangesList}>
                {filteredExchanges.map(exchange => {
                    const allExchangeOptions = Array.from(new Set(exchange.geo_rollout.flatMap(g => g.ramp_options))).sort();
                    const allPaymentMethods = Array.from(new Set(exchange.geo_rollout.flatMap(g => g.payment_methods.map(p => p.name)))).sort();

                    const geosByCountry = exchange.geo_rollout.reduce((acc, geo) => {
                        const countryName = geo.country;
                        if (!acc[countryName]) {
                            acc[countryName] = {
                                country: countryName,
                                country_code_alpha3: geo.country_code,
                                currencies: new Set(),
                                ramp_options: new Set(),
                                payment_methods: [],
                                payment_method_names: new Set()
                            };
                        }
                        acc[countryName].currencies.add(geo.currency);
                        geo.ramp_options.forEach(opt => acc[countryName].ramp_options.add(opt));
                        geo.payment_methods.forEach(pm => {
                            if (!acc[countryName].payment_method_names.has(pm.name)) {
                                acc[countryName].payment_methods.push(pm);
                                acc[countryName].payment_method_names.add(pm.name);
                            }
                        });
                        return acc;
                    }, {});

                    Object.values(geosByCountry).forEach(geoData => {
                        geoData.currencies = Array.from(geoData.currencies);
                        geoData.ramp_options = Array.from(geoData.ramp_options).sort();
                        geoData.payment_methods.sort((a, b) => a.name.localeCompare(b.name));
                    });

                    const uniqueGeos = Object.values(geosByCountry).sort((a,b) => a.country.localeCompare(b.country));

                    const isExpanded = expandedExchanges[exchange.id];
                    const hasTooManyGeos = uniqueGeos.length > GEOGRAPHY_VISIBILITY_THRESHOLD;
                    const visibleGeos = hasTooManyGeos && !isExpanded
                        ? uniqueGeos.slice(0, GEOGRAPHY_VISIBILITY_THRESHOLD)
                        : uniqueGeos;


                    return (
                        <div key={exchange.id} className={styles.exchangeCard}>
                            <div className={styles.exchangeHeader}>
                                <div className={styles.exchangeIdentity}>
                                    {exchange.logo && <img src={exchange.logo} alt={`${exchange.name} logo`} className={styles.exchangeLogo} />}
                                    <span className={styles.exchangeName}>{exchange.name}</span>
                                </div>
                                {exchange.website && (
                                    <a href={exchange.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                                        Website ↗️
                                    </a>
                                )}
                            </div>
                            <div className={styles.exchangeDetails}>
                                <div className={styles.detailItem}>
                                    <strong>Geographies</strong>
                                    <div className={styles.geographiesList}>
                                        {visibleGeos.map((geo) => {
                                            const alpha2Code = countryCodeMapping[geo.country_code_alpha3];
                                            return (
                                                <span key={`${exchange.id}-${geo.country}`} className={styles.geoTagContainer}>
                                                    <span
                                                        className={styles.geoTag}
                                                    >
                                                        <Flag code={alpha2Code} country={geo.country} />
                                                        {geo.country}
                                                    </span>
                                                    <div className={styles.popover}>
                                                        <div className={styles.popoverHeader}>
                                                            <Flag code={alpha2Code} country={geo.country} />
                                                            <h4>{geo.country}</h4>
                                                        </div>
                                                        <div className={styles.popoverContent}>
                                                            <div className={styles.popoverSection}>
                                                                <p><strong>Currencies:</strong> {geo.currencies.join(', ')}</p>
                                                            </div>
                                                            <div className={styles.popoverSection}>
                                                                <p><strong>Ramp Options:</strong> {geo.ramp_options.join(', ') || 'N/A'}</p>
                                                            </div>
                                                            <div className={styles.popoverSection}>
                                                                <strong>Payment Methods:</strong>
                                                                <ul>
                                                                    {geo.payment_methods.map((pm, pmIndex) => (
                                                                        <li key={pmIndex}>
                                                                            {pm.name}
                                                                            {pm.description && <span> - {pm.description}</span>}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        })}
                                        {hasTooManyGeos && (
                                            <button onClick={() => toggleExchangeExpansion(exchange.id)} className={styles.showMoreButton}>
                                                {isExpanded ? 'Show less' : `Show ${uniqueGeos.length - GEOGRAPHY_VISIBILITY_THRESHOLD} more...`}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>All Exchange Options</strong>
                                    <p>{allExchangeOptions.length > 0 ? allExchangeOptions.join(', ') : 'N/A'}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <strong>All Payment Methods</strong>
                                    <p>{allPaymentMethods.length > 0 ? allPaymentMethods.join(', ') : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExchangesDirectory; 