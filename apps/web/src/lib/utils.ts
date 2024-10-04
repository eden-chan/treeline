export function calculateTimeAgo(timestamp: Date) {
  const timeAgo =
    (new Date().getTime() - new Date(timestamp || new Date()).getTime()) / 1000;
  if (timeAgo < 3600) {
    return `${Math.round(timeAgo / 60)} minutes ago`;
  } else if (timeAgo < 86400) {
    return `${Math.round(timeAgo / 3600)} hours ago`;
  } else if (timeAgo < 604800) {
    return `${Math.round(timeAgo / 86400)} days ago`;
  } else {
    return `${Math.round(timeAgo / 604800)} weeks ago`;
  }
}
