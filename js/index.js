document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    formstatus.textContent = "Thank you for your message! We will get back to you soon.";
    var form = this;
    var url = "https://formspree.io/f/xjvdqnon";
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          form.reset();
          alert("Message sent successfully!");
        } else {
          alert("Error sending message.");
        }
      }
    };
  
    var formData = new FormData(form);
    xhr.send(formData);
  });
  