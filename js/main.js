(function () {
  var EMAIL = "jakeessexenquiries@gmail.com";

  function val(form, name) {
    var el = form.elements[name];
    return el && el.value ? String(el.value).trim() : "";
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
      var body = [
        "Name: " + val(gig, "name"),
        "Email / phone: " + val(gig, "contact"),
        "Date: " + val(gig, "date"),
        "Venue / town: " + val(gig, "venue"),
        "Package: " + val(gig, "package"),
        "",
        "Message:",
        val(gig, "message") || "(none)",
      ].join("\n");
      openMail("Gig enquiry — Jake Essex", body);
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
