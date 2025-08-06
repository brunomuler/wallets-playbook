import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import rampsDataRaw from '@site/src/data/ramps.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

// Handle both wrapper format { data: [...] } and direct array format
const rampsData = (rampsDataRaw.data || rampsDataRaw) || [];
// import countryCodeMapping from '@site/src/data/country-code-mapping.json';
let countryCodeMapping = {};

if (typeof window !== 'undefined') {
  fetch('/data/country-code-mapping.json')
    .then(res => res.json())
    .then(data => { countryCodeMapping = data; });
}

const GEOGRAPHY_VISIBILITY_THRESHOLD = 10;

const Flag = ({ code, country }) => {
    const [error, setError] = useState(false);

    if (error || !code) {
        return <span className={styles.flagSpacer}></span>;
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

const AssetChip = ({ asset }) => (
    <span className={styles.assetTag}>
        {asset.logo && <img src={`/img/logos/${asset.logo}`} alt={`${asset.name} logo`} className={styles.assetLogo} />}
        <span>{asset.name}</span>
    </span>
);

const Chip = ({ text }) => (
    <span className={styles.assetTag}>
        <span>{text}</span>
    </span>
);

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
        border: '1px solid var(--ifm-color-emphasis-300)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
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

const RampsDirectory = () => {
    // Handle empty or malformed data
    if (!Array.isArray(rampsData) || rampsData.length === 0) {
        return (
            <div>
                <p>No ramps data available.</p>
            </div>
        );
    }
    
    const [selectedGeos, setSelectedGeos] = useState([]);
    const [expandedRamps, setExpandedRamps] = useState({}); // { [rampId: string]: boolean }

    const toggleRampExpansion = (rampId) => {
        setExpandedRamps(prev => ({
            ...prev,
            [rampId]: !prev[rampId]
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
        rampsData.forEach(ramp => {
            ramp.geo_rollout.forEach(geo => {
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

    const filteredRamps = useMemo(() => {
        if (!selectedGeos || selectedGeos.length === 0) {
            return rampsData;
        }
        const selectedCountries = selectedGeos.map(s => s.value.toLowerCase());
        return rampsData.filter(ramp =>
            ramp.geo_rollout.some(geo =>
                selectedCountries.includes(geo.country.toLowerCase())
            )
        );
    }, [selectedGeos]);

    const allGeos = useMemo(() => {
        const geos = new Set();
        rampsData.forEach(ramp => {
            ramp.geo_rollout.forEach(geo => {
                geos.add(geo.country);
            });
        });
        return Array.from(geos).sort();
    }, []);

    return (
        <div>
            <ContributeNotice />
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
            <div className={styles.rampsList}>
                {filteredRamps.map(ramp => {
                    const allRampOptions = Array.from(new Set(ramp.geo_rollout.flatMap(g => g.ramp_options))).sort();
                    const allPaymentMethods = Array.from(new Set(ramp.geo_rollout.flatMap(g => g.payment_methods.map(p => p.name)))).sort();

                    const uniqueAssets = Array.from(
                        new Map(
                            ramp.geo_rollout
                                .flatMap(g => g.assets || [])
                                .filter(a => a && a.name)
                                .map(a => [a.name, a])
                        )
                        .values()
                    ).sort((a, b) => a.name.localeCompare(b.name));

                    const geosByCountry = ramp.geo_rollout.reduce((acc, geo) => {
                        const countryName = geo.country;
                        if (!acc[countryName]) {
                            acc[countryName] = {
                                country: countryName,
                                country_code_alpha3: geo.country_code,
                                currencies: new Set(),
                                ramp_options: new Set(),
                                payment_methods: [],
                                payment_method_names: new Set(),
                                assets: new Map(),
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
                        if (geo.assets) {
                            geo.assets.forEach(asset => {
                                if (asset.name && !acc[countryName].assets.has(asset.name)) {
                                    acc[countryName].assets.set(asset.name, asset);
                                }
                            });
                        }
                        return acc;
                    }, {});

                    Object.values(geosByCountry).forEach(geoData => {
                        geoData.currencies = Array.from(geoData.currencies);
                        geoData.ramp_options = Array.from(geoData.ramp_options).sort();
                        geoData.payment_methods.sort((a, b) => a.name.localeCompare(b.name));
                        geoData.assets = Array.from(geoData.assets.values()).sort((a, b) => a.name.localeCompare(b.name));
                    });

                    const uniqueGeos = Object.values(geosByCountry).sort((a,b) => a.country.localeCompare(b.country));

                    const isExpanded = expandedRamps[ramp.id];
                    const hasTooManyGeos = uniqueGeos.length > GEOGRAPHY_VISIBILITY_THRESHOLD;
                    const visibleGeos = hasTooManyGeos && !isExpanded
                        ? uniqueGeos.slice(0, GEOGRAPHY_VISIBILITY_THRESHOLD)
                        : uniqueGeos;


                    return (
                        <div key={ramp.id} className={styles.rampCard}>
                            <div className={styles.rampHeader}>
                                <div className={styles.rampIdentity}>
                                    {ramp.logo ? (
                                        <img src={`/img/logos/${ramp.logo}`} alt={`${ramp.name} logo`} className={styles.rampLogo} />
                                    ) : (
                                        <div className={styles.rampLogoPlaceholder}></div>
                                    )}
                                    <span className={styles.rampName}>{ramp.name}</span>
                                </div>
                                {ramp.website && (
                                    <a href={ramp.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                                        Visit Website
                                        <svg
                                            className={styles.externalIcon}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                )}
                            </div>
                            <div className={styles.rampDetails}>
                                <div className={styles.detailItem}>
                                    <strong>Geographies</strong>
                                    <div className={styles.geographiesList}>
                                        {visibleGeos.map((geo) => {
                                            const alpha2Code = countryCodeMapping[geo.country_code_alpha3];
                                            return (
                                                <span key={`${ramp.id}-${geo.country}`} className={styles.geoTagContainer}>
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
                                                                <strong>Supported Currencies:</strong>
                                                                <div>{geo.currencies.join(', ')}</div>
                                                            </div>
                                                            <div className={styles.popoverSection}>
                                                                <strong>On/Off Ramp:</strong>
                                                                <div>{geo.ramp_options.join(', ')}</div>
                                                            </div>
                                                            <div className={styles.popoverSection}>
                                                                <strong>Payment Methods:</strong>
                                                                <div className={styles.paymentMethodsContainer}>
                                                                    {geo.payment_methods.map(pm => (
                                                                        <span key={pm.name} className={styles.paymentMethod}>
                                                                            {pm.logo && <img src={`/img/logos/${pm.logo}`} alt="" />}
                                                                            {pm.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {geo.assets.length > 0 && <div className={styles.popoverSection}>
                                                                <strong>Assets:</strong>
                                                                <div className={styles.assetsContainer}>
                                                                    {geo.assets.map(asset => <AssetChip key={asset.name} asset={asset} />)}
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    </div>
                                                </span>
                                            )
                                        })}
                                        {hasTooManyGeos && !isExpanded && (
                                            <button onClick={() => toggleRampExpansion(ramp.id)} className={styles.expandButton}>
                                                ... and {uniqueGeos.length - GEOGRAPHY_VISIBILITY_THRESHOLD} more
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.detailItemContainer}>
                                    <div className={styles.detailItem}>
                                        <strong>All Ramp Options</strong>
                                        <div className={styles.assetsList}>
                                            {allRampOptions.length > 0 ? allRampOptions.map(option => (
                                                <Chip key={option} text={option} />
                                            )) : <p>N/A</p>}
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>All Payment Methods</strong>
                                        <div className={styles.assetsList}>
                                            {allPaymentMethods.length > 0 ? allPaymentMethods.map(method => (
                                                <Chip key={method} text={method} />
                                            )) : <p>N/A</p>}
                                        </div>
                                    </div>
                                    <div className={`${styles.detailItem} ${uniqueAssets.length === 0 ? styles.hiddenContent : ''}`}>
                                        <strong>Assets</strong>
                                        <div className={styles.assetsList}>
                                            {uniqueAssets.length > 0 ? uniqueAssets.map(asset => (
                                                <AssetChip key={asset.name} asset={asset} />
                                            )) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RampsDirectory;