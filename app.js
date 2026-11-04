
const BOTTLES = [
  { id: "grey-goose", name: "Grey Goose", category: "Vodka" },
  { id: "ocean-vodka", name: "Ocean Organic Vodka", category: "Vodka" },
  { id: "prairie-vodka", name: "Prairie Organic Vodka", category: "Vodka" },
  { id: "titos", name: "Tito's Handmade Vodka", category: "Vodka" },

  { id: "gray-whale", name: "Gray Whale Gin", category: "Gin" },
  { id: "bombay", name: "Bombay Sapphire", category: "Gin" },
  { id: "gunpowder", name: "Drumshanbo Gunpowder Gin", category: "Gin" },
  { id: "house-gin", name: "House Gin", category: "Gin" },

  { id: "lalo", name: "LALO Tequila Blanco", category: "Tequila" },
  { id: "casamigos-blanco", name: "Casamigos Blanco", category: "Tequila" },
  { id: "casamigos-reposado", name: "Casamigos Reposado", category: "Tequila" },
  { id: "espolon", name: "Espolòn Blanco", category: "Tequila" },
  { id: "don-julio-1942", name: "Don Julio 1942", category: "Tequila" },

  { id: "leblon", name: "Leblon Cachaça", category: "Cachaça" },
  { id: "diplomatico", name: "Diplomático Mantuano", category: "Rum" },
  { id: "bacardi", name: "Bacardi", category: "Rum" },

  { id: "woodford", name: "Woodford Reserve", category: "Bourbon" },
  { id: "knob-creek", name: "Knob Creek", category: "Bourbon" },

  { id: "hibiki", name: "Hibiki", category: "Japanese Whisky" },
  { id: "yamazaki-12", name: "Yamazaki 12", category: "Japanese Whisky" },
  { id: "macallan-12", name: "The Macallan 12", category: "Scotch" },
  { id: "laphroaig", name: "Laphroaig", category: "Scotch" },

  { id: "giffard-lychee", name: "Giffard Lychee", category: "Liqueur" },
  { id: "cointreau", name: "Cointreau", category: "Liqueur" },
  { id: "mr-black", name: "Mr Black", category: "Coffee Liqueur" },

  { id: "aperol", name: "Aperol", category: "Aperitivo" },
  { id: "select", name: "Select Aperitivo", category: "Aperitivo" },
  { id: "martini-rosso", name: "Martini Rosso", category: "Vermouth" },

  { id: "a-to-z-pinot", name: "A to Z Pinot Noir", category: "Wine" },
];

const STORAGE_KEY = "barStockPrototypeV2";

const DEFAULT_DATABASE = {
  days: {},
  pars: {},
};

let database = loadDatabase();
let currentBottleId = null;

const elements = {
  datePicker: document.getElementById("datePicker"),
  bottleList: document.getElementById("bottleList"),
  bottleDialog: document.getElementById("bottleDialog"),
  copyDialog: document.getElementById("copyDialog"),

  todayButton: document.getElementById("todayButton"),
  copyButton: document.getElementById("copyButton"),
  resetButton: document.getElementById("resetButton"),

  searchInput: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),

  progressText: document.getElementById("progressText"),
  progressPercent: document.getElementById("progressPercent"),
  progressBar: document.getElementById("progressBar"),

  summaryStats: document.getElementById("summaryStats"),
  summaryList: document.getElementById("summaryList"),

  historyList: document.getElementById("historyList"),

  modalVisual: document.getElementById("modalVisual"),
  modalCategory: document.getElementById("modalCategory"),
  modalName: document.getElementById("modalName"),
  modalStatus: document.getElementById("modalStatus"),
  modalTotal: document.getElementById("modalTotal"),

  saveBottleButton: document.getElementById("saveBottleButton"),

  copyDateSelect: document.getElementById("copyDateSelect"),
  confirmCopyButton: document.getElementById("confirmCopyButton"),
};

function loadDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(DEFAULT_DATABASE);
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error("Could not load saved inventory data.", error);

    return structuredClone(DEFAULT_DATABASE);
  }
}

function saveDatabase() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(database)
  );
}

