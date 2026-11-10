
/* ============================================================
   Inventory Hub
   ------------------------------------------------------------
   A client-side prototype built for GitHub Pages.

   Persistence:
   - localStorage keeps assortment, inventory counts, and settings.
   - Uploaded images are compressed before being stored.

   Mobile behavior:
   - Browser zoom is deliberately disabled.
   - Double-tap and gesture zoom are blocked so rapid inventory
     tapping behaves like an app rather than a normal web page.
============================================================ */

const STORAGE_KEY = "plantaInventoryHubV3";

/* ============================================================
   Default data
============================================================ */

const DEFAULT_BAR_ITEMS = [
  {
    id: "grey-goose",
    name: "Grey Goose",
    category: "Vodka",
    image: "assets/bottles/grey-goose.jpg",
  },
  {
    id: "ocean-vodka",
    name: "Ocean Organic Vodka",
    category: "Vodka",
    image: "assets/bottles/ocean-vodka.jpg",
  },
  {
    id: "prairie-vodka",
    name: "Prairie Organic Vodka",
    category: "Vodka",
    image: "assets/bottles/prairie.jpg",
  },
  {
    id: "titos",
    name: "Tito's Handmade Vodka",
    category: "Vodka",
    image: "assets/bottles/titos.jpg",
  },
  {
    id: "gray-whale",
    name: "Gray Whale Gin",
    category: "Gin",
    image: "assets/bottles/gray-whale.jpg",
  },
  {
    id: "bombay",
    name: "Bombay Sapphire",
    category: "Gin",
    image: "assets/bottles/bombay.jpg",
  },
  {
    id: "gunpowder",
    name: "Drumshanbo Gunpowder Gin",
    category: "Gin",
    image: "assets/bottles/gunpowder.jpg",
  },
  {
    id: "house-gin",
    name: "House Gin",
    category: "Gin",
    image: "assets/bottles/house-gin.jpg",
  },
  {
    id: "lalo",
    name: "LALO Tequila Blanco",
    category: "Tequila",
    image: "assets/bottles/lalo.jpg",
  },
  {
    id: "casamigos-blanco",
    name: "Casamigos Blanco",
    category: "Tequila",
    image: "assets/bottles/casamigos-blanco.jpg",
  },
  {
    id: "casamigos-reposado",
    name: "Casamigos Reposado",
    category: "Tequila",
    image: "assets/bottles/casamigos-reposado.jpg",
  },
  {
    id: "espolon",
    name: "Espolòn Blanco",
    category: "Tequila",
    image: "assets/bottles/espolon.jpg",
  },
  {
    id: "don-julio-1942",
    name: "Don Julio 1942",
    category: "Tequila",
    image: "assets/bottles/don-julio-1942.jpg",
  },
  {
    id: "leblon",
    name: "Leblon Cachaça",
    category: "Cachaça",
    image: "assets/bottles/leblon.jpg",
  },
  {
    id: "diplomatico",
    name: "Diplomático Mantuano",
    category: "Rum",
    image: "assets/bottles/diplomatico.jpg",
  },
  {
    id: "bacardi",
    name: "Bacardi Superior",
    category: "Rum",
    image: "assets/bottles/bacardi.jpg",
  },
  {
    id: "woodford",
    name: "Woodford Reserve",
    category: "Bourbon",
    image: "assets/bottles/woodford.jpg",
  },
  {
    id: "knob-creek",
    name: "Knob Creek",
    category: "Bourbon",
    image: "assets/bottles/knob-creek.jpg",
  },
  {
    id: "hibiki",
    name: "Hibiki",
    category: "Japanese Whisky",
    image: "assets/bottles/hibiki.jpg",
  },
  {
    id: "toki",
    name: "Suntory Toki",
    category: "Japanese Whisky",
    image: "assets/bottles/toki.jpg",
  },
  {
    id: "yamazaki-12",
    name: "Yamazaki 12",
    category: "Japanese Whisky",
    image: "assets/bottles/yamazaki-12.jpg",
  },
  {
    id: "macallan-12",
    name: "The Macallan 12",
    category: "Scotch",
    image: "assets/bottles/macallan-12.jpg",
  },
  {
    id: "laphroaig",
    name: "Laphroaig",
    category: "Scotch",
    image: "assets/bottles/laphroaig.jpg",
  },
  {
    id: "giffard-lychee",
    name: "Giffard Lychee",
    category: "Liqueur",
    image: "assets/bottles/giffard-lychee.jpg",
  },
  {
    id: "cointreau",
    name: "Cointreau",
    category: "Liqueur",
    image: "assets/bottles/cointreau.jpg",
  },
  {
    id: "mr-black",
    name: "Mr Black",
    category: "Coffee Liqueur",
    image: "assets/bottles/mr-black.jpg",
  },
  {
    id: "aperol",
    name: "Aperol",
    category: "Aperitivo",
    image: "assets/bottles/aperol.jpg",
  },
  {
    id: "select",
    name: "Select Aperitivo",
    category: "Aperitivo",
    image: "assets/bottles/select.jpg",
  },
  {
    id: "martini-rosso",
    name: "Martini Rosso",
    category: "Vermouth",
    image: "assets/bottles/martini-rosso.jpg",
  },
  {
    id: "a-to-z-pinot",
    name: "A to Z Pinot Noir",
    category: "Wine",
    image: "assets/bottles/a-to-z-pinot.jpg",
  },
];

const DEFAULT_SUPPLY_ITEMS = [
  "To-Go Box Sushi",
  "To-Go Box Small",
  "To-Go Box Medium",
  "To-Go Box Large",
  "To-Go Lid Sushi",
  "To-Go Lid Small",
  "To-Go Lid Medium",
  "To-Go Lid Large",
  "To-Go Small Sauce Cup",
  "To-Go Small Sauce Cup Lid",
  "To-Go Drink Cup",
  "To-Go Drink Cup Lid",
  "Straws Small",
  "Straws Big",
  "To-Go Bag Small",
  "To-Go Bag Medium",
  "To-Go Bag Large",
].map((name, index) => {
  let image = "assets/supplies/containers.jpg";

  if (name.toLowerCase().includes("lid")) {
    image = "assets/supplies/lids.jpg";
  }

  if (
    name.toLowerCase().includes("bag") ||
    name.toLowerCase().includes("straw")
  ) {
    image = "assets/supplies/cases.jpg";
  }

  return {
    id: `supply-${index + 1}`,
    name,
    category: getDefaultSupplyCategory(name),
    image,
    sleevesPerCase: 6,

    /*
      Prototype thresholds.
      We can tune these later per item based on actual usage and storage space.
    */
    criticalBelow: 1,
    lowBelow: 2,
    overstockAbove: 4,
  };
});

