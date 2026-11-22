/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * warehouse-layout.js — Interactive Facility Floor Plan & Zone Inspector
 */

document.addEventListener('DOMContentLoaded', () => {
  const zoneData = {
    'receiving': {
      title: 'Inbound Receiving & Unloading',
      tag: 'Zone 01 — Inbound Logistics',
      category: 'Inbound Docking',
      specs: {
        'Handling Flow': 'Truck offloading & documentation',
        'Equipment': 'Dock levelers & pallet jacks',
        'Verification': 'Physical count & ASN match',
        'Throughput': 'Scheduled receiving slots'
      },
      desc: 'The receiving zone is engineered for rapid, structured intake of palletized freight and container shipments. Each shipment is logged into the management system upon arrival for immediate traceability.',
      quoteType: 'General Storage'
    },
    'inspection': {
      title: 'Inspection & Quality Verification',
      tag: 'Zone 02 — Quality Control',
      category: 'Staging & QC',
      specs: {
        'Handling Flow': 'Barcode scanning & QC sampling',
        'Equipment': 'Inspection benches & optical scanners',
        'Condition': 'Clean ambient environment',
        'Status': 'Quarantine hold until cleared'
      },
      desc: 'Every incoming SKU passes through systematic quality verification where packaging integrity, seal status, and batch codes are cross-referenced prior to rack putaway.',
      quoteType: 'Inventory Handling'
    },
    'storage-highrack': {
      title: 'High-Bay Storage Racks',
      tag: 'Zone 03 — Core Storage',
      category: 'Palletized Storage',
      specs: {
        'Handling Flow': 'VNA / Reach truck putaway',
        'System': 'Adjustable pallet racking (APR)',
        'Configuration': 'Standard EUR/ISO pallets',
        'Optimization': 'WMS-directed slotting'
      },
      desc: 'High-density vertical storage engineered for organized pallet storage. Storage positions are tracked dynamically to maximize vertical cubic efficiency and ensure FIFO/LIFO compliance.',
      quoteType: 'Pallet Storage'
    },
    'bulk-storage': {
      title: 'Bulk & Oversized Goods Staging',
      tag: 'Zone 04 — Floor Staging',
      category: 'Heavy / Bulk Handling',
      specs: {
        'Handling Flow': 'Direct floor block stacking',
        'System': 'Designated safety aisles',
        'Load Profile': 'Non-standard & heavy freight',
        'Flexibility': 'Variable staging areas'
      },
      desc: 'Designed for oversized goods, machinery components, and high-volume buffer inventory that exceed standard rack apertures, ensuring safe clearance and forklift access.',
      quoteType: 'Bulk Storage'
    },
    'picking': {
      title: 'Order Picking & Consolidation',
      tag: 'Zone 05 — Order Processing',
      category: 'Fulfilment Zone',
      specs: {
        'Handling Flow': 'Batch & wave picking',
        'Method': 'Barcode-verified item selection',
        'Equipment': 'Order pickers & low-level trolleys',
        'Accuracy': 'Multi-point verification'
      },
      desc: 'Dedicated order assembly zone where pickers fulfill customer sales orders via optimized travel paths, reducing order cycle time and eliminating fulfillment errors.',
      quoteType: 'Pick & Pack'
    },
    'packing': {
      title: 'Packaging & Value-Added Services',
      tag: 'Zone 06 — Packaging Hub',
      category: 'Value Addition',
      specs: {
        'Handling Flow': 'Carton sealing, labelling & kitting',
        'Stationery': 'Automated void-fill dispensers',
        'Services': 'Custom carton labelling & repacking',
        'Standards': 'Carrier-compliant shipping prep'
      },
      desc: 'Ergonomically configured workstations equipped with barcode scanners, digital scales, and protective packaging materials to prepare goods for parcel or LTL transit.',
      quoteType: 'E-commerce Fulfilment'
    },
    'dispatch': {
      title: 'Outbound Dispatch & Staging',
      tag: 'Zone 07 — Outbound Transit',
      category: 'Outbound Logistics',
      specs: {
        'Handling Flow': 'Carrier sorting & dock loading',
        'Equipment': 'Stretch wrappers & dock locks',
        'Verification': 'Bill of Lading & seal validation',
        'Velocity': 'Cross-dock & linehaul coordination'
      },
      desc: 'The final checkpoint before outbound linehauls depart. Consolidated shipments are pallet-wrapped, staged by distribution route, and loaded in scheduled carrier windows.',
      quoteType: 'Distribution & Dispatch'
    }
  };

  const svgZones = document.querySelectorAll('.plan-zone');
  const legendBtns = document.querySelectorAll('.legend-btn');
  const panel = document.getElementById('floorplan-details');

  if (!panel || svgZones.length === 0) return;

  function updateZonePanel(zoneKey) {
    const data = zoneData[zoneKey];
    if (!data) return;

    // Update SVG active classes
    svgZones.forEach(z => {
      if (z.dataset.zone === zoneKey) {
        z.classList.add('is-active');
      } else {
        z.classList.remove('is-active');
      }
    });

    // Update legend button active classes
    legendBtns.forEach(btn => {
      if (btn.dataset.zone === zoneKey) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    // Render details in panel
    panel.innerHTML = `
      <div>
        <div class="zone-detail-header">
          <div class="zone-detail-tag">${data.tag}</div>
          <h3 class="zone-detail-title">${data.title}</h3>
        </div>
        <p class="text-muted" style="margin-bottom: 1.25rem; line-height: 1.6;">${data.desc}</p>
        
        <div class="zone-detail-specs">
          ${Object.entries(data.specs).map(([label, val]) => `
            <div class="spec-box">
              <div class="spec-box-label">${label}</div>
              <div class="spec-box-value">${val}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top: 1.75rem; pt: 1rem; border-top: 1px solid var(--dark-border);">
        <a href="contact.html?type=${encodeURIComponent(data.quoteType)}" class="btn btn-outline" style="width: 100%;">
          Enquire About ${data.category}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    `;
  }

  // Attach event listeners to SVG zones
  svgZones.forEach(zone => {
    zone.addEventListener('click', () => {
      const zoneKey = zone.dataset.zone;
      if (zoneKey) updateZonePanel(zoneKey);
    });
  });

  // Attach event listeners to legend buttons
  legendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const zoneKey = btn.dataset.zone;
      if (zoneKey) updateZonePanel(zoneKey);
    });
  });

  // Initial load with default zone
  updateZonePanel('storage-highrack');
});
