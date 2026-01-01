/**
 * Get time-based greeting based on current time
 * @param name - User's name to include in greeting
 * @returns Greeting string with user's name
 * 
 * Time ranges:
 * - Good Morning: 12:00 AM to 12:00 PM (00:00 to 12:00)
 * - Good Afternoon: 12:01 PM to 4:00 PM (12:01 to 16:00)
 * - Good Evening: 4:01 PM to 11:59 PM (16:01 to 23:59)
 */
export const getTimeBasedGreeting = (name: string): string => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  
  // Convert to minutes since midnight for easier comparison
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // 12:00 AM (00:00) = 0 minutes
  // 12:00 PM (12:00) = 720 minutes
  // 4:00 PM (16:00) = 960 minutes
  // 11:59 PM (23:59) = 1439 minutes
  
  let greeting: string;
  
  if (currentTimeInMinutes >= 0 && currentTimeInMinutes <= 720) {
    // 12:00 AM to 12:00 PM
    greeting = "Good Morning";
  } else if (currentTimeInMinutes > 720 && currentTimeInMinutes <= 960) {
    // 12:01 PM to 4:00 PM
    greeting = "Good Afternoon";
  } else {
    // 4:01 PM to 11:59 PM
    greeting = "Good Evening";
  }
  
  return `${greeting} ${name}!`;
};