function getDefaultSupplyCategory(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("lid")) {
    return "Lids";
  }

  if (normalized.includes("cup")) {
    return "Cups";
  }

  if (normalized.includes("straw")) {
    return "Straws";
  }

  if (normalized.includes("bag")) {
    return "Bags";
  }

  return "Containers";
}

const DEFAULT_DATABASE = {
  barItems: DEFAULT_BAR_ITEMS,
  supplyItems: DEFAULT_SUPPLY_ITEMS,

  barCounts: {},
  supplyCounts: {},

  settings: {
    barPars: {},
  },
};

/* ============================================================
   State
============================================================ */

let database = loadDatabase();

let currentModule = null;
let currentPageId = "homePage";

let currentBarItemId = null;
let currentSupplyItemId = null;

let editorMode = null;
let editorItemId = null;

let barEditMode = false;
let supplyEditMode = false;

let pendingCopyType = null;

/* ============================================================
   DOM references
============================================================ */

const $ = (id) => document.getElementById(id);

const elements = {
  pageTitle: $("pageTitle"),
  backButton: $("backButton"),
  homeButton: $("homeButton"),

  homeBarLastCount: $("homeBarLastCount"),
  homeBarAttention: $("homeBarAttention"),
  homeSupplyLastCount: $("homeSupplyLastCount"),
  homeSupplyAttention: $("homeSupplyAttention"),

  moduleDialog: $("moduleDialog"),
  moduleDialogEyebrow: $("moduleDialogEyebrow"),
  moduleDialogTitle: $("moduleDialogTitle"),
  moduleCurrentButton: $("moduleCurrentButton"),
  moduleCountButton: $("moduleCountButton"),
  moduleCountLabel: $("moduleCountLabel"),

  barLatestDate: $("barLatestDate"),
  barStats: $("barStats"),
  barOverview: $("barOverview"),
  barDetail: $("barDetail"),
  barEditButton: $("barEditButton"),
  addBarItemButton: $("addBarItemButton"),

  barCountDate: $("barCountDate"),
  barProgressText: $("barProgressText"),
  barProgressPercent: $("barProgressPercent"),
  barProgressBar: $("barProgressBar"),
  barCopyButton: $("barCopyButton"),
  barClearButton: $("barClearButton"),
  barSearchInput: $("barSearchInput"),
  barStatusFilter: $("barStatusFilter"),
  barCountList: $("barCountList"),

  barCountDialog: $("barCountDialog"),
  barModalImage: $("barModalImage"),
  barModalCategory: $("barModalCategory"),
  barModalName: $("barModalName"),
  barModalStatus: $("barModalStatus"),
  barLocationList: $("barLocationList"),
  barModalTotal: $("barModalTotal"),
  saveBarCountButton: $("saveBarCountButton"),

  supplyLatestDate: $("supplyLatestDate"),
  supplyStats: $("supplyStats"),
  supplyOverview: $("supplyOverview"),
  supplyDetail: $("supplyDetail"),
  supplyEditButton: $("supplyEditButton"),
  addSupplyItemButton: $("addSupplyItemButton"),

  supplyCountDate: $("supplyCountDate"),
  supplyProgressText: $("supplyProgressText"),
  supplyProgressPercent: $("supplyProgressPercent"),
  supplyProgressBar: $("supplyProgressBar"),
  supplyCopyButton: $("supplyCopyButton"),
  supplyClearButton: $("supplyClearButton"),
  supplySearchInput: $("supplySearchInput"),
  supplyStatusFilter: $("supplyStatusFilter"),
  supplyCountList: $("supplyCountList"),

  supplyCountDialog: $("supplyCountDialog"),
  supplyModalImage: $("supplyModalImage"),
  supplyModalCategory: $("supplyModalCategory"),
  supplyModalName: $("supplyModalName"),
  supplyModalStatus: $("supplyModalStatus"),
  supplyCasesMinus: $("supplyCasesMinus"),
  supplyCasesInput: $("supplyCasesInput"),
  supplyCasesPlus: $("supplyCasesPlus"),
  supplySleevesMinus: $("supplySleevesMinus"),
  supplySleevesInput: $("supplySleevesInput"),
  supplySleevesPlus: $("supplySleevesPlus"),
  supplySleevesHelp: $("supplySleevesHelp"),
  supplyModalTotal: $("supplyModalTotal"),
  saveSupplyCountButton: $("saveSupplyCountButton"),

  itemEditorDialog: $("itemEditorDialog"),
  editorEyebrow: $("editorEyebrow"),
  editorTitle: $("editorTitle"),
  editorName: $("editorName"),
  editorCategory: $("editorCategory"),
  editorImage: $("editorImage"),
  editorSleevesField: $("editorSleevesField"),
  editorSleevesPerCase: $("editorSleevesPerCase"),
  saveEditorButton: $("saveEditorButton"),

  copyDateDialog: $("copyDateDialog"),
  copyDateSelect: $("copyDateSelect"),
  confirmCopyDateButton: $("confirmCopyDateButton"),
};

/* ============================================================
   Persistence
============================================================ */

function loadDatabase() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredClone(DEFAULT_DATABASE);
    }

    const parsed = JSON.parse(saved);

    /*
      Merge missing top-level fields so future prototype upgrades
      do not immediately break older local data.
    */
    return {
      ...structuredClone(DEFAULT_DATABASE),
      ...parsed,
      settings: {
        ...structuredClone(DEFAULT_DATABASE.settings),
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    console.error("Could not load inventory database.", error);

    return structuredClone(DEFAULT_DATABASE);
  }
}

function saveDatabase() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(database)
  );
}

/* ============================================================
   Utility helpers
============================================================ */

