// Valid category/kind/unit triples, one per domain tab. Not test data: no
// assertion reads them, they exist to clear createProductSchema's category/kind
// refine. Spread one into a fixture and add the name/brand the test asserts on.

export const SKINCARE = { category: 'skincare', kind: 'serum', unit: 'pump' } as const
export const HAIRCARE = { category: 'haircare', kind: 'shampoo', unit: 'bottle' } as const
export const DENTAL = { category: 'dental', kind: 'toothpaste', unit: 'tube' } as const
export const COMPLEMENT = { category: 'complement', kind: 'gelule', unit: 'capsule' } as const
export const SOLAIRE = { category: 'solaire', kind: 'sunscreen', unit: 'tube' } as const
export const BODYCARE = { category: 'bodycare', kind: 'body-lotion', unit: 'pump' } as const
