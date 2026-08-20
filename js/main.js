(function () {
  var EMAIL = "jakeessexenquiries@gmail.com";
  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function val(form, name) {
    var el = form.elements[name];
    return el && el.value ? String(el.value).trim() : "";
  }

  function niceDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length !== 3) return iso;
    var d = parseInt(p[2], 10);
    var m = parseInt(p[1], 10) - 1;
    return d + " " + MONTHS[m] + " " + p[0];
  }

  function niceTime(t) {
    if (!t) return "";
    var p = t.split(":");
    var h = parseInt(p[0], 10);
    var min = p[1] || "00";
    var ap = h >= 12 ? "pm" : "am";
    var h12 = h % 12;
    if (!h12) h12 = 12;
    return min === "00" ? h12 + ap : h12 + ":" + min + ap;
  }

  function openMail(subject, body) {
    var href =
      "mailto:" +
      EMAIL +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    window.location.href = href;
  }

  var gig = document.getElementById("gig-form");
  if (gig) {
    gig.addEventListener("submit", function (e) {
      e.preventDefault();
      var when = niceDate(val(gig, "date"));
      var at = niceTime(val(gig, "time"));
      var where = val(gig, "venue");
      var extra = val(gig, "message");
      var body = [
        "Hi Jake,",
        "",
        "I want to book you for " + when + " " + at + " at " + where + ".",
        "",
        "Name: " + val(gig, "name"),
        "Email / phone: " + val(gig, "contact"),
        "Show: " + val(gig, "package"),
      ];
      if (extra) {
        body.push("", extra);
      }
      openMail("Gig enquiry — Jake Essex", body.join("\n"));
    });
  }

  var vehicle = document.getElementById("vehicle-form");
  if (vehicle) {
    vehicle.addEventListener("submit", function (e) {
      e.preventDefault();
      var body = [
        "Name: " + val(vehicle, "name"),
        "Phone: " + val(vehicle, "phone"),
        "Postcode: " + val(vehicle, "postcode"),
        "Make / model: " + val(vehicle, "vehicle"),
        "",
        "What’s wrong:",
        val(vehicle, "issue"),
      ].join("\n");
      openMail("Vehicle enquiry — Jake Essex", body);
    });
  }
})();
