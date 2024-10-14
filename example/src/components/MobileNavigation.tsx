import styles from "../App.module.css";

interface MobileNavigationProps {
  isAreaSelectionEnabled: boolean;
  setIsAreaSelectionEnabled: (enabled: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isAreaSelectionEnabled,
  setIsAreaSelectionEnabled,
  setIsSidebarOpen,
}) => {
  return (
    <div className={styles.mobileButtons}>
      <button
        className={`${styles.mobileButton} ${styles.areaSelectionToggle} ${isAreaSelectionEnabled ? styles.active : ""}`}
        onClick={() => setIsAreaSelectionEnabled(!isAreaSelectionEnabled)}
        type="button"
      >
        {isAreaSelectionEnabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-label="Area Selection Enabled"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v10H7V7zm2 2h6v6H9V9z" />
            <title>Area Selection Enabled</title>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-label="Area Selection Disabled"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v10H7V7z" />
            <title>Area Selection Disabled</title>
          </svg>
        )}
      </button>
      <button
        className={`${styles.mobileButton} ${styles.sidebarToggle}`}
        onClick={() => setIsSidebarOpen(true)}
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-label="Open Sidebar"
        >
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          <title>Open Sidebar</title>
        </svg>
      </button>
    </div>
  );
};

export default MobileNavigation;
