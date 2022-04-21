const config = [{
    elements: [{
      id: 1,
      label: 'Name',
      value: '',
      htmlId: 'name',
      key: 'name',
    }, {
      id: 2,
      label: 'Learning Domain',
      value: '',
      type: 'select',
      htmlId: 'domain',
      key: 'domain',
      options: [{
        label: 'Aesthetic & Creative Expression',
        value: 'Aesthetic & Creative Expression',
      }, {
        label: 'Numeracy',
        value: 'Numeracy',
      }, {
        label: 'Literacy & Language',
        value: 'Literacy & Language'
      }, {
        label: 'Discovery of the world',
        value: 'Discovery of the world'
      }, {
        label: 'Motor Skills',
        value: 'Motor Skills'
      }, {
        label: 'Social & Emotional Learning',
        value: 'Social & Emotional Learning'
      }]
    }, {
      id: 3,
      label: 'Learning Sub domain',
      value: '',
      type: 'select',
      htmlId: 'sub-domain',
      key: 'subDomain',
      options: [{
        label: 'Aesthetic & Creative Expression',
        value: 'Aesthetic & Creative Expression',
      }, {
        label: 'Numeracy',
        value: 'Numeracy',
      }, {
        label: 'Literacy & Language',
        value: 'Literacy & Language'
      }, {
        label: 'Discovery of the world',
        value: 'Discovery of the world'
      }, {
        label: 'Motor Skills',
        value: 'Motor Skills'
      }, {
        label: 'Social & Emotional Learning',
        value: 'Social & Emotional Learning'
      }]
    }, {
      id: 4,
      label: 'Min age / Max age',
      value: 1,
      defaultValue: 1,
      type: 'slider',
      htmlId: 'age-group',
      step: 1,
      min: 1,
      max: 10,
      marks: true,
      key: 'ageGroup',
    }, {
      id: 5,
      label: 'Launch Mode',
      value: '1',
      type: 'radio',
      defaultValue: 0,
      htmlId: 'launch-mode',
      key: 'isPortrait',
      options: [{
        value: 0,
        label: 'Landscape'
      }, {
        value: 1,
        label: 'Portrait'
      }]
    }]
  }, {
    elements: [{
      id: 1,
      label: 'Theme',
      value: '',
      type: 'select',
      htmlId: 'theme',
      key: 'theme',
      options: [{
        value: 'Community Helper',
        label: 'Community Helper',
      }, {
        value: 'Animal Kingdom',
        label: 'Animal Kingdom'
      }, {
        value: 'BigBees',
        label: 'BigBees'
      }, {
        value: 'Sustainable earth',
        label: 'Sustainable earth'
      }, {
        value: 'Transportation',
        label: 'Transportation'
      }, {
        value: 'Folk Tales',
        label: 'Folk Tales'
      }, {
        value: 'Space Explorer',
        label: 'Space Explorer'
      }, {
        value: 'Under the sea',
        label: 'Under the sea'
      }, {
        value: 'STEM',
        label: 'STEM'
      }]
    }, {
      id: 2,
      label: 'Sub Theme',
      value: '',
      type: 'select',
      htmlId: 'sub-theme',
      key: 'subTheme',
      options: [{
        label: 'Police',
        value: 'Police',
      }, {
        label: 'Fireman',
        value: 'Fireman',
      }, {
        label: 'Doctor',
        value: 'Doctor',
      }, {
        label: 'Pilot',
        value: 'Pilot',
      }, {
        label: 'Navy',
        value: 'Navy',
      }, {
        label: 'Army',
        value: 'Army',
      }, {
        label: 'Teacher',
        value: 'Teacher',
      }, {
        label: 'African_Safari',
        value: 'African_Safari',
      }, {
        label: 'Rainfoest',
        value: 'Rainfoest',
      }, {
        label: 'Tundra',
        value: 'Tundra',
      }, {
        label: 'Reptiles',
        value: 'Reptiles',
      }, {
        label: 'Extinct_World',
        value: 'Extinct_World',
      }, {
        label: 'Chakra',
        value: 'Chakra',
      }, {
        label: 'Land_Transport',
        value: 'Land_Transport',
      }, {
        label: 'Sea Transport',
        value: 'Sea Transport',
      }, {
        label: 'Air Transport',
        value: 'Air Transport',
      }, {
        label: 'Special Vehicle',
        value: 'Special Vehicle',
      }, {
        label: 'Folk_Tales',
        value: 'Folk_Tales',
      }, {
        label: 'Space_Station',
        value: 'Space_Station',
      }, {
        label: 'BigBees',
        value: 'BigBees',
      }, {
        label: 'Deep Sea',
        value: 'Deep Sea',
      }, {
        label: 'STEM',
        value: 'STEM',
      }]
    }, {
      id: 3,
      label: 'Order',
      value: '',
      disabled: true,
      htmlId: 'order',
      key: 'order',
    }]
  }, {
    elements: [{
      id: 1,
      label: 'Game assets',
      value: '1',
      type: 'file',
      htmlId: 'assets',
      key: 'assets',
    }, {
      id: 2,
      label: 'Game icon',
      value: '1',
      type: 'file',
      htmlId: 'icon',
      key: 'icon',
    }]
  }, {
    elements: [{
      id: 1,
      label: 'Min version',
      value: '',
      type: 'select',
      htmlId: 'version',
      key: 'minVersion',
      options: [{
        label: '1.9.0',
        value: '1.9.0',
      }, {
        label: '2.4.1',
        value: '2.4.1',
      }, {
        label: '2.5.0',
        value: '2.5.0'
      }, {
        label: '2.5.1',
        value: '2.5.1'
      }, {
        label: '2.6.0',
        value: '2.6.0'
      }, {
        label: '2.6.1',
        value: '2.6.1'
      }, {
        label: '2.7.0',
        value: '2.7.0'
      }, {
        label: '2.8.2',
        value: '2.8.2'
      }, {
        label: '3.1.0',
        value: '3.1.0'
      }, {
        label: '3.1.1',
        value: '3.1.1'
      }, {
        label: '3.2.0',
        value: '3.2.0'
      }, {
        label: '3.3.0',
        value: '3.3.0'
      }]
    }, {
      id: 2,
      label: 'Load Time',
      value: '',
      type: 'select',
      htmlId: 'laod-time',
      key: 'loadTime',
      options: [{
        value: 1,
        label: '1s'
      }, {
        value: 2,
        label: '2s'
      }, {
        value: 3,
        label: '3s'
      }, {
        value: 4,
        label: '4s'
      }, {
        value: 5,
        label: '5s'
      }, {
        value: 6,
        label: '6s'
      }, {
        value: 7,
        label: '7s'
      }, {
        value: 8,
        label: '8s'
      }, {
        value: 9,
        label: '9s'
      }, {
        value: 10,
        label: '10s'
      }, {
        value: 10,
        label: '10+ s'
      }]
    }]
  }
];

export default config;
