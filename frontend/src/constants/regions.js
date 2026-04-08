/* ------------------------------------------------------------------ */
/*  Region / area constants                                            */
/*  Used by MapPage for region filtering and map centering              */
/* ------------------------------------------------------------------ */

/** Region list for the dropdown/buttons (code maps to Korea Tourism API areacode) */
export const regions = [
  { code: '', label: '전체' },
  { code: '1', label: '서울' },
  { code: '2', label: '인천' },
  { code: '3', label: '대전' },
  { code: '4', label: '대구' },
  { code: '5', label: '광주' },
  { code: '6', label: '부산' },
  { code: '7', label: '울산' },
  { code: '8', label: '세종' },
  { code: '31', label: '경기' },
  { code: '32', label: '강원' },
  { code: '33', label: '충북' },
  { code: '34', label: '충남' },
  { code: '35', label: '경북' },
  { code: '36', label: '경남' },
  { code: '37', label: '전북' },
  { code: '38', label: '전남' },
  { code: '39', label: '제주' },
];

/** Map center + zoom per region (for panning when a region is selected) */
export const regionCenters = {
  '1':  { lat: 37.5665, lng: 126.978,  zoom: 11 },
  '2':  { lat: 37.4563, lng: 126.7052, zoom: 11 },
  '3':  { lat: 36.3504, lng: 127.3845, zoom: 12 },
  '4':  { lat: 35.8714, lng: 128.6014, zoom: 12 },
  '5':  { lat: 35.1595, lng: 126.8526, zoom: 12 },
  '6':  { lat: 35.1796, lng: 129.0756, zoom: 11 },
  '7':  { lat: 35.5384, lng: 129.3114, zoom: 12 },
  '8':  { lat: 36.4800, lng: 127.2890, zoom: 12 },
  '31': { lat: 37.4138, lng: 127.5183, zoom: 9 },
  '32': { lat: 37.8228, lng: 128.1555, zoom: 9 },
  '33': { lat: 36.6357, lng: 127.4917, zoom: 9 },
  '34': { lat: 36.5184, lng: 126.8000, zoom: 9 },
  '35': { lat: 36.4919, lng: 128.8889, zoom: 9 },
  '36': { lat: 35.4606, lng: 128.2132, zoom: 9 },
  '37': { lat: 35.7175, lng: 127.1530, zoom: 9 },
  '38': { lat: 34.8679, lng: 126.9910, zoom: 9 },
  '39': { lat: 33.4890, lng: 126.4983, zoom: 10 },
};
