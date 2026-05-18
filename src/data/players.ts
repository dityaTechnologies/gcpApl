import type { Player } from '../types';

export const players: Player[] = [
  { id: 'rg', name: 'Ruturaj Gaikwad', initials: 'RG', team: 'CSK', role: 'Batsman', price: 28 },
  { id: 'dc', name: 'Devon Conway', initials: 'DC', team: 'CSK', role: 'Batsman', price: 25 },
  { id: 'md', name: 'MS Dhoni', initials: 'MD', team: 'CSK', role: 'WK-Bat', price: 22 },
  { id: 'rj', name: 'Ravindra Jadeja', initials: 'RJ', team: 'CSK', role: 'All-Rounder', price: 26 },
  { id: 'mp', name: 'Matheesha Pathirana', initials: 'MP', team: 'CSK', role: 'Bowler', price: 24 },
  { id: 'vk', name: 'Virat Kohli', initials: 'VK', team: 'RCB', role: 'Batsman', price: 30 },
  { id: 'fp', name: 'Faf du Plessis', initials: 'FP', team: 'RCB', role: 'Batsman', price: 24 },
  { id: 'gm', name: 'Glenn Maxwell', initials: 'GM', team: 'RCB', role: 'All-Rounder', price: 27 },
  { id: 'jb', name: 'Jasprit Bumrah', initials: 'JB', team: 'RCB', role: 'Bowler', price: 29 },
  { id: 'ms2', name: 'Mohammed Siraj', initials: 'MS', team: 'RCB', role: 'Bowler', price: 22 },
];

export const quizQuestions = [
  {
    q: 'Who has hit the most sixes in IPL history?',
    options: ['Chris Gayle', 'AB de Villiers', 'MS Dhoni', 'Rohit Sharma'],
    correct: 0,
  },
  {
    q: 'Which team has won the most IPL titles?',
    options: ['MI', 'CSK', 'KKR', 'RCB'],
    correct: 1,
  },
  {
    q: 'Who bowled the most dot balls in IPL 2025?',
    options: ['Bumrah', 'Pathirana', 'Rashid Khan', 'Chahal'],
    correct: 0,
  },
  {
    q: 'What is the highest individual score in IPL?',
    options: ['158*', '175*', '185', '162*'],
    correct: 1,
  },
  {
    q: 'Which ground has the most 200+ totals?',
    options: ['Chinnaswamy', 'Wankhede', 'Eden Gardens', 'Kotla'],
    correct: 0,
  },
  {
    q: 'Who took the first hat-trick in IPL?',
    options: ['L. Balaji', 'Amit Mishra', 'Harbhajan', 'Malinga'],
    correct: 0,
  },
  {
    q: 'Most catches by a fielder in a single season?',
    options: ['15', '18', '14', '20'],
    correct: 1,
  },
  {
    q: 'Best bowling figures in a single IPL match?',
    options: ['Alzarri Joseph', 'Sai Kishore', 'Adam Zampa', 'Anil Kumble'],
    correct: 0,
  },
  {
    q: 'Which team scored 287 — highest IPL total?',
    options: ['RCB', 'SRH', 'PBKS', 'CSK'],
    correct: 0,
  },
  {
    q: 'Most Player of Match awards in IPL?',
    options: ['AB de Villiers', 'Chris Gayle', 'Virat Kohli', 'Sunil Narine'],
    correct: 0,
  },
];

export const shopProducts = [
  { id: 1, name: 'CSK Home Jersey 2026', emoji: '👕', originalPrice: 1499, salePrice: 999, discount: 33 },
  { id: 2, name: 'RCB Cap — Official', emoji: '🧢', originalPrice: 499, salePrice: 299, discount: 40 },
  { id: 3, name: 'Kohli Phone Case', emoji: '📱', originalPrice: 399, salePrice: 199, discount: 50 },
  { id: 4, name: 'CSK Laptop Stickers', emoji: '🏷️', originalPrice: 149, salePrice: 99, discount: 34 },
  { id: 5, name: 'RCB Home Jersey 2026', emoji: '👕', originalPrice: 1499, salePrice: 999, discount: 33 },
  { id: 6, name: 'CSK Champions Mug', emoji: '☕', originalPrice: 349, salePrice: 249, discount: 29 },
];

export const leaderboardFakes = [
  { username: 'CricketKing_MSD', score: 1250 },
  { username: 'IPL_Fanatic_07', score: 1180 },
  { username: 'SixerMachine', score: 1095 },
  { username: 'BowlerHunter', score: 980 },
  { username: 'ChennaiSuper', score: 870 },
  { username: 'ViratFan18', score: 845 },
  { username: 'DhoniFanForever', score: 790 },
  { username: 'BumrahArmy', score: 720 },
  { username: 'CrickPulse_Pro', score: 680 },
];
