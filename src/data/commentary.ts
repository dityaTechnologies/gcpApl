import type { PersonaId, BallOutcome } from '../types';

type CommentaryMap = Record<PersonaId, Record<BallOutcome, string[]>>;

const commentaryData: CommentaryMap = {
  bollywood: {
    dot: [
      "Arre yaar, kya boring ball hai! Picture mein interval aa gaya! 😴",
      "Dot ball! Hero ko thoda warm up chahiye. Scene set ho raha hai! 🎬",
    ],
    single: [
      "Ek run! Chhota kadam, bada safar shuru! 👣",
      "Single liya! Hero tez nahin daud sakta kya? Script likhni padegi! 🎭",
    ],
    two: [
      "Do run! Pair daud rahe hain jaise villain ka peecha kar rahe hain! 🏃",
      "TWO RUNS! Double action scene, double dhamaal! 🎪",
    ],
    four: [
      "KYAAA SHOT HAI BHAI! Bilkul hero jaisa! BOUNDARY! 🎬",
      "CHAAR! Gaadi mein rocket laga diya! Blockbuster moment! 🚀",
    ],
    six: [
      "CHHHAKKAAA! YE TOH BLOCKBUSTER HIT HAI! 🎆🎆🎆",
      "CHHAKKA! STADIUM KA ROOF UTHA DIYA! OSCAR WORTHY SHOT! 🏆",
    ],
    wicket: [
      "OUT! INTERVAL! Villain ka scene khatam! Agli innings mein milenge! 🎭",
      "WICKET! Hero ki entry ho gayi... aur woh chal bhi gaya! Interval! 🎪",
    ],
    wide: [
      "Wide ball! Nawab sahab, target se kitna door? GPS lagao! 😂",
      "Wide! Director ne kaha 'isko editing mein hatao' — but umpire ne no bol diya! 🎬",
    ],
  },
  comedy: {
    dot: [
      "Dot ball... riveting stuff. I'm on the edge of my sleep. 😴",
      "A dot. Fascinating. Truly the peak of sporting drama. 🎭",
    ],
    single: [
      "One run. One. They might finish this innings by Tuesday. 📅",
      "A single! At this rate, my grandmother could outrun them. 👵",
    ],
    two: [
      "Two runs! The crowd goes... mildly conscious. 😐",
      "Double! Even the pigeons in the stadium are more excited. 🕊️",
    ],
    four: [
      "FOUR! Now THAT woke me up! Someone tell the cameraman to zoom in! 📸",
      "Boundary! The ball said 'I'm outta here' and honestly I relate. 🏃",
    ],
    six: [
      "SIX! Now THAT'S content! Finally something to tweet about! 🐦",
      "MAXIMUM! The ball just cleared the stadium AND someone's mortgage. 💸",
    ],
    wicket: [
      "WICKET! And just like that, someone's Swiggy order has arrived. 🚶",
      "OUT! The batter walks off looking like they just got the wrong coffee order. ☕",
    ],
    wide: [
      "Wide ball. The bowler is aiming for the next county. 🗺️",
      "That was wide. So wide it's in a different timezone. 🌍",
    ],
  },
  professor: {
    dot: [
      "Excellent discipline from the bowler. Hitting the hard length consistently. 📊",
      "A well-contained delivery. The batter was cramped for room on that occasion.",
    ],
    single: [
      "Good rotation of strike there. Keeping the scoreboard ticking is crucial in this phase.",
      "Singles are gold in the middle overs. Smart batting intelligence on display.",
    ],
    two: [
      "Good running between wickets. Sharp awareness of fielding positions here.",
      "Two runs — exploiting the gap at deep mid-wicket. Tactical placement.",
    ],
    four: [
      "Superb placement through cover! Found the gap with pristine timing. 🎯",
      "FOUR! Classic straight drive. High elbow, perfect weight transfer. Textbook.",
    ],
    six: [
      "Magnificent strike! Estimated 94 meters! Outstanding blend of power and timing. 📐",
      "MAXIMUM! The bat speed generated there was exceptional. Pure clean contact.",
    ],
    wicket: [
      "Excellent variation! Slower delivery, the batter committed too early. 🧠",
      "WICKET! Tactical bowling at its finest. The pressure finally paying off.",
    ],
    wide: [
      "Poor execution. The bowler strayed off the line. Extra delivery gifts momentum.",
      "Wide ball — the wrist position failed at delivery stride. Correctable flaw.",
    ],
  },
  dadi: {
    dot: [
      "Arre beta, kuch toh maaro! Dadi ki dua waste ho rahi hai! 🙏",
      "Dot ball... chalo koi baat nahi. Kheer banake rakhti hoon, haar ke mat aana! 🥣",
    ],
    single: [
      "Ek hi run? Chalo, thoda toh aaya! Dadi proud hai! 💕",
      "Single! Aahista aahista hi sahi, manzil milegi meri jaan! ❤️",
    ],
    two: [
      "Do run! Mera baccha daud raha hai! Shabaash! 🏃",
      "TWO RUNS! Haaye, kitna fast daudta hai mera beta! 🌟",
    ],
    four: [
      "HAAYE MERA BACCHA! Kya shot maara! Roti khila dungi tujhe! 🤩",
      "FOUR! Aaj toh mithai banti hai ghar mein! Mera champion! 🎉",
    ],
    six: [
      "HAAYE RABBA! CHHAKKA! MERA BACCHA CHAMPION HAI! 🎉🎉",
      "CHHAKKA! CHHAKKA! Dadi ka dil khush ho gaya! Bhagwan tera bhala kare! 🙏✨",
    ],
    wicket: [
      "OUT? Haaye, mera beta! Araam se baith, chai laati hoon... 😢",
      "WICKET! Chalo koi nahi... agli baar zyada dhyan lagana, beta. Dadi maaf kardi. 💕",
    ],
    wide: [
      "Wide? Arre bowler babu, nishana lagao theek se! Dadi bhi better kar sakti hai! 👵",
      "Wide ball! Beta, glasses lagao zara... dikhta nahi kya? 😄",
    ],
  },
  hype: {
    dot: [
      "bro that dot was actually kinda embarrassing ngl 💀",
      "dot ball... the vibe is not it rn. We need a RESET 🔄",
    ],
    single: [
      "ok single at least we're cooking something fr 🍳",
      "single run, small W but still a W no cap 👍",
    ],
    two: [
      "TWO RUNS! we're literally eating rn 🍽️",
      "double run! the run rate stays BUSSIN lowkey 📈",
    ],
    four: [
      "FOUR BRUHHH THE PLACEMENT WAS GOATED 🐐🐐",
      "BOUNDARY FR FR that gap was immaculate no cap 🔥",
    ],
    six: [
      "BRUHHH THATS OUTTA HERE 🚀🚀🚀 ABSOLUTELY GOATED NO CAP",
      "MAXIMUM!!!! BRO SAID SEE YA AND LAUNCHED IT INTO ORBIT 🛸💥",
    ],
    wicket: [
      "WICKET LMAOOO GET REKT 💀💀💀 bro got sent to the shadow realm",
      "OUT FR??? that was NOT it chief. momento mori for this batter 🪦",
    ],
    wide: [
      "wide ball... bowler said 'i do what i want' 😤",
      "bro the aim is COOKED. wide ball on stream rn 📡",
    ],
  },
};

export function getCommentary(persona: PersonaId, outcome: BallOutcome): string {
  const lines = commentaryData[persona][outcome];
  return lines[Math.floor(Math.random() * lines.length)];
}

export { commentaryData };
