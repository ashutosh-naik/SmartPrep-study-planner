export const STUDENT_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Little by little, a little becomes a lot.", author: "Tanzanian Proverb" },
  { text: "Study while others are sleeping; work while others are loafing.", author: "William A. Ward" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "Today's preparation determines tomorrow's achievement.", author: "Unknown" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Focused, hard work is the real key to success.", author: "John Carmack" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Unknown" },
  { text: "You are braver than you believe, stronger than you seem.", author: "A.A. Milne" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Success doesn't come from what you do occasionally — it comes from what you do consistently.", author: "Marie Forleo" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Don't stop until you're proud.", author: "Unknown" },
  { text: "Mistakes are proof that you are trying.", author: "Unknown" },
  { text: "Your only limit is your mind.", author: "Unknown" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
];

export function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return STUDENT_QUOTES[dayOfYear % STUDENT_QUOTES.length];
}