function getLocalDateISO() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;

  return new Date(now - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function ensureDayExists(date) {
  if (!database.days[date]) {
    database.days[date] = {};
  }
}

function getCurrentDayData() {
  const date = elements.datePicker.value;

  ensureDayExists(date);

  return database.days[date];
}

function getBottleData(bottleId) {
  const dayData = getCurrentDayData();

  return (
    dayData[bottleId] ?? {
      main: 0,
      dragon: 0,
      storage: 0,
      counted: false,
    }
  );
}

function getBottleTotal(data) {
  const total =
    Number(data.main || 0) +
    Number(data.dragon || 0) +
    Number(data.storage || 0);

  return Number(total.toFixed(2));
}

function getDefaultStatus(total) {
  if (total <= 3) {
    return "very-low";
  }

  if (total <= 7) {
    return "low";
  }

  return "in-stock";
}

function getBottleStatus(bottleId, data) {
  if (!data.counted) {
    return "uncounted";
  }

  const total = getBottleTotal(data);
  const customPar = database.pars[bottleId];

  if (!customPar) {
    return getDefaultStatus(total);
  }

  if (total <= customPar.veryLowMax) {
    return "very-low";
  }

  if (total <= customPar.lowMax) {
    return "low";
  }

  return "in-stock";
}

function getStatusLabel(status) {
  const labels = {
    "very-low": "VERY LOW",
    low: "LOW",
    "in-stock": "IN STOCK",
    uncounted: "NOT COUNTED",
  };

  return labels[status];
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function formatNumber(value) {
  const number = Number(value || 0);

  if (Number.isInteger(number)) {
    return String(number);
  }

  return number
    .toFixed(1)
    .replace(/\.0$/, "");
}

function getStatusTextClass(status) {
  return `status-text status-text--${status}`;
}

function getStatusPillClass(status) {
  return `status-pill status-pill--${status}`;
}

function renderApp() {
  renderInventory();
  renderSummary();
  renderHistory();
  renderProgress();
}

function renderInventory() {
  const query = elements.searchInput.value
    .trim()
    .toLowerCase();

  const statusFilter = elements.statusFilter.value;
  const dayData = getCurrentDayData();

  const visibleBottles = BOTTLES.filter((bottle) => {
    const data =
      dayData[bottle.id] ?? {
        main: 0,
        dragon: 0,
        storage: 0,
        counted: false,
      };

    const status = getBottleStatus(
      bottle.id,
      data
    );

    const matchesSearch =
      !query ||
      bottle.name.toLowerCase().includes(query) ||
      bottle.category.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  elements.bottleList.innerHTML = "";

  if (visibleBottles.length === 0) {
    elements.bottleList.innerHTML = `
      <div class="empty-state">
        No bottles match this filter.
      </div>
    `;

    return;
  }

  for (const bottle of visibleBottles) {
    const data =
      dayData[bottle.id] ?? {
        main: 0,
        dragon: 0,
        storage: 0,
        counted: false,
      };

    const status = getBottleStatus(
      bottle.id,
      data
    );

    const total = getBottleTotal(data);

    const card = document.createElement("button");

    card.type = "button";
    card.className = "bottle-card";

    card.innerHTML = `
      <div
        class="bottle-thumb"
        aria-hidden="true"
      >
        ${getInitials(bottle.name)}
      </div>

      <div>
        <div class="bottle-name">
          ${bottle.name}
        </div>

        <div class="bottle-meta">
          ${bottle.category}
          · Main ${formatNumber(data.main)}
          · Dragon ${formatNumber(data.dragon)}
          · Storage ${formatNumber(data.storage)}
        </div>
      </div>

      <div class="bottle-card__right">
        <div class="total-number">
          ${data.counted ? formatNumber(total) : "—"}
        </div>

        <div class="${getStatusTextClass(status)}">
          ${getStatusLabel(status)}
        </div>
      </div>
    `;

    card.addEventListener(
      "click",
      () => openBottleDialog(bottle.id)
    );

    elements.bottleList.appendChild(card);
  }
}

function renderProgress() {
  const dayData = getCurrentDayData();

  const counted = BOTTLES.filter(
    (bottle) => dayData[bottle.id]?.counted
  ).length;

  const percent = Math.round(
    (counted / BOTTLES.length) * 100
  );

  elements.progressText.textContent =
    `${counted} of ${BOTTLES.length} counted`;

  elements.progressPercent.textContent =
    `${percent}%`;

  elements.progressBar.style.width =
    `${percent}%`;
}

function renderSummary() {
  const dayData = getCurrentDayData();

  const statusOrder = {
    "very-low": 0,
    low: 1,
    "in-stock": 2,
    uncounted: 3,
  };

  const rows = BOTTLES.map((bottle) => {
    const data =
      dayData[bottle.id] ?? {
        main: 0,
        dragon: 0,
        storage: 0,
        counted: false,
      };

    return {
      bottle,
      data,
      status: getBottleStatus(
        bottle.id,
        data
      ),
      total: getBottleTotal(data),
    };
  }).sort((first, second) => {
    const statusDifference =
      statusOrder[first.status] -
      statusOrder[second.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return first.bottle.name.localeCompare(
      second.bottle.name
    );
  });

  const countedRows = rows.filter(
    (row) => row.data.counted
  );

  const veryLowCount = countedRows.filter(
    (row) => row.status === "very-low"
  ).length;

  const lowCount = countedRows.filter(
    (row) => row.status === "low"
  ).length;

  const inStockCount = countedRows.filter(
    (row) => row.status === "in-stock"
  ).length;

  elements.summaryStats.textContent =
    `${veryLowCount} very low · ` +
    `${lowCount} low · ` +
    `${inStockCount} in stock`;

  elements.summaryList.innerHTML = rows
    .map((row) => {
      return `
        <article class="summary-row">
          <div>
            <div class="bottle-name">
              ${row.bottle.name}
            </div>

            <div class="summary-row__numbers">
              Main ${formatNumber(row.data.main)}
              · Dragon ${formatNumber(row.data.dragon)}
              · Storage ${formatNumber(row.data.storage)}
            </div>

            <div class="${getStatusPillClass(row.status)}">
              ${getStatusLabel(row.status)}
            </div>
          </div>

          <div class="total-number">
            ${row.data.counted ? formatNumber(row.total) : "—"}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderHistory() {
  const dates = Object.keys(database.days)
    .sort()
    .reverse();

  if (dates.length === 0) {
    elements.historyList.innerHTML = `
      <div class="empty-state">
        No saved dates yet.
      </div>
    `;

    return;
  }

  elements.historyList.innerHTML = dates
    .map((date) => {
      const dayData = database.days[date];

      const counted = BOTTLES.filter(
        (bottle) => dayData[bottle.id]?.counted
      ).length;

      return `
        <article class="history-row">
          <div>
            <div class="bottle-name">
              ${date}
            </div>

            <div class="bottle-meta">
              ${counted}/${BOTTLES.length} bottles counted
            </div>
          </div>

          <button
            type="button"
            data-open-date="${date}"
          >
            Open
          </button>
        </article>
      `;
    })
    .join("");

  document
    .querySelectorAll("[data-open-date]")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          elements.datePicker.value =
            button.dataset.openDate;

          renderApp();
          switchView("inventoryView");

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      );
    });
}

function openBottleDialog(bottleId) {
  currentBottleId = bottleId;

  const bottle = BOTTLES.find(
    (item) => item.id === bottleId
  );

  const data = getBottleData(bottleId);

  elements.modalName.textContent =
    bottle.name;

  elements.modalCategory.textContent =
    bottle.category;

  elements.modalVisual.textContent =
    getInitials(bottle.name);

  document
    .querySelectorAll(".counter__input")
    .forEach((input) => {
      input.value = formatNumber(
        data[input.dataset.location]
      );
    });

  updateModalTotal();

  elements.bottleDialog.showModal();
}

function updateModalTotal() {
  const values = {};

  document
    .querySelectorAll(".counter__input")
    .forEach((input) => {
      values[input.dataset.location] =
        Math.max(
          0,
          Number(input.value || 0)
        );
    });

  const total = getBottleTotal(values);
  const status = getDefaultStatus(total);

  elements.modalTotal.textContent =
    formatNumber(total);

  elements.modalStatus.className =
    getStatusPillClass(status);

  elements.modalStatus.textContent =
    getStatusLabel(status);
}

function saveCurrentBottle() {
  const dayData = getCurrentDayData();

  const record = {
    counted: true,
  };

  document
    .querySelectorAll(".counter__input")
    .forEach((input) => {
      record[input.dataset.location] =
        Math.max(
          0,
          Number(input.value || 0)
        );
    });

  dayData[currentBottleId] = record;

  saveDatabase();

  elements.bottleDialog.close();

  renderApp();
}

function openCopyDialog() {
  const currentDate =
    elements.datePicker.value;

  const previousDates = Object.keys(
    database.days
  )
    .filter((date) => {
      return (
        date !== currentDate &&
        Object.keys(database.days[date]).length > 0
      );
    })
    .sort()
    .reverse();

  if (previousDates.length === 0) {
    alert("No previous saved inventory yet.");

    return;
  }

  elements.copyDateSelect.innerHTML =
    previousDates
      .map((date) => {
        return `
          <option value="${date}">
            ${date}
          </option>
        `;
      })
      .join("");

  elements.copyDialog.showModal();
}

function copyInventoryFromSelectedDate() {
  const sourceDate =
    elements.copyDateSelect.value;

  const targetDate =
    elements.datePicker.value;

  database.days[targetDate] =
    structuredClone(
      database.days[sourceDate] ?? {}
    );

  saveDatabase();

  elements.copyDialog.close();

  renderApp();
}

function clearCurrentDate() {
  const date = elements.datePicker.value;

  const confirmed = window.confirm(
    `Clear all inventory values for ${date}?`
  );

  if (!confirmed) {
    return;
  }

  database.days[date] = {};

  saveDatabase();
  renderApp();
}

function switchView(viewId) {
  document
    .querySelectorAll(".view")
    .forEach((view) => {
      view.classList.toggle(
        "view--active",
        view.id === viewId
      );
    });

  document
    .querySelectorAll(".nav-button")
    .forEach((button) => {
      button.classList.toggle(
        "nav-button--active",
        button.dataset.view === viewId
      );
    });

  if (viewId === "summaryView") {
    renderSummary();
  }

  if (viewId === "historyView") {
    renderHistory();
  }
}

function initializeCounterButtons() {
  document
    .querySelectorAll(".counter__button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const location =
            button.dataset.location;

          const input =
            document.querySelector(
              `.counter__input[data-location="${location}"]`
            );

          const currentValue =
            Number(input.value || 0);

          const change =
            button.classList.contains(
              "counter__button--plus"
            )
              ? 1
              : -1;

          input.value = formatNumber(
            Math.max(
              0,
              currentValue + change
            )
          );

          updateModalTotal();
        }
      );
    });
}

function initializeCounterInputs() {
  document
    .querySelectorAll(".counter__input")
    .forEach((input) => {
      input.addEventListener(
        "input",
        updateModalTotal
      );

      input.addEventListener(
        "focus",
        () => input.select()
      );
    });
}

function initializeNavigation() {
  document
    .querySelectorAll(".nav-button")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => switchView(
          button.dataset.view
        )
      );
    });
}

function initializeApp() {
  elements.datePicker.value =
    getLocalDateISO();

  ensureDayExists(
    elements.datePicker.value
  );

  saveDatabase();

  elements.datePicker.addEventListener(
    "change",
    () => {
      ensureDayExists(
        elements.datePicker.value
      );

      saveDatabase();
      renderApp();
    }
  );

  elements.todayButton.addEventListener(
    "click",
    () => {
      elements.datePicker.value =
        getLocalDateISO();

      ensureDayExists(
        elements.datePicker.value
      );

      saveDatabase();
      renderApp();
    }
  );

  elements.searchInput.addEventListener(
    "input",
    renderInventory
  );

  elements.statusFilter.addEventListener(
    "change",
    renderInventory
  );

  elements.resetButton.addEventListener(
    "click",
    clearCurrentDate
  );

  elements.copyButton.addEventListener(
    "click",
    openCopyDialog
  );

  elements.confirmCopyButton.addEventListener(
    "click",
    copyInventoryFromSelectedDate
  );

  elements.saveBottleButton.addEventListener(
    "click",
    saveCurrentBottle
  );

  initializeCounterButtons();
  initializeCounterInputs();
  initializeNavigation();

  renderApp();
}

initializeApp();
