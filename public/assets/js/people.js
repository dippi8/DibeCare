function clearTable() {
    element = $("peopleRow")
    while (element.firstChild) { 
        element.removeChild(element.firstChild);
    }
}

function addRow(person) {
  $("peopleRow").append(
    `
        <!-- singolo elemento -->
          <div class="col-xs-12 col-sm-6 col-md-3">
            <a href="${person.name}.html"><div class="mul_container clip_circle">
              <img src="../images/people/${person.name}-featured.png" alt="${person.name}" class="mul_image">
              <div class="mul_overlay">
                <div class="mul_text">${person.name}</div>
              </div>
            </div>
            </a>
          </div>
`
  );
}

function formDataAsJSON(formData) {
  let x = {};
  for (var pair of formData.entries()) {
    x[pair[0]] = pair[1];
  }
  return JSON.stringify(x);
}

let start = 0;
let count = 5;
let sortby = "none";

function setSort(x) {
  sortby = x;
  updatePeopleList());
}

function updatePeopleList() {
  fetch(`../../people?start=${start}&limit=${count}&sort=${sortby}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearTable();
      data.map(addRow);
    });
}

function startup() {
  updatePeopleList();
}

startup();