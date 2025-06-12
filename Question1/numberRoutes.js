export default function (app) {
  app.get("/test/primes", (req, res) => {
    res.json({ numbers: [2, 3, 5, 7, 11, 13, 17] });
  });

  app.get("/test/fibo", (req, res) => {
    res.json({ numbers: [0, 1, 1, 2, 3, 5, 8, 13] });
  });

  app.get("/test/even", (req, res) => {
    res.json({ numbers: [2, 4, 6, 8, 10, 12, 14] });
  });

  app.get("/test/rand", (req, res) => {
    const nums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
    res.json({ numbers: nums });
  });
}