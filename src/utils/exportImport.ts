import { Tea, TeaType, TeaForm, Unit, TemperatureUnit } from '../types/Tea';

export const isValidTea = (tea: any): tea is Tea => {
  return (
    typeof tea === 'object' &&
    typeof tea.id === 'string' &&
    typeof tea.name === 'string' &&
    typeof tea.brand === 'string' &&
    Object.values(TeaType).includes(tea.type) &&
    Object.values(TeaForm).includes(tea.form) &&
    typeof tea.amount === 'number' &&
    Object.values(Unit).includes(tea.unit) &&
    typeof tea.rating === 'number' &&
    typeof tea.tastingNotes === 'string' &&
    typeof tea.brewingInstructions === 'object' &&
    typeof tea.brewingInstructions.temperature === 'number' &&
    Object.values(TemperatureUnit).includes(tea.brewingInstructions.tempUnit) &&
    typeof tea.brewingInstructions.steepTimeInSeconds === 'number'
  );
};

export const exportToJson = (teas: Tea[], selectedIds?: string[]): string => {
  const teaToExport = selectedIds 
    ? teas.filter(tea => selectedIds.includes(tea.id))
    : teas;

  return JSON.stringify(teaToExport, null, 2);
};

export const exportToCsv = (teas: Tea[], selectedIds?: string[]): string => {
  const teaToExport = selectedIds 
    ? teas.filter(tea => selectedIds.includes(tea.id))
    : teas;

  const headers = [
    'Name',
    'Brand',
    'Type',
    'Form',
    'Amount',
    'Unit',
    'Rating',
    'Brewing Temperature',
    'Temperature Unit',
    'Steep Time (minutes)',
    'Tasting Notes'
  ];

  const rows = teaToExport.map(tea => [
    tea.name,
    tea.brand,
    tea.type,
    tea.form,
    tea.amount,
    tea.unit,
    tea.rating,
    tea.brewingInstructions.temperature,
    tea.brewingInstructions.tempUnit,
    tea.brewingInstructions.steepTimeInSeconds / 60,
    tea.tastingNotes
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
};

export const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
