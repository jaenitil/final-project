

export const PIECE_TYPES = [
  { key: 'rings', label: 'Каблучки', match: /каблучк|перстен/i },
  { key: 'earrings', label: 'Сережки', match: /сережк/i },
  { key: 'necklaces', label: 'Кулони та намиста', match: /кулон|підвіск|намист|колʼє|колье/i },
  { key: 'bracelets', label: 'Браслети', match: /браслет/i },
]

export function inferPieceType(piece) {
  const haystack = `${piece?.name || ''} ${piece?.description || ''}`
  const found = PIECE_TYPES.find((type) => type.match.test(haystack))
  return found?.key || 'other'
}

export function pieceTypeLabel(key) {
  return PIECE_TYPES.find((type) => type.key === key)?.label || 'Інше'
}
