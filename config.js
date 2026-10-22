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
  hint: "Tanggal pertama kali kita resmi jadian.",

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
   *   memories   → Array of short bullet memory strings (2-4 items)
   */
  storyline: [
    {
      year: "Tahun 1",
      title: "The Spark",
      date: "Oktober 2022 - September 2023",
      story: "Semuanya berawal dari obrolan canggung yang pelan-pelan jadi percakapan favorit tiap malam. Masih ingat jelas rasanya deg-degan waktu pertama kali jalan bareng dan canggung pas mau gandeng tangan, sampai akhirnya sadar kalau aku betah banget berlama-lama sama kamu.",
      photo: "/assets/timeline-photos/year1.webp",
      memories: [
        "Obrolan random pertama di gedung bangki yang gak expect bisa lama.",
        "Pudu confess + nembak Bubu ",
        "Foto pertama berdua yang hasilnya masih kaku",
      ]
    },
    {
      year: "Tahun 2",
      title: "Growing Together",
      date: "Oktober 2023 - September 2024",
      story: "Tahun kedua kita mulai hafal kebiasaan masing-masing, dari menu makanan favorit sampai ekspresi kalau lagi ngambek. Kita juga ada mulai LDR ketika aku kuliah. Kita sering teleponan sampai ketiduran, explore kesana kemari berdua, dan mulai sadar kalau kamu bukan cuma pasangan, tapi juga teman cerita paling nyaman.",
      photo: "/assets/timeline-photos/year2.webp",
      memories: [
        "Trip bareng ke Magelang yang seru",
        "Teleponan malam sampai lupa waktu",
        "Walau LDR masih bisa onlien dating",
      ]
    },
    {
      year: "Tahun 3",
      title: "Through Ups & Downs",
      date: "Oktober 2024 - September 2025",
      story: "Nggak ada perjalanan yang mulus terus, tahun ketiga mengajarkan kita banyak hal tentang sabar dan menurunkan ego. Ada hari-hari capek saat kita berbeda pendapat, tapi kita selalu memilih untuk duduk bersama, mendengarkan, dan saling menguatkan lagi.",
      photo: "/assets/timeline-photos/year3.webp",
      memories: [
        "Belajar memahami sudut pandang masing-masing",
        "Saling menemani di hari-hari yang melelahkan",
        "Makin yakin untuk terus melangkah berdua",
      ]
    },
    {
      year: "Tahun 4",
      title: "Stronger Than Ever",
      date: "Oktober 2025 - Sekarang",
      story: "Empat tahun berlalu, rasa sayangnya nggak berkurang sama sekali, hanya terasa jauh lebih tenang dan matang. Kita sudah paham ritme satu sama lain, tahu cara saling menenangkan, dan makin mantap menatap masa depan berdua.",
      photo: "/assets/timeline-photos/year4.webp",
      memories: [
        "Genap empat tahun saling menemani",
        "Saling support dan saling berkembang",
        "Selamat empat tahun bersama, Bubu",
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
  /*
   * Album Kenangan
   * Ganti setiap path dengan path foto milikmu, contoh:
   * "/assets/album/foto-01.webp"
   */
  albumPhotos: [
    "/assets/timeline-photos/year1.webp",
    "/assets/timeline-photos/year2.webp",
    "/assets/timeline-photos/year3.webp",
    "/assets/timeline-photos/year4.webp",
    "/assets/timeline-photos/year1.webp",
    "/assets/timeline-photos/year2.webp",
    "/assets/timeline-photos/year3.webp",
    "/assets/timeline-photos/year4.webp",
    "/assets/timeline-photos/year1.webp",
    "/assets/timeline-photos/year2.webp",
    "/assets/timeline-photos/year3.webp",
    "/assets/timeline-photos/year4.webp",
    "/assets/timeline-photos/year1.webp",
    "/assets/timeline-photos/year2.webp",
    "/assets/timeline-photos/year3.webp",
    "/assets/timeline-photos/year4.webp"
  ],

  quizQuestions: [
    {
      question: "Tanggal berapa kita pertama kali jadian?",
      options: ["27 September", "14 Februari", "23 Oktober", "17 Agustus"],
      answer: 2,
      explanation: "Tepat, 23 Oktober adalah tanggal awal perjalanan kita berdua."
    },
    {
      question: "Apa hal pertama yang bikin kamu tertarik sama aku?",
      options: ["Senyum manisnya", "Cara Pudu ketawa", "Perhatiannya yang tulus", "Semua hal tentang Pudu"],
      answer: 3,
      explanation: "Nggak ada yang terlewat, semuanya langsung bikin jatuh hati."
    },
    {
      question: "Kalau lagi kangen, aku biasanya...",
      options: ["Langsung kirim chat", "Buka galeri foto kita", "Telepon Pudu", "Semua hal di atas"],
      answer: 3,
      explanation: "Kalau sudah kangen, segala cara dicoba biar bisa dengar kabar kamu."
    },
    {
      question: "Sudah berapa tahun kita bersama?",
      options: ["2 tahun", "3 tahun", "4 tahun", "5 tahun"],
      answer: 2,
      explanation: "Genap empat tahun, dan masih banyak cerita yang bakal kita jalani ke depan."
    }
  ],

  /* ──────────────────────────────────────────
   *  SECTION 6 · Catch the Hearts Game
   * ──────────────────────────────────────────
   * targetScore  → Number of hearts to catch to win
   * gameDuration → Seconds the game runs (0 = unlimited until win)
   */
  heartGame: {
    targetScore: 23,
    gameDuration: 0
  },

  /* ──────────────────────────────────────────
   *  SECTION 7 · Love Photo Puzzle
   * ──────────────────────────────────────────
   * puzzleImages → Array of photo paths; a random photo is selected each round
   */
  /* Tambahkan beberapa path foto; satu dipilih acak untuk setiap ronde. */
  puzzleImages: [
    "assets/puzzle/puzzle1.webp",
    "assets/puzzle/puzzle2.webp",
    "assets/puzzle/puzzle3.webp",
    "assets/puzzle/puzzle4.webp"
  ],

  /* ──────────────────────────────────────────
   *  SECTION 8 · The Love Letter
   * ──────────────────────────────────────────
   * letterParagraphs → Array of paragraph strings in the letter
   *                    Each string becomes one paragraph block
   */
  letterParagraphs: [
    "Buat Bubu,",
    "Nggak terasa kita sudah jalan bareng selama empat tahun. Kalau diingat lagi, rasanya belum lama kita canggung ngobrol pertama kali di bangki itu, dan sekarang kamu sudah jadi orang pertama yang aku cari setiap kali ada kabar baik atau hari yang melelahkan.",
    "Banyak hal yang berubah selama empat tahun ini, tapi caraku memandangmu tetap sama. Aku selalu kagum pada caramu tersenyum, keanggunan dan kesopananmu, dan perhatian kecil yang selalu kamu berikan tanpa perlu diminta.",
    "Kita pernah tertawa sampai perut sakit, pernah juga berbeda pendapat sampai sama-sama diam (silent treatment ah). Terus yang paling aku syukuri, di penghujung hari kita selalu memilih untuk saling mendengar dan memperbaiki segalanya bersama (karena aku yang minta juga hehe).",
    "Terima kasih sudah bertahan, menemani, dan tumbuh bersamaku sejauh ini. Selamat hari jadi yang keempat sayang, aku bersyukur punya kamu dalam hidupku.",
  ],

  /* ──────────────────────────────────────────
   *  SECTION 9 · Music
   * ──────────────────────────────────────────
   * bgmUrl → URL or path to an MP3/audio file for background music
   *          Leave "" to use no external BGM (synthesized audio still works)
   *          Example: "assets/our-song.mp3"
   */
  bgmUrl: "assets/audio/The Marías - Cariño.mp3",

};

export default CONFIG;
