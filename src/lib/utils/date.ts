// Consistent date formatting utility to avoid hydration errors
export function formatDate(dateString: string): string {
  // Use a consistent format that works the same on server and client
  const date = new Date(dateString);
  
  // Simple, consistent format: YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  // Consistent format: YYYY-MM-DD HH:MM
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
