function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function hideElement(element) {
  element.classList.add('hidden');
}

function showElement(element) {
  element.classList.remove('hidden');
}

function clearResults(elements) {
  elements.low.textContent = '';
  elements.medium.textContent = '';
  elements.notQualified.textContent = '';
  elements.error.textContent = '';
  hideElement(elements.results);
  hideElement(elements.error);
}

function populateHouseholdSizeOptions(selectElement) {
  for (let size = 1; size <= 8; size += 1) {
    const option = document.createElement('option');
    option.value = String(size);
    option.textContent = String(size);
    selectElement.appendChild(option);
  }
}

function populateCountyOptions(selectElement, data) {
  const counties = Object.keys(data).sort((a, b) => a.localeCompare(b));
  counties.forEach((county) => {
    const option = document.createElement('option');
    option.value = county;
    option.textContent = county;
    selectElement.appendChild(option);
  });
}

function extractThresholds(data, county, householdSize) {
  const countyData = data[county];
  if (!Array.isArray(countyData)) {
    return null;
  }

  const householdIndex = householdSize - 1;
  const thresholds = countyData[householdIndex];
  if (!Array.isArray(thresholds) || thresholds.length < 2) {
    return null;
  }

  const lowMax = Number(thresholds[0]);
  const mediumMax = Number(thresholds[1]);
  if (!Number.isFinite(lowMax) || !Number.isFinite(mediumMax)) {
    return null;
  }

  return { lowMax, mediumMax };
}

function renderRanges(elements, thresholds) {
  const lowRange = `Up to ${formatCurrency(thresholds.lowMax)}`;
  const mediumRange = `${formatCurrency(thresholds.lowMax + 1)} to ${formatCurrency(thresholds.mediumMax)}`;
  const notQualifiedRange = `Above ${formatCurrency(thresholds.mediumMax)}`;

  elements.low.textContent = lowRange;
  elements.medium.textContent = mediumRange;
  elements.notQualified.textContent = notQualifiedRange;

  elements.error.textContent = '';
  hideElement(elements.error);
  showElement(elements.results);
}

function setupWidget(data) {
  const widget = document.querySelector('[data-qi-widget]');
  if (!widget) {
    return;
  }

  const countySelect = widget.querySelector('[data-county]');
  const householdSizeSelect = widget.querySelector('[data-household-size]');
  const elements = {
    results: widget.querySelector('[data-results]'),
    low: widget.querySelector('[data-low-range]'),
    medium: widget.querySelector('[data-medium-range]'),
    notQualified: widget.querySelector('[data-does-not-qualify-range]'),
    error: widget.querySelector('[data-error]'),
  };

  if (!countySelect || !householdSizeSelect || !elements.results || !elements.low || !elements.medium || !elements.notQualified || !elements.error) {
    return;
  }

  populateCountyOptions(countySelect, data);
  populateHouseholdSizeOptions(householdSizeSelect);
  clearResults(elements);

  function updateRanges() {
    const county = countySelect.value;
    const householdSize = Number(householdSizeSelect.value);

    if (!county || !householdSize) {
      clearResults(elements);
      return;
    }

    const thresholds = extractThresholds(data, county, householdSize);
    if (!thresholds) {
      clearResults(elements);
      elements.error.textContent = 'Income thresholds are unavailable for this county and household size.';
      showElement(elements.error);
      return;
    }

    renderRanges(elements, thresholds);
  }

  countySelect.addEventListener('change', updateRanges);
  householdSizeSelect.addEventListener('change', updateRanges);
}

function initQiLookup() {
  if (typeof qiLookupIncomeData !== 'object' || qiLookupIncomeData === null) {
    const errorElement = document.querySelector('[data-error]');
    if (errorElement) {
      errorElement.textContent = 'Unable to load income lookup data right now. Please try again later.';
      errorElement.classList.remove('hidden');
    }
    console.error('qiLookupIncomeData is missing or invalid.');
    return;
  }

  setupWidget(qiLookupIncomeData);
}

window.addEventListener('DOMContentLoaded', initQiLookup);
