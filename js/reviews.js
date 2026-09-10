window.JE_REVIEWS = [
  {
    quote: "Great performance at Chadwell Working Men’s Club. Jake sang a lot of Elvis and we all like Elvis here. He’s very humble and always puts on a great show for us.",
    who: "Jenny",
    place: "Encore · Chadwell WMC"
  },
  {
    quote: "Jake is a regular at The Ship in Aveley. He has gained a big following down here and the regulars always come down when he is performing. We like the Elvis and the Johnny Cash numbers that he does.",
    who: "Tony B",
    place: "Encore · The Ship, Aveley"
  },
  {
    quote: "Jake amazed me with his unique, raw sound, I honestly didn’t expect it coming from a man of his age, me and my husband were truly shocked, definitely recommend.",
    who: "Hannah",
    place: "Stanford-le-Hope"
  },
  {
    quote: "My favourite performer of the classic 50s–70s vibe by far.",
    who: "Katie",
    place: "Essex"
  },
  {
    quote: "Amazing vocal, great night.",
    who: "Amie Carr",
    place: "London"
  },
  {
    quote: "Genuine class, Jake’s voice needs to be heard, should be famous.",
    who: "Matt",
    place: "Kent"
  },
  {
    quote: "I saw Jake perform in London, his different style is amazing, and unique for a man of his age in this century, he’s a very funny guy and entertains the crowd well.",
    who: "Jess",
    place: "London"
  }
];

(function () {
  var mount = document.getElementById("review-grid");
  if (!mount) return;
  var html = "";
  (window.JE_REVIEWS || []).forEach(function (r) {
    html += '<article class="review">'
      + '<p class="stars" aria-label="5 out of 5 stars">★★★★★</p>'
      + "<p>“" + r.quote + "”</p>"
      + '<p class="review-meta">' + r.who + " · " + r.place + "</p>"
      + "</article>";
  });
  mount.innerHTML = html;
})();