function getLocalDateISO() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;

  return new Date(now - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function formatDateForDisplay(dateString) {
  if (!dateString) {
    return "No count yet";
  }

  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
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

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLatestCountDate(countCollection) {
  const dates = Object.keys(countCollection)
    .filter((date) => {
      return Object.keys(
        countCollection[date] || {}
      ).length > 0;
    })
    .sort();

  return dates.at(-1) || null;
}

function getStatusPillClass(status) {
  return `status-pill status-pill--${status}`;
}

function getBarTotal(data) {
  return Number(
    (
      Number(data.main || 0) +
      Number(data.dragon || 0) +
      Number(data.storage || 0)
    ).toFixed(2)
  );
}

function getBarStatus(itemId, data) {
  if (!data?.counted) {
    return "uncounted";
  }

  const total = getBarTotal(data);
  const customPar =
    database.settings.barPars[itemId];

  if (customPar) {
    if (total <= customPar.veryLowMax) {
      return "very-low";
    }

    if (total <= customPar.lowMax) {
      return "low";
    }

    return "in-stock";
  }

  if (total <= 3) {
    return "very-low";
  }

  if (total <= 7) {
    return "low";
  }

  return "in-stock";
}

function getBarStatusLabel(status) {
  return {
    "very-low": "VERY LOW",
    low: "LOW",
    "in-stock": "IN STOCK",
    uncounted: "NOT COUNTED",
  }[status];
}

function getSupplyEquivalentCases(item, data) {
  const sleevesPerCase =
    Number(item.sleevesPerCase || 6);

  return Number(
    (
      Number(data.cases || 0) +
      Number(data.sleeves || 0) / sleevesPerCase
    ).toFixed(2)
  );
}

function getSupplyStatus(item, data) {
  if (!data?.counted) {
    return "uncounted";
  }

  const total = getSupplyEquivalentCases(
    item,
    data
  );

  if (total < item.criticalBelow) {
    return "critical";
  }

  if (total < item.lowBelow) {
    return "low";
  }

  if (total > item.overstockAbove) {
    return "overstock";
  }

  return "in-stock";
}

function getSupplyStatusLabel(status) {
  return {
    critical: "CRITICAL",
    low: "LOW",
    "in-stock": "IN STOCK",
    overstock: "OVERSTOCK",
    uncounted: "NOT COUNTED",
  }[status];
}

function getItemById(collection, id) {
  return collection.find(
    (item) => item.id === id
  );
}

function ensureCountDate(collection, date) {
  if (!collection[date]) {
    collection[date] = {};
  }
}

/* ============================================================
   Navigation
============================================================ */

function showPage(pageId) {
  document
    .querySelectorAll(".page")
    .forEach((page) => {
      page.classList.toggle(
        "page--active",
        page.id === pageId
      );
    });

  const page = document.getElementById(pageId);

  currentPageId = pageId;

  elements.pageTitle.textContent =
    page.dataset.pageTitle || "Inventory Hub";

  const isHome = pageId === "homePage";

  elements.backButton.classList.toggle(
    "hidden",
    isHome
  );

  elements.homeButton.classList.toggle(
    "hidden",
    isHome
  );

  renderCurrentPage();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function goBack() {
  if (currentPageId === "homePage") {
    return;
  }

  showPage("homePage");
}

/* ============================================================
   Home rendering
============================================================ */

function renderHome() {
  const latestBarDate =
    getLatestCountDate(database.barCounts);

  const latestSupplyDate =
    getLatestCountDate(database.supplyCounts);

  elements.homeBarLastCount.textContent =
    latestBarDate
      ? `Last count: ${formatDateForDisplay(latestBarDate)}`
      : "No count yet";

  elements.homeSupplyLastCount.textContent =
    latestSupplyDate
      ? `Last count: ${formatDateForDisplay(latestSupplyDate)}`
      : "No count yet";

  if (latestBarDate) {
    const data =
      database.barCounts[latestBarDate];

    const attentionCount =
      database.barItems.filter((item) => {
        const status = getBarStatus(
          item.id,
          data[item.id]
        );

        return (
          status === "very-low" ||
          status === "low"
        );
      }).length;

    elements.homeBarAttention.textContent =
      `${attentionCount} items need attention`;
  } else {
    elements.homeBarAttention.textContent =
      "Start a bottle count";
  }

  if (latestSupplyDate) {
    const data =
      database.supplyCounts[latestSupplyDate];

    const attentionCount =
      database.supplyItems.filter((item) => {
        const status = getSupplyStatus(
          item,
          data[item.id]
        );

        return (
          status === "critical" ||
          status === "low" ||
          status === "overstock"
        );
      }).length;

    elements.homeSupplyAttention.textContent =
      `${attentionCount} items need attention`;
  } else {
    elements.homeSupplyAttention.textContent =
      "Start a packaging count";
  }
}

/* ============================================================
   Module choice modal
============================================================ */

function openModuleDialog(moduleName) {
  currentModule = moduleName;

  if (moduleName === "bar") {
    elements.moduleDialogEyebrow.textContent =
      "Liquor · wine · spirits";

    elements.moduleDialogTitle.textContent =
      "Bar Inventory";

    elements.moduleCountLabel.textContent =
      "Start bottle count";
  } else {
    elements.moduleDialogEyebrow.textContent =
      "Cups · lids · boxes · bags";

    elements.moduleDialogTitle.textContent =
      "Packaging & To-Go";

    elements.moduleCountLabel.textContent =
      "Start packaging count";
  }

  elements.moduleDialog.showModal();
}

function openCurrentStockFromModule() {
  elements.moduleDialog.close();

  if (currentModule === "bar") {
    showPage("barCurrentPage");
  } else {
    showPage("supplyCurrentPage");
  }
}

function openCountFromModule() {
  elements.moduleDialog.close();

  if (currentModule === "bar") {
    showPage("barCountPage");
  } else {
    showPage("supplyCountPage");
  }
}

/* ============================================================
   Bar current stock
============================================================ */

function renderBarCurrentStock() {
  const latestDate =
    getLatestCountDate(database.barCounts);

  const latestData =
    latestDate
      ? database.barCounts[latestDate]
      : {};

  elements.barLatestDate.textContent =
    latestDate
      ? `Latest completed snapshot: ${formatDateForDisplay(latestDate)}`
      : "No bottle count has been saved yet.";

  const rows = database.barItems.map(
    (item) => {
      const data =
        latestData[item.id] || {
          main: 0,
          dragon: 0,
          storage: 0,
          counted: false,
        };

      return {
        item,
        data,
        total: getBarTotal(data),
        status: getBarStatus(
          item.id,
          data
        ),
      };
    }
  );

  const countedRows = rows.filter(
    (row) => row.data.counted
  );

  const counts = {
    total: database.barItems.length,
    veryLow: countedRows.filter(
      (row) => row.status === "very-low"
    ).length,
    low: countedRows.filter(
      (row) => row.status === "low"
    ).length,
    inStock: countedRows.filter(
      (row) => row.status === "in-stock"
    ).length,
  };

  elements.barStats.innerHTML = [
    metricCard("Total SKUs", counts.total),
    metricCard("Very Low", counts.veryLow),
    metricCard("Low", counts.low),
    metricCard("In Stock", counts.inStock),
  ].join("");

  renderBarOverview(rows);
  renderBarDetail(rows);
}

function metricCard(label, value) {
  return `
    <article class="metric-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function renderBarOverview(rows) {
  const groups = [
    {
      status: "very-low",
      title: "Very Low",
    },
    {
      status: "low",
      title: "Low",
    },
    {
      status: "in-stock",
      title: "In Stock",
    },
  ];

  elements.barOverview.innerHTML =
    groups
      .map((group) => {
        const groupRows = rows.filter(
          (row) => row.status === group.status
        );

        return `
          <section class="status-column">
            <div class="status-column__header">
              <div>
                <div class="${getStatusPillClass(group.status)}">
                  ${group.title.toUpperCase()}
                </div>
              </div>

              <span class="status-column__count">
                ${groupRows.length}
              </span>
            </div>

            <div class="status-column__items">
              ${
                groupRows.length
                  ? groupRows
                      .slice(0, 10)
                      .map(barMiniCard)
                      .join("")
                  : `
                    <div class="muted">
                      No items in this status.
                    </div>
                  `
              }
            </div>
          </section>
        `;
      })
      .join("");
}

function barMiniCard(row) {
  return `
    <article class="status-mini-card">
      <img
        src="${row.item.image}"
        alt="${row.item.name}"
      />

      <div>
        <strong>${row.item.name}</strong>
        <small>${row.item.category}</small>
      </div>

      <span class="status-mini-card__value">
        ${row.data.counted ? formatNumber(row.total) : "—"}
      </span>
    </article>
  `;
}

function renderBarDetail(rows) {
  const statusOrder = {
    "very-low": 0,
    low: 1,
    "in-stock": 2,
    uncounted: 3,
  };

  const sorted = [...rows].sort(
    (a, b) => {
      const statusDifference =
        statusOrder[a.status] -
        statusOrder[b.status];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return a.item.name.localeCompare(
        b.item.name
      );
    }
  );

  elements.barDetail.innerHTML =
    sorted
      .map((row) => {
        return buildBarCard(
          row.item,
          row.data,
          {
            editMode: barEditMode,
            clickable: false,
          }
        );
      })
      .join("");

  bindBarEditActions();
}

/* ============================================================
   Bar count page
============================================================ */

function getCurrentBarDate() {
  return elements.barCountDate.value;
}

function getCurrentBarDateData() {
  const date = getCurrentBarDate();

  ensureCountDate(
    database.barCounts,
    date
  );

  return database.barCounts[date];
}

function renderBarCountPage() {
  if (!elements.barCountDate.value) {
    elements.barCountDate.value =
      getLocalDateISO();
  }

  ensureCountDate(
    database.barCounts,
    getCurrentBarDate()
  );

  renderBarProgress();
  renderBarCountList();
}

function renderBarProgress() {
  const dayData =
    getCurrentBarDateData();

  const counted =
    database.barItems.filter(
      (item) => dayData[item.id]?.counted
    ).length;

  const total =
    database.barItems.length;

  const percent =
    total > 0
      ? Math.round(
          (counted / total) * 100
        )
      : 0;

  elements.barProgressText.textContent =
    `${counted} of ${total} counted`;

  elements.barProgressPercent.textContent =
    `${percent}%`;

  elements.barProgressBar.style.width =
    `${percent}%`;
}

function renderBarCountList() {
  const dayData =
    getCurrentBarDateData();

  const query =
    elements.barSearchInput.value
      .trim()
      .toLowerCase();

  const filter =
    elements.barStatusFilter.value;

  const items =
    database.barItems.filter((item) => {
      const data =
        dayData[item.id] || {
          main: 0,
          dragon: 0,
          storage: 0,
          counted: false,
        };

      const status =
        getBarStatus(
          item.id,
          data
        );

      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.category
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  elements.barCountList.innerHTML =
    items
      .map((item) => {
        const data =
          dayData[item.id] || {
            main: 0,
            dragon: 0,
            storage: 0,
            counted: false,
          };

        return buildBarCard(
          item,
          data,
          {
            editMode: false,
            clickable: true,
          }
        );
      })
      .join("");

  elements.barCountList
    .querySelectorAll(
      "[data-open-bar-count]"
    )
    .forEach((card) => {
      card.addEventListener(
        "click",
        () => {
          openBarCountDialog(
            card.dataset.openBarCount
          );
        }
      );
    });
}

function buildBarCard(
  item,
  data,
  options = {}
) {
  const total = getBarTotal(data);
  const status =
    getBarStatus(
      item.id,
      data
    );

  const tagName =
    options.clickable
      ? "button"
      : "article";

  const openAttribute =
    options.clickable
      ? `data-open-bar-count="${item.id}"`
      : "";

  const editActions =
    options.editMode
      ? `
        <div class="inventory-card__edit-actions">
          <button
            class="mini-button"
            type="button"
            data-edit-bar-item="${item.id}"
          >
            Edit
          </button>

          <button
            class="mini-button mini-button--danger"
            type="button"
            data-delete-bar-item="${item.id}"
          >
            Delete
          </button>
        </div>
      `
      : "";

  return `
    <${tagName}
      class="inventory-card"
      ${openAttribute}
      ${options.clickable ? 'type="button"' : ""}
    >
      <img
        class="inventory-card__image"
        src="${item.image}"
        alt="${item.name}"
      />

      <div class="inventory-card__body">
        <div>
          <div class="inventory-card__name">
            ${item.name}
          </div>

          <div class="inventory-card__meta">
            ${item.category}
            ${
              data.counted
                ? `· Main ${formatNumber(data.main)}
                   · Dragon ${formatNumber(data.dragon)}
                   · Storage ${formatNumber(data.storage)}`
                : "· Not counted"
            }
          </div>
        </div>

        <div>
          <div class="inventory-card__footer">
            <div class="${getStatusPillClass(status)}">
              ${getBarStatusLabel(status)}
            </div>

            <div class="inventory-card__total">
              ${data.counted ? formatNumber(total) : "—"}
            </div>
          </div>

          ${editActions}
        </div>
      </div>
    </${tagName}>
  `;
}

/* ============================================================
   Bar count dialog
============================================================ */

function openBarCountDialog(itemId) {
  currentBarItemId = itemId;

  const item =
    getItemById(
      database.barItems,
      itemId
    );

  const dayData =
    getCurrentBarDateData();

  const data =
    dayData[itemId] || {
      main: 0,
      dragon: 0,
      storage: 0,
      counted: false,
    };

  elements.barModalImage.src =
    item.image;

  elements.barModalImage.alt =
    item.name;

  elements.barModalCategory.textContent =
    item.category;

  elements.barModalName.textContent =
    item.name;

  elements.barLocationList.innerHTML =
    [
      {
        key: "main",
        label: "Main Bar",
      },
      {
        key: "dragon",
        label: "Dragon Room",
      },
      {
        key: "storage",
        label: "Storage",
      },
    ]
      .map((location) => {
        return `
          <section class="location-card">
            <h3>${location.label}</h3>

            <div
              class="fraction-counter"
              data-location="${location.key}"
            >
              ${fractionButton(
                location.key,
                -0.2
              )}
              ${fractionButton(
                location.key,
                -0.1
              )}
              ${fractionButton(
                location.key,
                -1
              )}

              <input
                class="counter-main-input bar-location-input"
                type="number"
                inputmode="decimal"
                min="0"
                step="0.1"
                value="${formatNumber(
                  data[location.key]
                )}"
                data-location="${location.key}"
                aria-label="${location.label} bottle count"
              />

              ${fractionButton(
                location.key,
                1
              )}
              ${fractionButton(
                location.key,
                0.1
              )}
              ${fractionButton(
                location.key,
                0.2
              )}
            </div>
          </section>
        `;
      })
      .join("");

  bindBarFractionControls();
  updateBarModalTotal();

  elements.barCountDialog.showModal();
}

function fractionButton(
  location,
  amount
) {
  const label =
    amount > 0
      ? `+${amount}`
      : String(amount);

  return `
    <button
      class="counter-step"
      type="button"
      data-location="${location}"
      data-change="${amount}"
    >
      ${label}
    </button>
  `;
}

function bindBarFractionControls() {
  elements.barLocationList
    .querySelectorAll(
      ".counter-step"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const location =
            button.dataset.location;

          const change =
            Number(
              button.dataset.change
            );

          const input =
            elements.barLocationList.querySelector(
              `.bar-location-input[data-location="${location}"]`
            );

          const current =
            Number(
              input.value || 0
            );

          input.value =
            formatNumber(
              Math.max(
                0,
                current + change
              )
            );

          updateBarModalTotal();
        }
      );
    });

  elements.barLocationList
    .querySelectorAll(
      ".bar-location-input"
    )
    .forEach((input) => {
      input.addEventListener(
        "input",
        updateBarModalTotal
      );

      input.addEventListener(
        "focus",
        () => input.select()
      );
    });
}

function updateBarModalTotal() {
  const values = {};

  elements.barLocationList
    .querySelectorAll(
      ".bar-location-input"
    )
    .forEach((input) => {
      values[input.dataset.location] =
        Math.max(
          0,
          Number(input.value || 0)
        );
    });

  const total =
    getBarTotal(values);

  const tempData = {
    ...values,
    counted: true,
  };

  const status =
    getBarStatus(
      currentBarItemId,
      tempData
    );

  elements.barModalTotal.textContent =
    formatNumber(total);

  elements.barModalStatus.className =
    getStatusPillClass(status);

  elements.barModalStatus.textContent =
    getBarStatusLabel(status);
}

function saveBarCount() {
  const dayData =
    getCurrentBarDateData();

  const record = {
    counted: true,
  };

  elements.barLocationList
    .querySelectorAll(
      ".bar-location-input"
    )
    .forEach((input) => {
      record[input.dataset.location] =
        Math.max(
          0,
          Number(input.value || 0)
        );
    });

  dayData[currentBarItemId] =
    record;

  saveDatabase();

  elements.barCountDialog.close();

  renderBarCountPage();
  renderHome();
}

/* ============================================================
   Supply current stock
============================================================ */

function renderSupplyCurrentStock() {
  const latestDate =
    getLatestCountDate(
      database.supplyCounts
    );

  const latestData =
    latestDate
      ? database.supplyCounts[latestDate]
      : {};

  elements.supplyLatestDate.textContent =
    latestDate
      ? `Latest completed snapshot: ${formatDateForDisplay(latestDate)}`
      : "No packaging count has been saved yet.";

  const rows =
    database.supplyItems.map(
      (item) => {
        const data =
          latestData[item.id] || {
            cases: 0,
            sleeves: 0,
            counted: false,
          };

        return {
          item,
          data,
          equivalent:
            getSupplyEquivalentCases(
              item,
              data
            ),
          status:
            getSupplyStatus(
              item,
              data
            ),
        };
      }
    );

  const countedRows =
    rows.filter(
      (row) => row.data.counted
    );

  const counts = {
    total:
      database.supplyItems.length,
    critical:
      countedRows.filter(
        (row) =>
          row.status === "critical"
      ).length,
    low:
      countedRows.filter(
        (row) =>
          row.status === "low"
      ).length,
    overstock:
      countedRows.filter(
        (row) =>
          row.status === "overstock"
      ).length,
  };

  elements.supplyStats.innerHTML =
    [
      metricCard(
        "Total SKUs",
        counts.total
      ),
      metricCard(
        "Critical",
        counts.critical
      ),
      metricCard(
        "Low",
        counts.low
      ),
      metricCard(
        "Overstock",
        counts.overstock
      ),
    ].join("");

  renderSupplyOverview(rows);
  renderSupplyDetail(rows);
}

function renderSupplyOverview(rows) {
  const groups = [
    {
      status: "critical",
      title: "Critical",
    },
    {
      status: "low",
      title: "Low",
    },
    {
      status: "in-stock",
      title: "In Stock",
    },
    {
      status: "overstock",
      title: "Overstock",
    },
  ];

  elements.supplyOverview.innerHTML =
    groups
      .map((group) => {
        const groupRows =
          rows.filter(
            (row) =>
              row.status ===
              group.status
          );

        return `
          <section class="status-column">
            <div class="status-column__header">
              <div class="${getStatusPillClass(group.status)}">
                ${group.title.toUpperCase()}
              </div>

              <span class="status-column__count">
                ${groupRows.length}
              </span>
            </div>

            <div class="status-column__items">
              ${
                groupRows.length
                  ? groupRows
                      .slice(0, 10)
                      .map(supplyMiniCard)
                      .join("")
                  : `
                    <div class="muted">
                      No items in this status.
                    </div>
                  `
              }
            </div>
          </section>
        `;
      })
      .join("");
}

function supplyMiniCard(row) {
  return `
    <article class="status-mini-card">
      <img
        src="${row.item.image}"
        alt="${row.item.name}"
      />

      <div>
        <strong>${row.item.name}</strong>
        <small>${row.item.category}</small>
      </div>

      <span class="status-mini-card__value">
        ${
          row.data.counted
            ? formatNumber(
                row.equivalent
              )
            : "—"
        }
      </span>
    </article>
  `;
}

function renderSupplyDetail(rows) {
  const statusOrder = {
    critical: 0,
    low: 1,
    "in-stock": 2,
    overstock: 3,
    uncounted: 4,
  };

  const sorted =
    [...rows].sort(
      (a, b) => {
        const statusDifference =
          statusOrder[a.status] -
          statusOrder[b.status];

        if (
          statusDifference !== 0
        ) {
          return statusDifference;
        }

        return a.item.name.localeCompare(
          b.item.name
        );
      }
    );

  elements.supplyDetail.innerHTML =
    sorted
      .map((row) => {
        return buildSupplyCard(
          row.item,
          row.data,
          {
            editMode: supplyEditMode,
            clickable: false,
          }
        );
      })
      .join("");

  bindSupplyEditActions();
}

/* ============================================================
   Supply count page
============================================================ */

function getCurrentSupplyDate() {
  return elements.supplyCountDate.value;
}

function getCurrentSupplyDateData() {
  const date =
    getCurrentSupplyDate();

  ensureCountDate(
    database.supplyCounts,
    date
  );

  return database.supplyCounts[date];
}

function renderSupplyCountPage() {
  if (
    !elements.supplyCountDate.value
  ) {
    elements.supplyCountDate.value =
      getLocalDateISO();
  }

  ensureCountDate(
    database.supplyCounts,
    getCurrentSupplyDate()
  );

  renderSupplyProgress();
  renderSupplyCountList();
}

function renderSupplyProgress() {
  const dayData =
    getCurrentSupplyDateData();

  const counted =
    database.supplyItems.filter(
      (item) =>
        dayData[item.id]?.counted
    ).length;

  const total =
    database.supplyItems.length;

  const percent =
    total > 0
      ? Math.round(
          (counted / total) *
            100
        )
      : 0;

  elements.supplyProgressText.textContent =
    `${counted} of ${total} counted`;

  elements.supplyProgressPercent.textContent =
    `${percent}%`;

  elements.supplyProgressBar.style.width =
    `${percent}%`;
}

function renderSupplyCountList() {
  const dayData =
    getCurrentSupplyDateData();

  const query =
    elements.supplySearchInput.value
      .trim()
      .toLowerCase();

  const filter =
    elements.supplyStatusFilter.value;

  const items =
    database.supplyItems.filter(
      (item) => {
        const data =
          dayData[item.id] || {
            cases: 0,
            sleeves: 0,
            counted: false,
          };

        const status =
          getSupplyStatus(
            item,
            data
          );

        const matchesSearch =
          !query ||
          item.name
            .toLowerCase()
            .includes(query) ||
          item.category
            .toLowerCase()
            .includes(query);

        const matchesFilter =
          filter === "all" ||
          status === filter;

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );

  elements.supplyCountList.innerHTML =
    items
      .map((item) => {
        const data =
          dayData[item.id] || {
            cases: 0,
            sleeves: 0,
            counted: false,
          };

        return buildSupplyCard(
          item,
          data,
          {
            editMode: false,
            clickable: true,
          }
        );
      })
      .join("");

  elements.supplyCountList
    .querySelectorAll(
      "[data-open-supply-count]"
    )
    .forEach((card) => {
      card.addEventListener(
        "click",
        () => {
          openSupplyCountDialog(
            card.dataset
              .openSupplyCount
          );
        }
      );
    });
}

function buildSupplyCard(
  item,
  data,
  options = {}
) {
  const equivalent =
    getSupplyEquivalentCases(
      item,
      data
    );

  const status =
    getSupplyStatus(
      item,
      data
    );

  const tagName =
    options.clickable
      ? "button"
      : "article";

  const openAttribute =
    options.clickable
      ? `data-open-supply-count="${item.id}"`
      : "";

  const editActions =
    options.editMode
      ? `
        <div class="inventory-card__edit-actions">
          <button
            class="mini-button"
            type="button"
            data-edit-supply-item="${item.id}"
          >
            Edit
          </button>

          <button
            class="mini-button mini-button--danger"
            type="button"
            data-delete-supply-item="${item.id}"
          >
            Delete
          </button>
        </div>
      `
      : "";

  return `
    <${tagName}
      class="inventory-card"
      ${openAttribute}
      ${options.clickable ? 'type="button"' : ""}
    >
      <img
        class="inventory-card__image"
        src="${item.image}"
        alt="${item.name}"
      />

      <div class="inventory-card__body">
        <div>
          <div class="inventory-card__name">
            ${item.name}
          </div>

          <div class="inventory-card__meta">
            ${item.category}
            ${
              data.counted
                ? `· ${formatNumber(data.cases)} cases
                   · ${formatNumber(data.sleeves)} sleeves`
                : `· ${item.sleevesPerCase} sleeves/case`
            }
          </div>
        </div>

        <div>
          <div class="inventory-card__footer">
            <div class="${getStatusPillClass(status)}">
              ${getSupplyStatusLabel(status)}
            </div>

            <div class="inventory-card__total">
              ${
                data.counted
                  ? `${formatNumber(equivalent)} c`
                  : "—"
              }
            </div>
          </div>

          ${editActions}
        </div>
      </div>
    </${tagName}>
  `;
}

/* ============================================================
   Supply count dialog
============================================================ */

function openSupplyCountDialog(itemId) {
  currentSupplyItemId = itemId;

  const item =
    getItemById(
      database.supplyItems,
      itemId
    );

  const dayData =
    getCurrentSupplyDateData();

  const data =
    dayData[itemId] || {
      cases: 0,
      sleeves: 0,
      counted: false,
    };

  elements.supplyModalImage.src =
    item.image;

  elements.supplyModalImage.alt =
    item.name;

  elements.supplyModalCategory.textContent =
    item.category;

  elements.supplyModalName.textContent =
    item.name;

  elements.supplyCasesInput.value =
    formatNumber(data.cases);

  elements.supplySleevesInput.value =
    formatNumber(data.sleeves);

  elements.supplySleevesHelp.textContent =
    `${item.sleevesPerCase} sleeves = 1 full case in this prototype.`;

  updateSupplyModalTotal();

  elements.supplyCountDialog.showModal();
}

function changeSupplyInput(
  input,
  delta
) {
  const current =
    Number(input.value || 0);

  input.value =
    Math.max(
      0,
      current + delta
    );

  updateSupplyModalTotal();
}

function updateSupplyModalTotal() {
  const item =
    getItemById(
      database.supplyItems,
      currentSupplyItemId
    );

  const data = {
    cases:
      Math.max(
        0,
        Number(
          elements.supplyCasesInput
            .value || 0
        )
      ),
    sleeves:
      Math.max(
        0,
        Number(
          elements.supplySleevesInput
            .value || 0
        )
      ),
    counted: true,
  };

  const equivalent =
    getSupplyEquivalentCases(
      item,
      data
    );

  const status =
    getSupplyStatus(
      item,
      data
    );

  elements.supplyModalTotal.textContent =
    formatNumber(equivalent);

  elements.supplyModalStatus.className =
    getStatusPillClass(status);

  elements.supplyModalStatus.textContent =
    getSupplyStatusLabel(status);
}

function saveSupplyCount() {
  const dayData =
    getCurrentSupplyDateData();

  dayData[currentSupplyItemId] = {
    cases:
      Math.max(
        0,
        Number(
          elements.supplyCasesInput
            .value || 0
        )
      ),
    sleeves:
      Math.max(
        0,
        Number(
          elements.supplySleevesInput
            .value || 0
        )
      ),
    counted: true,
  };

  saveDatabase();

  elements.supplyCountDialog.close();

  renderSupplyCountPage();
  renderHome();
}

/* ============================================================
   Assortment editing
============================================================ */

function toggleBarEditMode() {
  barEditMode = !barEditMode;

  elements.barEditButton.textContent =
    barEditMode
      ? "Done editing"
      : "Edit assortment";

  elements.addBarItemButton.classList.toggle(
    "hidden",
    !barEditMode
  );

  renderBarCurrentStock();
}

function toggleSupplyEditMode() {
  supplyEditMode =
    !supplyEditMode;

  elements.supplyEditButton.textContent =
    supplyEditMode
      ? "Done editing"
      : "Edit assortment";

  elements.addSupplyItemButton.classList.toggle(
    "hidden",
    !supplyEditMode
  );

  renderSupplyCurrentStock();
}

function openItemEditor(
  mode,
  itemId = null
) {
  editorMode = mode;
  editorItemId = itemId;

  const isSupply =
    mode === "supply";

  elements.editorSleevesField.classList.toggle(
    "hidden",
    !isSupply
  );

  let item = null;

  if (itemId) {
    item =
      isSupply
        ? getItemById(
            database.supplyItems,
            itemId
          )
        : getItemById(
            database.barItems,
            itemId
          );
  }

  elements.editorEyebrow.textContent =
    isSupply
      ? "Packaging item"
      : "Bar item";

  elements.editorTitle.textContent =
    item
      ? `Edit ${item.name}`
      : isSupply
        ? "Add packaging item"
        : "Add liquor";

  elements.editorName.value =
    item?.name || "";

  elements.editorCategory.value =
    item?.category || "";

  elements.editorImage.value = "";

  elements.editorSleevesPerCase.value =
    item?.sleevesPerCase || 6;

  elements.itemEditorDialog.showModal();
}

async function saveEditorItem() {
  const name =
    elements.editorName.value.trim();

  const category =
    elements.editorCategory.value.trim();

  if (!name || !category) {
    alert(
      "Please enter both a name and a category."
    );

    return;
  }

  const collection =
    editorMode === "supply"
      ? database.supplyItems
      : database.barItems;

  const existing =
    editorItemId
      ? getItemById(
          collection,
          editorItemId
        )
      : null;

  let image =
    existing?.image ||
    (
      editorMode === "supply"
        ? "assets/supplies/containers.jpg"
        : "assets/bottles/house-gin.jpg"
    );

  const file =
    elements.editorImage.files[0];

  if (file) {
    image =
      await compressImageToDataUrl(
        file
      );
  }

  if (existing) {
    existing.name = name;
    existing.category = category;
    existing.image = image;

    if (editorMode === "supply") {
      existing.sleevesPerCase =
        Math.max(
          1,
          Number(
            elements
              .editorSleevesPerCase
              .value || 6
          )
        );
    }
  } else {
    const newItem = {
      id:
        `${editorMode}-${slugify(name)}-${Date.now()}`,
      name,
      category,
      image,
    };

    if (editorMode === "supply") {
      Object.assign(
        newItem,
        {
          sleevesPerCase:
            Math.max(
              1,
              Number(
                elements
                  .editorSleevesPerCase
                  .value || 6
              )
            ),
          criticalBelow: 1,
          lowBelow: 2,
          overstockAbove: 4,
        }
      );
    }

    collection.push(newItem);
  }

  saveDatabase();

  elements.itemEditorDialog.close();

  renderCurrentPage();
}

function compressImageToDataUrl(file) {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const image =
          new Image();

        image.onload = () => {
          const maxWidth = 480;
          const scale =
            Math.min(
              1,
              maxWidth / image.width
            );

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            Math.round(
              image.width * scale
            );

          canvas.height =
            Math.round(
              image.height * scale
            );

          const context =
            canvas.getContext("2d");

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(
            canvas.toDataURL(
              "image/jpeg",
              0.72
            )
          );
        };

        image.onerror = reject;
        image.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  );
}

function bindBarEditActions() {
  elements.barDetail
    .querySelectorAll(
      "[data-edit-bar-item]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          openItemEditor(
            "bar",
            button.dataset.editBarItem
          );
        }
      );
    });

  elements.barDetail
    .querySelectorAll(
      "[data-delete-bar-item]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          deleteItem(
            "bar",
            button.dataset.deleteBarItem
          );
        }
      );
    });
}

function bindSupplyEditActions() {
  elements.supplyDetail
    .querySelectorAll(
      "[data-edit-supply-item]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          openItemEditor(
            "supply",
            button.dataset
              .editSupplyItem
          );
        }
      );
    });

  elements.supplyDetail
    .querySelectorAll(
      "[data-delete-supply-item]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          deleteItem(
            "supply",
            button.dataset
              .deleteSupplyItem
          );
        }
      );
    });
}

function deleteItem(
  type,
  itemId
) {
  const collection =
    type === "bar"
      ? database.barItems
      : database.supplyItems;

  const item =
    getItemById(
      collection,
      itemId
    );

  if (!item) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete "${item.name}" from the assortment? Historical count data will remain stored.`
    );

  if (!confirmed) {
    return;
  }

  const index =
    collection.findIndex(
      (entry) =>
        entry.id === itemId
    );

  collection.splice(
    index,
    1
  );

  saveDatabase();
  renderCurrentPage();
}

