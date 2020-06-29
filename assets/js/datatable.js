jQuery(function () {
  
  var primaryFilter = jQuery('#primaryfilter');
  createMultiSelect('Type', ';', primaryFilter);
  
  var normalFilter = jQuery('#filterlist');

  createMultiSelect('Category', ';', normalFilter);
  createMultiSelect('Coverage', ';', normalFilter);
  createMultiSelect('Data Format', ';', normalFilter);
  createMultiSelect('Author', ';', normalFilter);

  var surveyFilter = jQuery('#surveyfilter');

  createMultiSelect('Target Population', ';', surveyFilter);
  createMultiSelect('Sampling', ';', surveyFilter);
  createMultiSelect('Time', ';', surveyFilter);
  createMultiSelect('Interval of Data Collection', ';', surveyFilter);
  createMultiSelect('Individual Level Data from Pre-COVID', ';', surveyFilter);
  createMultiSelect('Number of Observations', ';', surveyFilter);
  createMultiSelect('Micro Data Availablity', ';', surveyFilter);
  createMultiSelect('Level of Observation', ';', surveyFilter);
});

const datatableFilterTerms = new Map();
function datatableFilter(column, terms){
  if(!Array.isArray(terms)){
    terms = [terms];
  }
  datatableFilterTerms.set(column, terms);

  const table = jQuery(".datatable-container table");
  const rows = table.find("tbody tr");
  
  const allTerms = [...datatableFilterTerms.values()].flat();
  
  rows.each(function () {
    textContent = this.textContent.toLowerCase();
    const show = allTerms.every((term) => console.log(term) || textContent.includes(term.toLowerCase()));
    if (!show) {
      jQuery(this).hide();
    } else {
      jQuery(this).show();
    }
  });
}

function createMultiSelect(column, splitter, container){
  var id = makeSafeForCSS(column) + '_filter' ;

  var terms = getTerms(column, splitter);

  var options = terms.reduce((term,string)=> `${string}<option>${term}</option>`);
  
  var filter = `
    <div class="filter-element ${id}_container">
      <label>${column}</label>
      <select class="form-control" id="${id}">
        <option selected value="">all</option>
        ${options}
      </select>
    </div>  
  `

  container.append(filter);

  jQuery(`#${id}`).on('change',function (event) {
    datatableFilter(column, jQuery(this).val());
  });
}

function getTerms(column, splitter){
  const table = jQuery(".datatable-container table");
  const rows = table.find("tbody tr");
  const headings = table.find("thead tr>*");
  let terms = new Set();

  const columnNumber = headings.toArray().findIndex(function(elem){
    if(!elem.textContent) return false;
    return elem.textContent.toLowerCase() === column.toLowerCase()
  })
  
  rows.each(function(){
    const row = jQuery(this);    
    let d = row.find(`:nth-child(${columnNumber + 1})`).text();
    d = d.split(splitter).map(elem=>elem.trim());
    terms = new Set([...terms, ...d]);
  })

  return [...terms];
}

function makeSafeForCSS(name) {
  return name.replace(/[^a-z0-9]/g, function(s) {
      var c = s.charCodeAt(0);
      if (c == 32) return '-';
      if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
      return '__' + ('000' + c.toString(16)).slice(-4);
  });
}
