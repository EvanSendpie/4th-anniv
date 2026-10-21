/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          4th Anniversary Website · config.js                ║
 * ║                                                              ║
 * ║  Edit ONLY this file to personalise the whole website!       ║
 * ║  Every section has comments explaining what each field does. ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ──────────────────────────────────────────
   *  SECTION 1 · Names & Greetings
   * ──────────────────────────────────────────
   * yourName       → Your name / nickname (displayed in letter signature)
   * partnerName    → Your girlfriend's name / nickname
   * coupleEmoji    → Emoji pair shown in the hero banner
   */
  yourName: "Pudu",
  partnerName: "Bubu",
  coupleEmoji: "Pudu & Bubu",

  /* ──────────────────────────────────────────
   *  SECTION 2 · Passcode Gate
   * ──────────────────────────────────────────
   * passcode  → The secret PIN she types to enter the site.
   *             Tip: use your anniversary date, e.g. "1234"
   * hint      → A sweet clue shown when she clicks the hint button
   */
  passcode: "231022",
  hint: "Coba ingat tanggal spesial kita pertama kali jadian ya.",

  /* ──────────────────────────────────────────
   *  SECTION 3 · Anniversary Start Date
   * ──────────────────────────────────────────
   * anniversaryDate → ISO date string (YYYY-MM-DD) of your relationship start.
   *                   The live counter counts from midnight on this day.
   */
  anniversaryDate: "2022-10-23",

  /* ──────────────────────────────────────────
   *  SECTION 4 · 4-Year Storyline Chapters
   * ──────────────────────────────────────────
   * Each chapter has:
   *   year       → Label shown on the year badge
   *   title      → Chapter heading
   *   date       → Date range label (freeform string)
   *   story      → Short paragraph describing that year
   *   photo      → Path/URL to your photo for that year
   *                Use "" or "assets/placeholder.jpg" while testing
   *   memories   → Array of short bullet memory strings (2–4 items)
   */
  storyline: [
    {
      year: "Tahun 1",
      title: "The Spark",
      date: "September 2021 – September 2022",
      story: "Awal dari segalanya — saat satu sapaan kecil memulai sebuah cerita yang indah. Pertama kali jalan bareng, pertama kali ketawa bareng, dan pertama kali sadar bahwa kamu adalah orang yang aku cari.",
      photo: "",
      memories: [
        "Kencan pertama yang bikin deg-degan",
        "Pertama kali pegang tangan",
        "Foto berdua untuk pertama kali",
      ]
    },
    {
      year: "Tahun 2",
      title: "Growing Together",
      date: "September 2022 – September 2023",
      story: "Makin kenal, makin sayang. Belajar saling memahami kebiasaan satu sama lain — dari hal-hal kecil yang bikin ketawa sampai momen-momen yang bikin makin dekat.",
      photo: "",
      memories: [
        "Jalan-jalan seru bareng pertama kali",
        "Ngobrol sampai pagi ga kerasa",
        "Punya playlist lagu favorit berdua",
      ]
    },
    {
      year: "Tahun 3",
      title: "Through Ups & Downs",
      date: "September 2023 – September 2024",
      story: "Bukan selalu mulus, tapi kita selalu saling menguatkan. Terima kasih sudah tetap ada di saat momen tersulit — dan membuatku ingat kenapa kamu selalu jadi pilihan pertamaku.",
      photo: "",
      memories: [
        "Saling support di masa-masa sulit",
        "Belajar komunikasi lebih baik",
        "Buktikan bahwa cinta itu bisa melewati badai",
      ]
    },
    {
      year: "Tahun 4",
      title: "Stronger Than Ever",
      date: "September 2024 – September 2025",
      story: "Empat tahun bersama, dan cinta kita makin kuat dari sebelumnya. Setiap hari bersamamu adalah hadiah — dan aku tidak sabar menjalani tahun-tahun berikutnya bersamamu.",
      photo: "",
      memories: [
        "4 tahun dan masih sama-sama baper",
        "Mimpi dan rencana masa depan bersama",
        "Happy 4th Anniversary, sayangku!",
      ]
    }
  ],

  /* ──────────────────────────────────────────
   *  SECTION 5 · Memory Trivia Quiz
   * ──────────────────────────────────────────
   * Each question has:
   *   question    → The quiz question text
   *   options     → Array of 4 answer strings
   *   answer      → Index (0-based) of the correct option
   *   explanation → Fun explanation shown after answering
   */
  quizQuestions: [
    {
      question: "Tanggal berapa kita pertama kali jadian?",
      options: ["27 September", "14 Februari", "23 Oktober", "17 Agustus"],
      answer: 2,
      explanation: "Yap! 27 September adalah hari paling spesial kita."
    },
    {
      question: "Apa hal pertama yang bikin kamu tertarik sama aku?",
      options: ["Senyumannya yang manis", "Cara dia ketawa", "Orangnya perhatian banget", "Semua hal dari Pudu!"],
      answer: 3,
      explanation: "Semuanya sempurna dong! Gimana mau pilih satu??"
    },
    {
      question: "Kalau lagi kangen, aku biasanya...",
      options: ["Langsung chat", "Lihat foto-foto kita", "Telpon Pudu", "Semua di atas!"],
      answer: 3,
      explanation: "Kangen itu nyata dan tidak bisa ditahan."
    },
    {
      question: "Sudah berapa tahun kita bersama?",
      options: ["2 tahun", "3 tahun", "4 tahun", "5 tahun"],
      answer: 2,
      explanation: "4 tahun! Dan semoga masih banyak tahun-tahun indah ke depan~ "
    }
  ],

  /* ──────────────────────────────────────────
   *  SECTION 6 · Catch the Hearts Game
   * ──────────────────────────────────────────
   * targetScore  → Number of hearts to catch to win
   * gameDuration → Seconds the game runs (0 = unlimited until win)
   */
  heartGame: {
    targetScore: 15,
    gameDuration: 0
  },

  /* ──────────────────────────────────────────
   *  SECTION 7 · Love Photo Puzzle
   * ──────────────────────────────────────────
   * puzzleImage  → Path/URL to the couple photo used for the puzzle
   *                Use "" to use the built-in numbered fallback puzzle
   */
  puzzleImage: "",

  /* ──────────────────────────────────────────
   *  SECTION 8 · The Love Letter
   * ──────────────────────────────────────────
   * letterParagraphs → Array of paragraph strings in the letter
   *                    Each string becomes one paragraph block
   */
  letterParagraphs: [
    "Sayang yang aku cintai,",
    "Empat tahun. Sudah empat tahun kita bersama — dan setiap harinya terasa seperti hadiah yang tidak pernah aku minta, tapi selalu aku syukuri.",
    "Aku masih ingat hari pertama kita. Betapa gugupnya aku, betapa bahagianya aku. Kamu hadir dalam hidupku dan segalanya terasa lebih berwarna. Kamu mengajarkanku apa artinya mencintai dan dicintai dengan tulus.",
    "Terima kasih sudah selalu ada. Di hari-hari bahagia kita rayakan bersama, dan di hari-hari sulit kamu tetap di sana — menjadi tempatku pulang. Kamu adalah rumahku.",
    "Empat tahun bukan waktu yang sebentar. Tapi bersamamu, setiap momen terasa berharga. Dan aku tidak bisa membayangkan menjalani hidup ini tanpa kamu di sisi ku.",
    "Selamat anniversary ke-4, cintaku. Semoga kita terus tumbuh bersama, saling mendukung, dan selalu bahagia. Aku mencintaimu lebih dari yang bisa aku ungkapkan dengan kata-kata.",
  ],

  /* ──────────────────────────────────────────
   *  SECTION 9 · Music
   * ──────────────────────────────────────────
   * bgmUrl → URL or path to an MP3/audio file for background music
   *          Leave "" to use no external BGM (synthesized audio still works)
   *          Example: "assets/our-song.mp3"
   */
  bgmUrl: "",

};

export default CONFIG;
