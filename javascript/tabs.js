// Open the modal when trying to exit
window.addEventListener('beforeunload', function (e) {
  e.preventDefault(); // Prevents immediate exit
  showExitWarning();
  return ''; // Standard return value for beforeunload events
});


function openTab(evt, tabName) {
    // Declare all variables
    var i, tabContent, tabLinks;
  
    // Get all elements with class="tabContent" and hide them
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }
  
    // Get all elements with class="tabLinks" and remove the class "active"
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openPopUp() {
  document.getElementById('saveTab').style.display = 'block';
}

function closePopUp() {
  document.getElementById('saveTab').style.display = 'none';
}

// Optional: Add functionality to close the modal when clicking outside of it
window.onclick = function(event) {
  var modal = document.getElementById('saveTab');
  if (event.target == modal) {
      modal.style.display = 'none';
  }
}
