import React from 'react';

import styles from './InstallationDashboard.css';

export interface InstallationDashboardProps {
  prop?: string;
}

export function InstallationDashboard({prop = 'default value'}: InstallationDashboardProps) {
  return <div className={styles.InstallationDashboard}>InstallationDashboard {prop}</div>;
}