/* ============================================================
   Stock view toggles
============================================================ */

function setBarStockView(view) {
  const isOverview =
    view === "overview";

  elements.barOverview.classList.toggle(
    "hidden",
    !isOverview
  );

  elements.barDetail.classList.toggle(
    "hidden",
    isOverview
  );

  document
    .querySelectorAll(
      "[data-bar-stock-view]"
    )
    .forEach((button) => {
      button.classList.toggle(
        "segmented-control__button--active",
        button.dataset
          .barStockView === view
      );
    });
}

function setSupplyStockView(view) {
  const isOverview =
    view === "overview";

  elements.supplyOverview.classList.toggle(
    "hidden",
    !isOverview
  );

  elements.supplyDetail.classList.toggle(
    "hidden",
    isOverview
  );

  document
    .querySelectorAll(
      "[data-supply-stock-view]"
    )
    .forEach((button) => {
      button.classList.toggle(
        "segmented-control__button--active",
        button.dataset
          .supplyStockView === view
      );
    });
}

/* ============================================================
   Date copy / clear
============================================================ */

function openCopyDateDialog(type) {
  pendingCopyType = type;

  const targetDate =
    type === "bar"
      ? getCurrentBarDate()
      : getCurrentSupplyDate();

  const collection =
    type === "bar"
      ? database.barCounts
      : database.supplyCounts;

  const previousDates =
    Object.keys(collection)
      .filter((date) => {
        return (
          date !== targetDate &&
          Object.keys(
            collection[date] || {}
          ).length > 0
        );
      })
      .sort()
      .reverse();

  if (
    previousDates.length === 0
  ) {
    alert(
      "No previous saved inventory is available yet."
    );

    return;
  }

  elements.copyDateSelect.innerHTML =
    previousDates
      .map((date) => {
        return `
          <option value="${date}">
            ${formatDateForDisplay(date)}
          </option>
        `;
      })
      .join("");

  elements.copyDateDialog.showModal();
}

