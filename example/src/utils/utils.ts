export const randomDarkColor = `#${[0, 0, 0]
  .map(() =>
    Math.floor(Math.random() * 200)
      .toString(16)
      .padStart(2, "0"),
  )
  .join("")}`;

export const getCurrentDate = (): number => {
  return Date.now();
};

export const timeSince = (timestamp: number): string => {
  const now = getCurrentDate();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 1)
    return new Date(timestamp)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "/");
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return `${minutes} minutes ago`;
};
