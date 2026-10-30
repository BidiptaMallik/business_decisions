
export const MODULES = {
  churn: {
    key: 'churn',
    label: 'Customer Retention',
    accent: 'var(--churn)',
    eyebrow: 'Module 01 — Retention',
    title: 'Will this customer churn?',
    description:
      'Enter a customer profile to get a churn risk read before they leave — so retention offers go to the right people, not everyone.',
    verdictLabel: (r) => (r.prediction === 'Yes' ? 'At risk of churning' : 'Likely to stay'),
    verdictTone: (r) => (r.prediction === 'Yes' ? 'var(--supplychain)' : 'var(--churn)'),
    groups: [
      {
        title: 'Customer profile',
        fields: [
          { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
          { name: 'SeniorCitizen', label: 'Senior citizen', type: 'select', options: [{ v: 0, l: 'No' }, { v: 1, l: 'Yes' }], numeric: true },
          { name: 'Partner', label: 'Has partner', type: 'select', options: ['Yes', 'No'] },
          { name: 'Dependents', label: 'Has dependents', type: 'select', options: ['Yes', 'No'] },
          { name: 'tenure', label: 'Tenure (months)', type: 'number', default: 12 },
        ],
      },
      {
        title: 'Services',
        fields: [
          { name: 'PhoneService', label: 'Phone service', type: 'select', options: ['Yes', 'No'] },
          { name: 'MultipleLines', label: 'Multiple lines', type: 'select', options: ['Yes', 'No', 'No phone service'] },
          { name: 'InternetService', label: 'Internet service', type: 'select', options: ['DSL', 'Fiber optic', 'No'] },
          { name: 'OnlineSecurity', label: 'Online security', type: 'select', options: ['Yes', 'No', 'No internet service'] },
          { name: 'OnlineBackup', label: 'Online backup', type: 'select', options: ['Yes', 'No', 'No internet service'] },
          { name: 'DeviceProtection', label: 'Device protection', type: 'select', options: ['Yes', 'No', 'No internet service'] },
          { name: 'TechSupport', label: 'Tech support', type: 'select', options: ['Yes', 'No', 'No internet service'] },
          { name: 'StreamingTV', label: 'Streaming TV', type: 'select', options: ['Yes', 'No', 'No internet service'] },
          { name: 'StreamingMovies', label: 'Streaming movies', type: 'select', options: ['Yes', 'No', 'No internet service'] },
        ],
      },
      {
        title: 'Billing',
        fields: [
          { name: 'Contract', label: 'Contract type', type: 'select', options: ['Month-to-month', 'One year', 'Two year'] },
          { name: 'PaperlessBilling', label: 'Paperless billing', type: 'select', options: ['Yes', 'No'] },
          { name: 'PaymentMethod', label: 'Payment method', type: 'select', options: ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'] },
          { name: 'MonthlyCharges', label: 'Monthly charges ($)', type: 'number', step: '0.01', default: 55.5 },
          { name: 'TotalCharges', label: 'Total charges ($)', type: 'number', step: '0.01', default: 650.3 },
        ],
      },
    ],
  },

  pricing: {
  key: 'pricing',
  label: 'Demand Forecasting',
  accent: 'var(--pricing)',
  eyebrow: 'Module 02 — Demand',
  title: 'How many units will sell?',
  description:
    'Enter a product, store, pricing, and date profile to predict the expected sales quantity.',
  verdictLabel: (r) => `${Number(r.prediction).toFixed(1)} units`,
  verdictTone: () => 'var(--pricing)',

  groups: [
    {
      title: 'Product classification',
      fields: [
        {
          name: 'division',
          label: 'Division',
          type: 'text',
          default: 'Div1'
        },
        {
          name: 'format',
          label: 'Store format',
          type: 'text',
          default: 'Format-1'
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          default: 'City1'
        },
        {
          name: 'dept_name',
          label: 'Department name',
          type: 'text',
          default: 'ЛИМОНАДЫ'
        },
        {
          name: 'class_name',
          label: 'Class name',
          type: 'text',
          default: 'ЖЕВАТЕЛЬНАЯ РЕЗИНКА'
        },
        {
          name: 'subclass_name',
          label: 'Subclass name',
          type: 'text',
          default: 'ПОДУШЕЧКИ'
        },
        {
          name: 'item_type',
          label: 'Item type',
          type: 'text',
          default: 'Лимонады'
        }
      ]
    },

    {
      title: 'Store',
      fields: [
        {
          name: 'store_id',
          label: 'Store ID',
          type: 'number',
          default: 1
        },
        {
          name: 'area',
          label: 'Store area',
          type: 'number',
          default: 500
        }
      ]
    },

    {
      title: 'Product measurements',
      fields: [
        {
          name: 'weight_volume',
          label: 'Volume weight',
          type: 'number',
          step: '0.01',
          default: 1.0
        },
        {
          name: 'weight_netto',
          label: 'Net weight',
          type: 'number',
          step: '0.01',
          default: 1.0
        },
        {
          name: 'fatness',
          label: 'Fat content (%)',
          type: 'number',
          step: '0.1',
          default: 3.2
        }
      ]
    },

    {
      title: 'Pricing & Promotion',
      fields: [
        {
          name: 'price_base',
          label: 'Base price',
          type: 'number',
          step: '0.01',
          default: 100
        },
        {
          name: 'sale_price_before_promo',
          label: 'Sale price before promo',
          type: 'number',
          step: '0.01',
          default: 100
        },
        {
          name: 'sale_price_time_promo',
          label: 'Sale price during promo',
          type: 'number',
          step: '0.01',
          default: 100
        },
        {
          name: 'promo_type_code',
          label: 'Promotion type code',
          type: 'number',
          step: '1',
          default: 0
        },
        {
          name: 'number_disc_day',
          label: 'Discount days',
          type: 'number',
          step: '1',
          default: 0
        }
      ]
    },

    {
      title: 'Date',
      fields: [
        {
          name: 'year',
          label: 'Year',
          type: 'number',
          default: 2024
        },
        {
          name: 'month',
          label: 'Month (1–12)',
          type: 'number',
          default: 6
        },
        {
          name: 'day',
          label: 'Day (1–31)',
          type: 'number',
          default: 15
        },
        {
          name: 'day_of_week',
          label: 'Day of week (0–6)',
          type: 'number',
          default: 3
        },
        {
          name: 'week_of_year',
          label: 'Week of year (1–52)',
          type: 'number',
          default: 24
        },
        {
          name: 'quarter',
          label: 'Quarter (1–4)',
          type: 'number',
          default: 2
        },
        {
          name: 'is_weekend',
          label: 'Is weekend',
          type: 'select',
          options: [
            { v: 0, l: 'No' },
            { v: 1, l: 'Yes' }
          ],
          numeric: true
        }
      ]
    }
  ]
},
  market: {
    key: 'market',
    label: 'Market Expansion',
    accent: 'var(--market)',
    eyebrow: 'Module 03 — Expansion',
    title: 'Should we invest here?',
    description:
      'Enter a market or startup\u2019s funding profile to get a predicted outcome \u2014 a quick read on whether it resembles past successes or past failures.',
    verdictLabel: (r) => r.prediction,
    verdictTone: (r) => {
      const p = r.prediction;
      if (p === 'Late delivery') return 'var(--supplychain)';
      if (p === 'Shipping canceled') return 'var(--supplychain)';
      if (p === 'Shipping on time') return 'var(--churn)';
      if (p === 'Advance shipping') return 'var(--market)';
      return 'var(--pricing)';
    },
    groups: [
      {
        title: 'Location',
        fields: [
          { name: 'state_code', label: 'State code', type: 'text', default: 'CA' },
          { name: 'city', label: 'City', type: 'text', default: 'San Francisco' },
          { name: 'latitude', label: 'Latitude', type: 'number', step: '0.0001', default: 37.7749 },
          { name: 'longitude', label: 'Longitude', type: 'number', step: '0.0001', default: -122.4194 },
        ],
      },
      {
        title: 'Category',
        fields: [
          {
            name: 'category_code', label: 'Industry', type: 'select',
            options: ['software', 'web', 'mobile', 'enterprise', 'advertising', 'gamesvideo', 'ecommerce', 'biotech', 'consulting', 'other'],
          },
          { name: 'is_top500', label: 'Top-500 ranked', type: 'checkbox', default: true },
        ],
      },
      {
        title: 'Funding history',
        fields: [
          { name: 'funding_rounds', label: 'Funding rounds', type: 'number', default: 3 },
          { name: 'funding_total_usd', label: 'Total funding ($)', type: 'number', default: 5000000 },
          { name: 'milestones', label: 'Milestones hit', type: 'number', default: 2 },
          { name: 'relationships', label: 'Relationships / partners', type: 'number', default: 5 },
          { name: 'avg_participants', label: 'Avg. investors per round', type: 'number', step: '0.1', default: 2.5 },
          { name: 'age_first_funding_year', label: 'Years to first funding', type: 'number', step: '0.1', default: 1.5 },
          { name: 'age_last_funding_year', label: 'Years to latest funding', type: 'number', step: '0.1', default: 3.2 },
          { name: 'age_first_milestone_year', label: 'Years to first milestone', type: 'number', step: '0.1', default: 1.0 },
          { name: 'age_last_milestone_year', label: 'Years to latest milestone', type: 'number', step: '0.1', default: 2.8 },
        ],
      },
      {
        title: 'Investor backing',
        fields: [
          { name: 'has_VC', label: 'VC backed', type: 'checkbox', default: true },
          { name: 'has_angel', label: 'Angel backed', type: 'checkbox', default: true },
          { name: 'has_roundA', label: 'Raised round A', type: 'checkbox', default: true },
          { name: 'has_roundB', label: 'Raised round B', type: 'checkbox', default: true },
          { name: 'has_roundC', label: 'Raised round C', type: 'checkbox', default: false },
          { name: 'has_roundD', label: 'Raised round D', type: 'checkbox', default: false },
        ],
      },
    ],

    buildPayload: (values) => {
      const categories = ['software', 'web', 'mobile', 'enterprise', 'advertising', 'gamesvideo', 'ecommerce', 'biotech', 'consulting', 'other'];
      const flags = {};
      categories.forEach((c) => {
        const key = c === 'other' ? 'is_othercategory' : `is_${c}`;
        flags[key] = values.category_code === c ? 1 : 0;
      });
      const { category_code, ...rest } = values;
      return { ...rest, category_code, ...flags };
    },
  },

  supplychain: {
    key: 'supplychain',
    label: 'Supply Chain Risk',
    accent: 'var(--supplychain)',
    eyebrow: 'Module 04 — Supply Chain',
    title: 'Will this shipment be late?',
    description:
      'Enter a shipment\u2019s details to get a late-delivery risk read \u2014 flag it for expediting before the delay happens, not after.',
    verdictLabel: (r) => {
      const p = String(r.prediction).toLowerCase();
      return (p === '1' || p.includes('late')) ? 'High late-delivery risk' : 'On-time expected';
    },
    verdictTone: (r) => {
      const p = String(r.prediction).toLowerCase();
      return (p === '1' || p.includes('late')) ? 'var(--supplychain)' : 'var(--churn)';
    },
    groups: [
      {
        title: 'Shipment',
        fields: [
          { name: 'Type', label: 'Payment type', type: 'select', options: ['DEBIT', 'TRANSFER', 'CASH', 'PAYMENT'] },
          { name: 'Days for shipment (scheduled)', label: 'Scheduled shipping days', type: 'number', default: 4 },
          { name: 'Shipping Mode', label: 'Shipping mode', type: 'select', options: ['Standard Class', 'First Class', 'Second Class', 'Same Day'] },
          { name: 'Order Status', label: 'Order status', type: 'select', options: ['COMPLETE', 'PENDING', 'CLOSED', 'PROCESSING', 'CANCELED'] },
        ],
      },
      {
        title: 'Customer & location',
        fields: [
          { name: 'Customer Segment', label: 'Customer segment', type: 'select', options: ['Consumer', 'Corporate', 'Home Office'] },
          { name: 'Customer City', label: 'Customer city', type: 'text', default: 'San Jose' },
          { name: 'Customer State', label: 'Customer state', type: 'text', default: 'CA' },
          { name: 'Customer Country', label: 'Customer country', type: 'text', default: 'EE. UU.' },
          { name: 'Order City', label: 'Order city', type: 'text', default: 'San Jose' },
          { name: 'Order State', label: 'Order state', type: 'text', default: 'California' },
          { name: 'Order Country', label: 'Order country', type: 'text', default: 'United States' },
          { name: 'Order Region', label: 'Order region', type: 'text', default: 'West of USA' },
          { name: 'Market', label: 'Market', type: 'text', default: 'Pacific Asia' },
          { name: 'Latitude', label: 'Latitude', type: 'number', step: '0.0001', default: 37.3382 },
          { name: 'Longitude', label: 'Longitude', type: 'number', step: '0.0001', default: -121.8863 },
        ],
      },
      {
        title: 'Product',
        fields: [
          { name: 'Product Name', label: 'Product name', type: 'text', default: "Nike Men's Dri-FIT Victory Golf Polo" },
          { name: 'Category Name', label: 'Category', type: 'text', default: 'Sporting Goods' },
          { name: 'Department Name', label: 'Department', type: 'text', default: 'Fitness' },
          { name: 'Product Price', label: 'Product price ($)', type: 'number', step: '0.01', default: 100 },
          { name: 'Product Status', label: 'Product active', type: 'select', options: [{ v: 0, l: 'Active' }, { v: 1, l: 'Discontinued' }], numeric: true },
        ],
      },
      {
        title: 'Order financials',
        fields: [
          { name: 'Order Item Quantity', label: 'Quantity', type: 'number', default: 2 },
          { name: 'Sales', label: 'Sales ($)', type: 'number', step: '0.01', default: 200 },
          { name: 'Sales per customer', label: 'Sales per customer ($)', type: 'number', step: '0.01', default: 250 },
          { name: 'Order Item Total', label: 'Order item total ($)', type: 'number', step: '0.01', default: 190 },
          { name: 'Order Item Product Price', label: 'Item unit price ($)', type: 'number', step: '0.01', default: 100 },
          { name: 'Order Item Discount', label: 'Discount ($)', type: 'number', step: '0.01', default: 10 },
          { name: 'Order Item Discount Rate', label: 'Discount rate (0\u20131)', type: 'number', step: '0.01', default: 0.1 },
          { name: 'Order Item Profit Ratio', label: 'Profit ratio (0\u20131)', type: 'number', step: '0.01', default: 0.15 },
          { name: 'Order Profit Per Order', label: 'Profit per order ($)', type: 'number', step: '0.01', default: 30 },
          { name: 'Benefit per order', label: 'Benefit per order ($)', type: 'number', step: '0.01', default: 45.5 },
        ],
      },
    ],
  },
};

export const MODULE_ORDER = ['churn', 'pricing', 'market', 'supplychain'];
