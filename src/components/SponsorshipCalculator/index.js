import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const SponsorshipCalculator = () => {
  const [inputs, setInputs] = useState({
    expectedNewUsers: 1000,
    monthlyActiveUsers: 30000,
    avgOpsPerUser: 5,
    numAssets: 1,
    additionalBaseReserves: 0,
    useAccountRecovery: true,
    deleteOldAccountSigner: true,
    recoverySignerServers: 2,
    percentageMauRecovery: 5,
    avgNetworkFee: 0.0001,
    baseReserve: 0.5,
    xlmUsdRate: 0.1, // Default value, will be fetched
  });

  const [results, setResults] = useState({
    costToCreateNewAccounts: 0,
    costToCoverFees: 0,
    costToRecoverAccounts: 0,
  });

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
        const data = await response.json();
        if (data.stellar && data.stellar.usd) {
          setInputs(prev => ({ ...prev, xlmUsdRate: data.stellar.usd }));
        }
      } catch (error) {
        console.error("Failed to fetch XLM price:", error);
      }
    };

    fetchPrice();
  }, []);

  useEffect(() => {
    const {
      expectedNewUsers, //E7
      monthlyActiveUsers, //E8
      avgOpsPerUser, //E9
      numAssets, //E10
      additionalBaseReserves,
      useAccountRecovery, //E12
      deleteOldAccountSigner, //E13
      recoverySignerServers, //E14
      percentageMauRecovery, //E15
      avgNetworkFee, //I8
      baseReserve, //I9
    } = inputs;

    const costToCreateNewAccounts = expectedNewUsers * avgNetworkFee + expectedNewUsers * baseReserve * ((useAccountRecovery ? 2 + recoverySignerServers : 0) + 2 + numAssets + additionalBaseReserves);

    const costToCoverFees = monthlyActiveUsers * avgOpsPerUser * avgNetworkFee;

    const mauRecoveryDecimal = percentageMauRecovery / 100;
    const costToRecoverAccounts = useAccountRecovery ?
      (monthlyActiveUsers * mauRecoveryDecimal * avgNetworkFee) + (deleteOldAccountSigner ? 0 : (monthlyActiveUsers * mauRecoveryDecimal * baseReserve * 2 + recoverySignerServers))
      : 0;

    setResults({
      costToCreateNewAccounts,
      costToCoverFees,
      costToRecoverAccounts,
    });

  }, [inputs]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setInputs(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : Number(value)
    }));
  };

  const formatNumber = (num, digits = 2) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
    
  const formatCurrency = (num) => {
    return '$' + formatNumber(num, 2);
  }

  const recoveryFieldsDisabled = !inputs.useAccountRecovery;

  const totalXLM = results.costToCreateNewAccounts + results.costToCoverFees + results.costToRecoverAccounts;
  const totalUSD = totalXLM * inputs.xlmUsdRate;
  const feesPaidXLM = results.costToCoverFees + (inputs.useAccountRecovery ? (results.costToRecoverAccounts) : 0);
  const reservesLockedXLM = results.costToCreateNewAccounts;

  const reservesPerUser = 2 + inputs.numAssets + inputs.additionalBaseReserves + (inputs.useAccountRecovery ? (2 + inputs.recoverySignerServers) : 0);
  const reservesInXLM = reservesPerUser * inputs.baseReserve;

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.inputsContainer}>
        {/* Usage Estimate Group */}
        <div className={styles.inputGroup}>
          <div className={styles.inputGroupHeader}>
            <h2>Usage estimate</h2>
            <span className={styles.edit}>✏️ edit these</span>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="expectedNewUsers" className={styles.tooltip}>
                Expected monthly new users/accounts
                <div className={styles.tooltipContent}>
                  How many new accounts/users will be funded in a month
                </div>
              </label>
            </div>
            <input id="expectedNewUsers" type="number" name="expectedNewUsers" value={inputs.expectedNewUsers} onChange={handleInputChange} className={styles.inputField} />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="monthlyActiveUsers" className={styles.tooltip}>
                Expected monthly active users
                <div className={styles.tooltipContent}>
                  Estimate the total number of users who will actively use the app each month (e.g., sending payments, swapping assets).
                </div>
              </label>
            </div>
            <input id="monthlyActiveUsers" type="number" name="monthlyActiveUsers" value={inputs.monthlyActiveUsers} onChange={handleInputChange} className={styles.inputField} />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="avgOpsPerUser" className={styles.tooltip}>
                Average operations per user per month
                <div className={styles.tooltipContent}>
                  Estimate the average number of on-chain actions (like payments or swaps) each active user will perform per month.
                </div>
              </label>
            </div>
            <input id="avgOpsPerUser" type="number" name="avgOpsPerUser" value={inputs.avgOpsPerUser} onChange={handleInputChange} className={styles.inputField} />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="numAssets" className={styles.tooltip}>
                Number of assets held by users excluding XLM
                <div className={styles.tooltipContent}>
                  The number of non-XLM tokens (e.g., USDC) each new user will hold. Each new token requires its own trustline, which has a reserve cost.
                </div>
              </label>
            </div>
            <input id="numAssets" type="number" name="numAssets" value={inputs.numAssets} onChange={handleInputChange} className={styles.inputField} />
          </div>
        </div>
        
        {/* Account Recovery Group */}
        <div className={styles.inputGroup}>
          <h2>Account Recovery</h2>

          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="useAccountRecovery">Use account recovery with SEP-30</label>
              <a href="https://stellar.org/blog/developers/sep-30-recoverysigner-user-friendly-key-management" target="_blank" rel="noopener noreferrer" className={styles.learnMoreLink}>
                Learn more
              </a>
            </div>
            <input id="useAccountRecovery" type="checkbox" name="useAccountRecovery" checked={inputs.useAccountRecovery} onChange={handleInputChange} className={styles.checkbox} />
          </div>
          <div className={`${styles.inputRow} ${recoveryFieldsDisabled ? styles.disabled : ''}`}>
            <div className={styles.labelWrapper}>
              <label htmlFor="deleteOldAccountSigner" className={styles.tooltip}>
                Account recovery deletes the old account signer
                <div className={styles.tooltipContent}>
                  When a user recovers their account, the key on the old (lost) device is removed as a signer. This frees up the 0.5 XLM base reserve associated with that key.
                </div>
              </label>
            </div>
            <input id="deleteOldAccountSigner" type="checkbox" name="deleteOldAccountSigner" checked={inputs.deleteOldAccountSigner} onChange={handleInputChange} disabled={recoveryFieldsDisabled} className={styles.checkbox} />
          </div>
          <div className={`${styles.inputRow} ${recoveryFieldsDisabled ? styles.disabled : ''}`}>
            <div className={styles.labelWrapper}>
              <label htmlFor="recoverySignerServers" className={styles.tooltip}>
                Number of recovery signer servers
                <div className={styles.tooltipContent}>
                  The number of independent servers used for account recovery. SEP-30 requires at least two for security. Each server adds a 0.5 XLM reserve per user.
                </div>
              </label>
            </div>
            <select id="recoverySignerServers" name="recoverySignerServers" value={inputs.recoverySignerServers} onChange={handleInputChange} disabled={recoveryFieldsDisabled} className={styles.inputField}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
          <div className={`${styles.inputRow} ${recoveryFieldsDisabled ? styles.disabled : ''}`}>
            <div className={styles.labelWrapper}>
              <label htmlFor="percentageMauRecovery" className={styles.tooltip}>
                Percentage of MAU who will use account recovery
                <div className={styles.tooltipContent}>
                  Estimate the percentage of your Monthly Active Users (MAU) who might lose access to their account and need to recover their account each month.
                </div>
              </label>
            </div>
            <div className={styles.inputWithAdornment}>
              <input id="percentageMauRecovery" type="number" name="percentageMauRecovery" value={inputs.percentageMauRecovery} onChange={handleInputChange} disabled={recoveryFieldsDisabled} />
              <span>%</span>
            </div>
          </div>
        </div>

        {/* Additional Reserves Group */}
        <div className={styles.inputGroup}>
          <h2>Additional Reserves</h2>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="additionalBaseReserves" className={styles.tooltip}>
                Additional base reserves per account
                <div className={styles.tooltipContent}>
                  Use this to sponsor extra base reserves for other on-chain needs, such as open offers on the DEX. Each reserve is 0.5 XLM.
                </div>
              </label>
            </div>
            <input id="additionalBaseReserves" type="number" name="additionalBaseReserves" value={inputs.additionalBaseReserves} onChange={handleInputChange} className={styles.inputField} />
          </div>
        </div>

        {/* Network Parameters Group */}
        <div className={`${styles.inputGroup} ${styles.networkParamsGroup}`}>
          <h2>Network Parameters</h2>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="avgNetworkFee">Avg. network fee</label>
            </div>
            <div className={styles.inputWithAdornment}>
              <input id="avgNetworkFee" type="number" step="0.0001" name="avgNetworkFee" value={inputs.avgNetworkFee} onChange={handleInputChange} />
              <span>XLM</span>
            </div>
          </div>
           <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label>Base reserve</label>
            </div>
            <div className={styles.paramValue}>{inputs.baseReserve} XLM</div>
          </div>
          <div className={styles.inputRow}>
            <div className={styles.labelWrapper}>
              <label htmlFor="xlmUsdRate">XLM/USD rate</label>
            </div>
            <div className={styles.inputWithAdornment}>
              <span>$</span>
              <input id="xlmUsdRate" type="number" step="0.001" name="xlmUsdRate" value={inputs.xlmUsdRate} onChange={handleInputChange}/>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className={styles.resultsSection}>
        <div className={styles.totalSection}>
            <h2 className={styles.totalLabel}>Monthly Total</h2>
            <div className={styles.totalValues}>
                <div className={styles.totalValueXLM}>{formatNumber(totalXLM)} XLM</div>
                <div className={styles.totalValueUSD}>{formatCurrency(totalUSD)}</div>
            </div>
        </div>
        <hr className={styles.hr}/>
        <div className={styles.breakdownSection}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cost to create new accounts</span>
            <span className={styles.resultValue}>{formatCurrency(results.costToCreateNewAccounts * inputs.xlmUsdRate)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cost to cover transactions</span>
            <span className={styles.resultValue}>{formatCurrency(results.costToCoverFees * inputs.xlmUsdRate)}</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Cost to recover accounts</span>
            <span className={styles.resultValue}>{formatCurrency(results.costToRecoverAccounts * inputs.xlmUsdRate)}</span>
          </div>
        </div>
        <div className={styles.breakdownSection}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Fees paid</span>
              <span className={styles.resultValue}>{formatNumber(feesPaidXLM)} XLM</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Reserves locked</span>
              <span className={styles.resultValue}>{formatNumber(reservesLockedXLM, 2)} XLM</span>
            </div>
        </div>
        <div className={styles.breakdownSection}>
          <div className={styles.resultItem}>
            <span className={styles.resultLabel}>Reserves per<br />new user</span>
            <div className={styles.resultValue}>
              <span className={styles.resultValueMain}>{reservesPerUser} base reserves</span>
              <span className={styles.resultValueSub}>({formatNumber(reservesInXLM, 1)} XLM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipCalculator; 