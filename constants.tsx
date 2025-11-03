import { InspectionSectionInfo } from './types';

export const INSPECTION_SECTIONS: InspectionSectionInfo[] = [
  {
    id: 'external_systems',
    title: 'VI: External Engineering Systems',
    items: [
      { id: 'water_supply', title: 'Water Supply' },
      { id: 'sewerage', title: 'Sewerage' },
      { id: 'heat_supply', title: 'Heat Supply' },
      { id: 'gas_supply', title: 'Gas Supply' },
      { id: 'power_supply', title: 'Power Supply' },
    ],
  },
  {
    id: 'boiler_room',
    title: 'VII: Boiler Room and Equipment',
    items: [
      { id: 'heating_boiler', title: 'Heating Boiler' },
      { id: 'water_heater', title: 'Water Heater' },
      { id: 'pumps', title: 'Pumps' },
      { id: 'pipelines', title: 'Pipelines and Fittings' },
    ],
  },
  {
    id: 'internal_networks',
    title: 'VIII: Internal Networks',
    items: [
      { id: 'internal_water_supply', title: 'Internal Water Supply' },
      { id: 'internal_sewerage', title: 'Internal Sewerage' },
      { id: 'heating_system', title: 'Heating System' },
      { id: 'ventilation_system', title: 'Ventilation and AC' },
    ],
  },
  {
    id: 'site_equipment',
    title: 'IX: Equipment (Site/Plot)',
    items: [
      { id: 'fencing', title: 'Fencing' },
      { id: 'gates', title: 'Gates and Wickets' },
      { id: 'lighting', title: 'Site Lighting' },
      { id: 'paving', title: 'Paving and Paths' },
    ],
  },
  {
    id: 'security_telecom',
    title: 'X: Security and Telecom',
    items: [
      { id: 'security_system', title: 'Security System' },
      { id: 'fire_alarm', title: 'Fire Alarm System' },
      { id: 'cctv', title: 'CCTV' },
      { id: 'internet_tv', title: 'Internet and TV' },
    ],
  },
];