function confirmCopyDate() {
  const sourceDate =
    elements.copyDateSelect.value;

  const targetDate =
    pendingCopyType === "bar"
      ? getCurrentBarDate()
      : getCurrentSupplyDate();

  const collection =
    pendingCopyType === "bar"
      ? database.barCounts
      : database.supplyCounts;

  collection[targetDate] =
    structuredClone(
      collection[sourceDate] || {}
    );

  saveDatabase();

  elements.copyDateDialog.close();

  renderCurrentPage();
}

function clearCurrentDate(type) {
  const date =
    type === "bar"
      ? getCurrentBarDate()
      : getCurrentSupplyDate();

  const confirmed =
    window.confirm(
      `Clear all inventory values for ${formatDateForDisplay(date)}?`
    );

  if (!confirmed) {
    return;
  }

  if (type === "bar") {
    database.barCounts[date] = {};
  } else {
    database.supplyCounts[date] = {};
  }

  saveDatabase();
  renderCurrentPage();
}

/* ============================================================
   Page rendering router
============================================================ */

function renderCurrentPage() {
  switch (currentPageId) {
    case "homePage":
      renderHome();
      break;

    case "barCurrentPage":
      renderBarCurrentStock();
      break;

    case "barCountPage":
      renderBarCountPage();
      break;

    case "supplyCurrentPage":
      renderSupplyCurrentStock();
      break;

    case "supplyCountPage":
      renderSupplyCountPage();
      break;
  }
}

