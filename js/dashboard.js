/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * dashboard.js — Simulated Warehouse Management System (WMS) Interactive Operations Demo
 * Pure Frontend Vanilla JS — No external API or backend dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  const dashContainer = document.querySelector('.dashboard-frame');
  if (!dashContainer) return;

  // --- Initial Mock State ---
  let inventoryData = [
    { sku: 'SKU-1001', name: 'Product Alpha', category: 'Electronics', qty: 120, location: 'A-01', status: 'Stored', weight: '420 kg', batch: 'BT-8891' },
    { sku: 'SKU-1002', name: 'Product Beta', category: 'Retail', qty: 85, location: 'B-02', status: 'Picking', weight: '210 kg', batch: 'BT-3320' },
    { sku: 'SKU-1003', name: 'Product Gamma', category: 'FMCG', qty: 240, location: 'C-03', status: 'Stored', weight: '680 kg', batch: 'BT-9104' },
    { sku: 'SKU-1004', name: 'Product Delta', category: 'Components', qty: 60, location: 'A-04', status: 'Stored', weight: '150 kg', batch: 'BT-2201' },
    { sku: 'SKU-1005', name: 'Product Epsilon', category: 'Packaging', qty: 150, location: 'D-01', status: 'Dispatched', weight: '310 kg', batch: 'BT-5542' },
    { sku: 'SKU-1006', name: 'Product Zeta', category: 'Automotive', qty: 45, location: 'B-03', status: 'Inbound', weight: '540 kg', batch: 'BT-7711' },
    { sku: 'SKU-1007', name: 'Product Theta', category: 'Materials', qty: 310, location: 'C-01', status: 'Stored', weight: '920 kg', batch: 'BT-1029' },
    { sku: 'SKU-1008', name: 'Product Omega', category: 'Electronics', qty: 95, location: 'A-02', status: 'Picking', weight: '380 kg', batch: 'BT-4419' }
  ];

  let currentTab = 'overview';
  let searchQuery = '';
  let categoryFilter = 'all';
  let locationFilter = 'all';

  const activityLogs = [
    { time: '10:42:15', desc: 'Simulated putaway completed for SKU-1001 in Rack Bay A-01.' },
    { time: '10:28:40', desc: 'Batch order release #BO-492 assigned to Picking station.' },
    { time: '09:55:12', desc: 'Inbound dock receipt verified for container trailer #TR-994.' },
    { time: '09:14:05', desc: 'System scheduled cycle count completed for Zone C (100% match).' }
  ];

  // DOM Elements
  const tableBody = document.getElementById('dash-inventory-body');
  const searchInput = document.getElementById('dash-search');
  const categorySelect = document.getElementById('dash-cat-filter');
  const locationSelect = document.getElementById('dash-loc-filter');
  const navButtons = document.querySelectorAll('.dash-nav-btn');
  const activityListEl = document.getElementById('dash-activity-list');
  const activeTabTitle = document.getElementById('dash-current-section-title');

  // KPI elements
  const kpiTotalSkus = document.getElementById('kpi-total-skus');
  const kpiStoredUnits = document.getElementById('kpi-stored-units');
  const kpiActivePicks = document.getElementById('kpi-active-picks');
  const kpiInboundQueue = document.getElementById('kpi-inbound-queue');

  // Modal elements
  const modal = document.getElementById('demo-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  function addActivity(desc) {
    activityLogs.unshift({ time: getTimestamp(), desc });
    if (activityLogs.length > 8) activityLogs.pop();
    renderActivityLog();
  }

  function renderActivityLog() {
    if (!activityListEl) return;
    activityListEl.innerHTML = activityLogs.map(item => `
      <div class="activity-item">
        <span class="activity-time">${item.time}</span>
        <span class="activity-desc">${item.desc}</span>
      </div>
    `).join('');
  }

  function updateKPIs() {
    if (!kpiTotalSkus) return;
    const totalQty = inventoryData.reduce((sum, item) => sum + item.qty, 0);
    const activePicks = inventoryData.filter(i => i.status === 'Picking').length;
    const inbound = inventoryData.filter(i => i.status === 'Inbound').length;

    kpiTotalSkus.textContent = inventoryData.length.toString();
    kpiStoredUnits.textContent = totalQty.toLocaleString();
    kpiActivePicks.textContent = activePicks.toString();
    kpiInboundQueue.textContent = inbound.toString();
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'Stored': return `<span class="status-pill status-pill--stored">&bull; Stored</span>`;
      case 'Picking': return `<span class="status-pill status-pill--picking">&bull; Picking</span>`;
      case 'Inbound': return `<span class="status-pill status-pill--inbound">&bull; Inbound</span>`;
      case 'Dispatched': return `<span class="status-pill status-pill--dispatched">&bull; Dispatched</span>`;
      default: return `<span class="status-pill">${status}</span>`;
    }
  }

  function renderTable() {
    if (!tableBody) return;

    let filtered = inventoryData.filter(item => {
      const matchSearch = item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
      const matchLoc = locationFilter === 'all' || item.location.startsWith(locationFilter);
      return matchSearch && matchCat && matchLoc;
    });

    if (currentTab === 'inbound') {
      filtered = filtered.filter(i => i.status === 'Inbound');
    } else if (currentTab === 'picking') {
      filtered = filtered.filter(i => i.status === 'Picking');
    } else if (currentTab === 'dispatch') {
      filtered = filtered.filter(i => i.status === 'Dispatched');
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color: var(--mid-grey);">
            No simulated inventory records found matching your filters.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr data-sku="${item.sku}">
        <td><span class="sku-badge">${item.sku}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td>${item.qty} units</td>
        <td><code style="color:var(--electric-cyan);">${item.location}</code></td>
        <td>${getStatusBadge(item.status)}</td>
        <td>
          <button class="table-btn view-details-btn" data-sku="${item.sku}">Inspect</button>
        </td>
      </tr>
    `).join('');

    // Attach row inspection handlers
    tableBody.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sku = btn.dataset.sku;
        openItemDetails(sku);
      });
    });
  }

  function openItemDetails(sku) {
    const item = inventoryData.find(i => i.sku === sku);
    if (!item || !modal) return;

    modalTitle.textContent = `${item.sku} — ${item.name}`;
    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
        <div class="spec-box">
          <div class="spec-box-label">Category</div>
          <div class="spec-box-value">${item.category}</div>
        </div>
        <div class="spec-box">
          <div class="spec-box-label">Storage Location</div>
          <div class="spec-box-value" style="color:var(--electric-cyan);">${item.location}</div>
        </div>
        <div class="spec-box">
          <div class="spec-box-label">Available Inventory</div>
          <div class="spec-box-value">${item.qty} units</div>
        </div>
        <div class="spec-box">
          <div class="spec-box-label">Gross Pallet Mass</div>
          <div class="spec-box-value">${item.weight}</div>
        </div>
        <div class="spec-box">
          <div class="spec-box-label">Batch Code</div>
          <div class="spec-box-value">${item.batch}</div>
        </div>
        <div class="spec-box">
          <div class="spec-box-label">Current Status</div>
          <div class="spec-box-value">${item.status}</div>
        </div>
      </div>

      <div style="background:rgba(16,27,43,0.5); padding:1rem; border-radius:var(--radius-xs); border:1px solid var(--dark-border); margin-bottom:1.5rem;">
        <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--electric-cyan);">Simulate Operations on this SKU:</span>
        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.75rem;">
          <button class="btn btn-outline-dark" style="color:var(--cool-white); border-color:var(--dark-border); padding:0.45rem 0.85rem; font-size:0.75rem;" id="sim-move-btn" data-sku="${item.sku}">
            Move Location
          </button>
          <button class="btn btn-orange" style="padding:0.45rem 0.85rem; font-size:0.75rem;" id="sim-pick-btn" data-sku="${item.sku}">
            Toggle Pick/Stored
          </button>
        </div>
      </div>
      
      <p style="font-size:0.75rem; color:var(--mid-grey); font-family:var(--font-mono);">
        * Illustrative demo record. Changes reflect in your local session only.
      </p>
    `;

    // Modal action triggers
    const moveBtn = modalBody.querySelector('#sim-move-btn');
    const pickBtn = modalBody.querySelector('#sim-pick-btn');

    if (moveBtn) {
      moveBtn.addEventListener('click', () => {
        const locations = ['A-01', 'A-03', 'B-02', 'B-04', 'C-02', 'C-04', 'D-01', 'D-03'];
        const randomLoc = locations[Math.floor(Math.random() * locations.length)];
        const prev = item.location;
        item.location = randomLoc;
        addActivity(`Stock relocation: ${item.sku} transferred from ${prev} to ${randomLoc}.`);
        closeModal();
        renderTable();
      });
    }

    if (pickBtn) {
      pickBtn.addEventListener('click', () => {
        const newStatus = item.status === 'Stored' ? 'Picking' : 'Stored';
        item.status = newStatus;
        addActivity(`Status change: ${item.sku} transitioned to ${newStatus}.`);
        updateKPIs();
        closeModal();
        renderTable();
      });
    }

    modal.classList.add('is-active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('is-active');
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Search and Filter Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTable();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      categoryFilter = e.target.value;
      renderTable();
    });
  }

  if (locationSelect) {
    locationSelect.addEventListener('change', (e) => {
      locationFilter = e.target.value;
      renderTable();
    });
  }

  // Sidebar Tab Switching
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const tab = btn.dataset.tab;
      currentTab = tab;
      if (activeTabTitle) {
        activeTabTitle.textContent = btn.textContent.trim();
      }

      renderTable();
      addActivity(`User viewed dashboard tab: ${btn.textContent.trim()}`);
    });
  });

  // Global Quick Simulation Buttons
  const inboundSimBtn = document.getElementById('dash-btn-sim-inbound');
  if (inboundSimBtn) {
    inboundSimBtn.addEventListener('click', () => {
      const nextId = 1000 + inventoryData.length + 1;
      const newSku = {
        sku: `SKU-${nextId}`,
        name: `Product ${String.fromCharCode(65 + (inventoryData.length % 26))}${nextId % 10}`,
        category: 'Electronics',
        qty: Math.floor(Math.random() * 200) + 50,
        location: `A-0${(nextId % 4) + 1}`,
        status: 'Inbound',
        weight: '410 kg',
        batch: `BT-${Math.floor(1000 + Math.random() * 9000)}`
      };
      inventoryData.unshift(newSku);
      addActivity(`Simulated Inbound Dock Arrival: ASN received for new pallet ${newSku.sku}.`);
      updateKPIs();
      renderTable();
    });
  }

  // Initial Boot
  updateKPIs();
  renderActivityLog();
  renderTable();
});