/* ============================================================
   Mobile zoom prevention
============================================================ */

function installZoomPrevention() {
  /*
    Safari uses gesture events for pinch zoom.
  */
  ["gesturestart", "gesturechange", "gestureend"]
    .forEach((eventName) => {
      document.addEventListener(
        eventName,
        (event) => {
          event.preventDefault();
        },
        {
          passive: false,
        }
      );
    });

  /*
    Extra guard against browser double-tap zoom.
    Clicks themselves remain functional.
  */
  document.addEventListener(
    "dblclick",
    (event) => {
      event.preventDefault();
    },
    {
      passive: false,
    }
  );
}

/* ============================================================
   Event bindings
============================================================ */

function bindEvents() {
  elements.backButton.addEventListener(
    "click",
    goBack
  );

  elements.homeButton.addEventListener(
    "click",
    () => showPage("homePage")
  );

  document
    .querySelectorAll(
      "[data-open-module]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          openModuleDialog(
            button.dataset
              .openModule
          );
        }
      );
    });

  elements.moduleCurrentButton.addEventListener(
    "click",
    openCurrentStockFromModule
  );

  elements.moduleCountButton.addEventListener(
    "click",
    openCountFromModule
  );

  elements.barEditButton.addEventListener(
    "click",
    toggleBarEditMode
  );

  elements.supplyEditButton.addEventListener(
    "click",
    toggleSupplyEditMode
  );

  elements.addBarItemButton.addEventListener(
    "click",
    () => openItemEditor("bar")
  );

  elements.addSupplyItemButton.addEventListener(
    "click",
    () => openItemEditor("supply")
  );

  elements.saveEditorButton.addEventListener(
    "click",
    saveEditorItem
  );

  document
    .querySelectorAll(
      "[data-bar-stock-view]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          setBarStockView(
            button.dataset
              .barStockView
          );
        }
      );
    });

  document
    .querySelectorAll(
      "[data-supply-stock-view]"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          setSupplyStockView(
            button.dataset
              .supplyStockView
          );
        }
      );
    });

  elements.barCountDate.addEventListener(
    "change",
    () => {
      ensureCountDate(
        database.barCounts,
        getCurrentBarDate()
      );

      saveDatabase();
      renderBarCountPage();
    }
  );

  elements.barSearchInput.addEventListener(
    "input",
    renderBarCountList
  );

  elements.barStatusFilter.addEventListener(
    "change",
    renderBarCountList
  );

  elements.barCopyButton.addEventListener(
    "click",
    () => openCopyDateDialog("bar")
  );

  elements.barClearButton.addEventListener(
    "click",
    () => clearCurrentDate("bar")
  );

  elements.saveBarCountButton.addEventListener(
    "click",
    saveBarCount
  );

  elements.supplyCountDate.addEventListener(
    "change",
    () => {
      ensureCountDate(
        database.supplyCounts,
        getCurrentSupplyDate()
      );

      saveDatabase();
      renderSupplyCountPage();
    }
  );

  elements.supplySearchInput.addEventListener(
    "input",
    renderSupplyCountList
  );

  elements.supplyStatusFilter.addEventListener(
    "change",
    renderSupplyCountList
  );

  elements.supplyCopyButton.addEventListener(
    "click",
    () => openCopyDateDialog("supply")
  );

  elements.supplyClearButton.addEventListener(
    "click",
    () => clearCurrentDate("supply")
  );

  elements.supplyCasesMinus.addEventListener(
    "click",
    () => {
      changeSupplyInput(
        elements.supplyCasesInput,
        -1
      );
    }
  );

  elements.supplyCasesPlus.addEventListener(
    "click",
    () => {
      changeSupplyInput(
        elements.supplyCasesInput,
        1
      );
    }
  );

  elements.supplySleevesMinus.addEventListener(
    "click",
    () => {
      changeSupplyInput(
        elements.supplySleevesInput,
        -1
      );
    }
  );

  elements.supplySleevesPlus.addEventListener(
    "click",
    () => {
      changeSupplyInput(
        elements.supplySleevesInput,
        1
      );
    }
  );

  elements.supplyCasesInput.addEventListener(
    "input",
    updateSupplyModalTotal
  );

  elements.supplySleevesInput.addEventListener(
    "input",
    updateSupplyModalTotal
  );

  elements.saveSupplyCountButton.addEventListener(
    "click",
    saveSupplyCount
  );

  elements.confirmCopyDateButton.addEventListener(
    "click",
    confirmCopyDate
  );
}

/* ============================================================
   Initialization
============================================================ */

function initializeApp() {
  const today =
    getLocalDateISO();

  elements.barCountDate.value =
    today;

  elements.supplyCountDate.value =
    today;

  ensureCountDate(
    database.barCounts,
    today
  );

  ensureCountDate(
    database.supplyCounts,
    today
  );

  saveDatabase();

  installZoomPrevention();
  bindEvents();

  showPage("homePage");
}

initializeApp();
